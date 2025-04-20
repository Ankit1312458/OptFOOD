// Function to handle showing different item categories
function showCategory(categoryId) {
    // Hide all categories first
    const categories = document.querySelectorAll('.item-category');
    categories.forEach(category => {
        category.classList.remove('active');
    });
    
    // Show the selected category
    document.getElementById(categoryId).classList.add('active');
    
    // Update the active tab styling
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Find the tab that was clicked and make it active
    const tabs_array = Array.from(tabs);
    const activeTab = tabs_array.find(tab => tab.querySelector('div').textContent.trim().toLowerCase().includes(categoryId));
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// Function to handle quantity changes
function changeQuantity(itemId, change) {
    const inputElement = document.getElementById(itemId);
    let currentQuantity = parseInt(inputElement.value) || 0;
    
    // Calculate new quantity (ensure it's not negative)
    let newQuantity = currentQuantity + change;
    if (newQuantity < 0) newQuantity = 0;
    
    // Update the input value
    inputElement.value = newQuantity;
    
    // Update donation summary
    updateDonationSummary();
}

// Function to update the donation summary
function updateDonationSummary() {
    const donationDetails = document.getElementById('donation-details');
    let summary = '';
    let totalItems = 0;
    
    // List of all items to check
    const allItems = [
        // Clothing
        {id: 'tshirts', name: 'T-Shirts', unit: 'pieces'},
        {id: 'pants', name: 'Pants', unit: 'pieces'},
        {id: 'coats', name: 'Coats', unit: 'pieces'},
        {id: 'shirts', name: 'Shirts', unit: 'pieces'},
        {id: 'sweaters', name: 'Sweaters', unit: 'pieces'},
        {id: 'shoes', name: 'Shoes', unit: 'pairs'},
        
        // Household
        {id: 'bedsheets', name: 'Bed Sheets', unit: 'sets'},
        {id: 'blankets', name: 'Blankets', unit: 'pieces'},
        {id: 'towels', name: 'Towels', unit: 'pieces'},
        {id: 'pillows', name: 'Pillows', unit: 'pieces'},
        {id: 'curtains', name: 'Curtains', unit: 'pairs'},
        {id: 'kitchenware', name: 'Kitchenware', unit: 'pieces'},
        
        // Other
        {id: 'toys', name: 'Toys', unit: 'pieces'},
        {id: 'books', name: 'Books', unit: 'pieces'},
        {id: 'school_supplies', name: 'School Supplies', unit: 'sets'},
        {id: 'backpacks', name: 'Backpacks', unit: 'pieces'},
        {id: 'baby_items', name: 'Baby Items', unit: 'sets'},
        {id: 'electronics', name: 'Electronics', unit: 'pieces'}
    ];
    
    // Build summary of items with quantity > 0
    const donatedItems = [];
    
    allItems.forEach(item => {
        const quantity = parseInt(document.getElementById(item.id).value) || 0;
        if (quantity > 0) {
            donatedItems.push(`${quantity} ${item.name} (${item.unit})`);
            totalItems += quantity;
        }
    });
    
    // Update donation summary text
    if (donatedItems.length > 0) {
        summary = `<p class="mb-2">You're donating:</p>
                  <ul class="list-disc pl-5 mb-2">
                      ${donatedItems.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                  <p class="font-medium">Total: ${totalItems} items</p>`;
    } else {
        summary = 'No items selected for donation yet.';
    }
    
    donationDetails.innerHTML = summary;
    
    // Enable/disable submit button based on whether any items are selected
    const submitButton = document.getElementById('submit-donation');
    if (totalItems > 0) {
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
        submitButton.disabled = false;
    } else {
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');
        submitButton.disabled = true;
    }
}

// Function to search items
function searchItems() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const itemCards = document.querySelectorAll('.item-card');
    
    itemCards.forEach(card => {
        const itemName = card.querySelector('span.font-medium').textContent.toLowerCase();
        
        if (itemName.includes(searchInput)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to handle donation submission
function submitDonation() {
    // Gather all donated items
    const items = {};
    const allInputs = document.querySelectorAll('.quantity input');
    
    // Check if any items are selected
    let hasItems = false;
    
    allInputs.forEach(input => {
        const quantity = parseInt(input.value) || 0;
        if (quantity > 0) {
            items[input.id] = quantity;
            hasItems = true;
        }
    });
    
    // If no items are selected, show an alert and return
    if (!hasItems) {
        alert('Please select at least one item to donate.');
        return;
    }
    
    // Get special instructions
    const specialInstructions = document.getElementById('special-instructions').value;
    
    // Create donation object
    const donation = {
        items: items,
        specialInstructions: specialInstructions,
        date: new Date().toISOString()
    };
    
    // In a real application, this would be sent to a server
    // For now, just store in localStorage
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    donations.push(donation);
    localStorage.setItem('donations', JSON.stringify(donations));
    
    // Show the receipt modal
    showReceiptModal(donation);
}

// Function to display the receipt modal
function showReceiptModal(donation) {
    const modal = document.getElementById('receipt-modal');
    const receiptDate = document.getElementById('receipt-date');
    
    // Set the date
    const now = new Date();
    receiptDate.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    
    // Create receipt content
    const content = document.createElement('div');
    content.className = 'receipt bg-green-50 p-4 rounded-lg mb-4';
    
    // Add items to the receipt
    let receiptHTML = '<h3 class="font-bold text-green-700 mb-2">Items Donated:</h3><ul class="pl-5 mb-3">';
    
    // Get item names from the page
    const allItems = {};
    document.querySelectorAll('.item-card').forEach(card => {
        const itemName = card.querySelector('span.font-medium').textContent;
        const inputId = card.querySelector('.quantity input').id;
        const unit = card.querySelector('.text-sm.text-gray-500').textContent;
        allItems[inputId] = { name: itemName, unit: unit };
    });
    
    // Add each donated item to the receipt
    Object.keys(donation.items).forEach(itemId => {
        const quantity = donation.items[itemId];
        const itemInfo = allItems[itemId] || { name: itemId, unit: 'pieces' };
        receiptHTML += `<li>${quantity} ${itemInfo.name} (${itemInfo.unit})</li>`;
    });
    
    receiptHTML += '</ul>';
    
    // Add special instructions if provided
    if (donation.specialInstructions) {
        receiptHTML += `<div class="mb-3">
            <h3 class="font-bold text-green-700 mb-1">Special Instructions:</h3>
            <p class="italic text-gray-700">${donation.specialInstructions}</p>
        </div>`;
    }
    
    // Add donation ID and thank you message
    const donationId = 'DON-' + Math.floor(Math.random() * 10000);
    receiptHTML += `<p class="text-sm text-gray-600 mb-2">Donation ID: ${donationId}</p>
        <div class="bg-green-100 p-3 rounded-lg text-center">
            <h3 class="font-bold text-green-700 mb-1">Thank You!</h3>
            <p class="text-green-700">Your donation will help those in need.</p>
        </div>`;
    
    content.innerHTML = receiptHTML;
    
    // Insert receipt content before the first child of the modal body
    const modalBody = document.querySelector('#receipt-modal .p-6');
    if (modalBody.children.length > 0) {
        modalBody.insertBefore(content, modalBody.children[1]);
    } else {
        modalBody.appendChild(content);
    }
    
    // Show the modal
    modal.style.display = 'block';
    
    // Reset all input values after submission
    document.querySelectorAll('.quantity input').forEach(input => {
        input.value = 0;
    });
    
    // Clear special instructions
    document.getElementById('special-instructions').value = '';
    
    // Update donation summary
    updateDonationSummary();
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('receipt-modal');
    modal.style.display = 'none';
    
    // Remove the receipt content to avoid duplication on next opening
    const receiptContent = document.querySelector('#receipt-modal .receipt');
    if (receiptContent) {
        receiptContent.remove();
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initial update of donation summary
    updateDonationSummary();
    
    // Set up event listeners for the search functionality
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', searchItems);
    }
    
    // Make the submit button disabled initially (until items are selected)
    const submitButton = document.getElementById('submit-donation');
    if (submitButton) {
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');
        submitButton.disabled = true;
    }
    
    // Close modal if clicking outside of content
    window.onclick = function(event) {
        const modal = document.getElementById('receipt-modal');
        if (event.target === modal) {
            closeModal();
        }
    };
});