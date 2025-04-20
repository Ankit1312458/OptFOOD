// Functions for quantity management
function changeQuantity(id, amount) {
    const input = document.getElementById(id);
    let value = parseInt(input.value) || 0;
    value += amount;
    if (value < 0) value = 0;
    input.value = value;
    updateDonationDetails();
}

function updateDonationDetails() {
    const detailsDiv = document.getElementById('donation-details');
    let summaryText = '';
    let itemCount = 0;
    const quantityInputs = document.querySelectorAll('.quantity input');

    quantityInputs.forEach(input => {
        if (parseInt(input.value) > 0) {
            itemCount++;
            const foodItem = input.closest('.food-item');
            const itemName = foodItem.querySelector('.font-medium').textContent;
            const unitText = foodItem.querySelector('.text-sm').textContent;

            summaryText += `${itemName}: ${input.value} ${unitText}, `;
        }
    });

    if (summaryText) {
        detailsDiv.innerHTML = `<div class="flex items-center text-green-700 font-medium"><svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${itemCount} items selected</div><div class="mt-1">${summaryText.slice(0, -2)}</div>`;
    } else {
        detailsDiv.innerHTML = 'No items selected for donation yet.';
    }

    // Enable or disable submit button based on whether items are selected
    const submitBtn = document.getElementById('submit-donation');
    if (itemCount > 0) {
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        submitBtn.disabled = false;
    } else {
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        submitBtn.disabled = true;
    }
}

// Search function
function searchFood() {
    const input = document.getElementById("search");
    const filter = input.value.toUpperCase();
    const foodItems = document.querySelectorAll(".food-item");

    foodItems.forEach(item => {
        const itemName = item.querySelector(".font-medium");
        if (itemName) {
            if (itemName.textContent.toUpperCase().indexOf(filter) > -1) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        }
    });
}

// Donation submission and receipt handling
function submitDonation() {
    // Generate a receipt ID
    const receiptId = 'OPT-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('receipt-id').textContent = `Receipt #: ${receiptId}`;

    // Set current date
    const currentDate = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('receipt-date').textContent = currentDate.toLocaleDateString('en-US', dateOptions);

    // Build receipt items list
    const receiptItemsDiv = document.getElementById('receipt-items');
    receiptItemsDiv.innerHTML = '';

    let hasItems = false;
    const quantityInputs = document.querySelectorAll('.quantity input');

    // Create donation object to save in localStorage
    const foodDonation = {
        id: receiptId,
        type: 'food',
        items: [],
        donationDate: currentDate.toISOString(),
        status: 'donated'
    };

    // ✅ Add donor name and location
    const donorName = document.getElementById('donor-name').value;
    const location = document.getElementById('location').value;

    if (donorName) foodDonation.donorName = donorName;
    if (location) foodDonation.location = location;

    quantityInputs.forEach(input => {
        const value = parseInt(input.value) || 0;
        if (value > 0) {
            hasItems = true;
            const foodItem = input.closest('.food-item');
            const itemName = foodItem.querySelector('.font-medium').textContent;
            const unitText = foodItem.querySelector('.text-sm').textContent;

            // Add to receipt display
            const itemDiv = document.createElement('div');
            itemDiv.className = 'flex justify-between py-1 border-b border-dashed border-green-200';
            itemDiv.innerHTML = `
                <span>${itemName}</span>
                <span class="font-medium">${value} ${unitText}</span>
            `;
            receiptItemsDiv.appendChild(itemDiv);

            // Add to donation object
            foodDonation.items.push({
                name: itemName,
                quantity: value,
                unit: unitText
            });
        }
    });

    if (hasItems) {
        // Save to localStorage
        saveToLocalStorage(foodDonation);

        // Show the modal
        document.getElementById('receipt-modal').style.display = 'block';
    }
}

function saveToLocalStorage(donation) {
    // Get existing donations from localStorage
    let foodDonations = [];
    const storedDonations = localStorage.getItem('foodDonations');

    if (storedDonations) {
        foodDonations = JSON.parse(storedDonations);
    }

    // Add new donation
    foodDonations.push(donation);

    // Save back to localStorage
    localStorage.setItem('foodDonations', JSON.stringify(foodDonations));
}

function closeModal() {
    document.getElementById('receipt-modal').style.display = 'none';
}

function printReceipt() {
    window.print();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    updateDonationDetails();

    // Disable submit button initially
    const submitBtn = document.getElementById('submit-donation');
    submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    submitBtn.disabled = true;

    // Close modal if clicked outside
    window.onclick = function (event) {
        const modal = document.getElementById('receipt-modal');
        if (event.target === modal) {
            closeModal();
        }
    }
});
