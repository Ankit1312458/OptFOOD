// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and tab contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current tab and content
            this.classList.add('active');
            document.getElementById(`${tabId}-donations`).classList.add('active');
        });
    });
    
    // Modal functionality
    const modal = document.getElementById('donation-details-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function() {
        // Clear session data
        sessionStorage.removeItem('ngoLoggedIn');
        sessionStorage.removeItem('ngoName');
        sessionStorage.removeItem('ngoId');
        
        // Redirect to login page
        window.location.href = 'login.html';
    });
    
    // Check if user is logged in
    const loggedIn = sessionStorage.getItem('ngoLoggedIn');
    if (!loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Display NGO name
    const ngoName = sessionStorage.getItem('ngoName') || 'NGO User';
    document.getElementById('ngo-name').textContent = ngoName;
    
    // Load data
    loadDonations();
    
    // Search functionality
    document.getElementById('search-donations').addEventListener('input', function() {
        filterDonations();
    });
    
    // Filter functionality
    document.getElementById('filter-category').addEventListener('change', function() {
        filterDonations();
    });
    
    document.getElementById('filter-location').addEventListener('change', function() {
        filterDonations();
    });
});

// Global variables to store donations data
let foodDonations = [];
let itemDonations = [];
let acceptedDonations = [];
let donationHistory = [];

// Function to load donations from localStorage or mock data
async function loadDonations() {
    try {
        // Attempt to load food donations from localStorage
        const storedFoodDonations = localStorage.getItem('foodDonations');
        if (storedFoodDonations) {
            foodDonations = JSON.parse(storedFoodDonations);
        } else {
            // Use mock data if no localStorage data
            foodDonations = getMockFoodDonations();
        }
        
        // Attempt to load item donations from localStorage
        const storedItemDonations = localStorage.getItem('itemDonations');
        if (storedItemDonations) {
            itemDonations = JSON.parse(storedItemDonations);
        } else {
            // Use mock data if no localStorage data
            itemDonations = getMockItemDonations();
        }
        
        // Load accepted donations from sessionStorage
        const storedAcceptedDonations = sessionStorage.getItem('acceptedDonations');
        if (storedAcceptedDonations) {
            acceptedDonations = JSON.parse(storedAcceptedDonations);
        }
        
        // Load donation history from sessionStorage
        const storedDonationHistory = sessionStorage.getItem('donationHistory');
        if (storedDonationHistory) {
            donationHistory = JSON.parse(storedDonationHistory);
        }
        
        // Populate locations dropdown
        populateLocationsDropdown();
        
        // Display donations
        displayAvailableDonations();
        displayAcceptedDonations();
        displayDonationHistory();
    } catch (error) {
        console.error('Error loading donations:', error);
    }
}

// Function to get mock food donations (if localStorage is empty)
function getMockFoodDonations() {
    return [
        {
            id: 'food-1',
            type: 'food',
            title: 'Packaged Rice and Beans',
            quantity: '20 kg',
            expiryDate: '2025-05-10',
            donorName: 'Local Grocery Store',
            location: 'Downtown',
            description: 'Unopened packages of rice and beans, still well within expiry date.',
            imageUrl: 'food1.jpg',
            donationDate: '2025-04-15',
            status: 'available'
        },
        {
            id: 'food-2',
            type: 'food',
            title: 'Fresh Vegetables',
            quantity: '15 kg',
            expiryDate: '2025-04-25',
            donorName: 'Farmers Market',
            location: 'Westside',
            description: 'Assorted fresh vegetables including carrots, potatoes, and cabbage.',
            imageUrl: 'food2.jpg',
            donationDate: '2025-04-18',
            status: 'available'
        },
        {
            id: 'food-3',
            type: 'food',
            title: 'Canned Goods',
            quantity: '50 cans',
            expiryDate: '2026-02-15',
            donorName: 'City Supermarket',
            location: 'Northside',
            description: 'Assorted canned goods including vegetables, fruits, and soups.',
            imageUrl: 'food3.jpg',
            donationDate: '2025-04-10',
            status: 'available'
        }
    ];
}

// Function to get mock item donations (if localStorage is empty)
function getMockItemDonations() {
    return [
        {
            id: 'item-1',
            type: 'items',
            title: 'Winter Clothing',
            quantity: '30 sets',
            condition: 'Good',
            donorName: 'Community Thrift Store',
            location: 'Eastside',
            description: 'Winter jackets, hats, and gloves suitable for adults and children.',
            imageUrl: 'item1.jpg',
            donationDate: '2025-04-12',
            status: 'available'
        },
        {
            id: 'item-2',
            type: 'items',
            title: 'School Supplies',
            quantity: '25 sets',
            condition: 'New',
            donorName: 'Office Supply Store',
            location: 'Downtown',
            description: 'Notebooks, pens, pencils, and other basic school supplies.',
            imageUrl: 'item2.jpg',
            donationDate: '2025-04-16',
            status: 'available'
        },
        {
            id: 'item-3',
            type: 'items',
            title: 'Hygiene Kits',
            quantity: '40 kits',
            condition: 'New',
            donorName: 'Local Pharmacy',
            location: 'Southside',
            description: 'Basic hygiene items including soap, toothpaste, toothbrushes, and shampoo.',
            imageUrl: 'item3.jpg',
            donationDate: '2025-04-14',
            status: 'available'
        }
    ];
}

// Function to populate locations dropdown
function populateLocationsDropdown() {
    const locationSelect = document.getElementById('filter-location');
    const locations = new Set();
    
    // Add locations from food donations
    foodDonations.forEach(donation => {
        if (donation.location) {
            locations.add(donation.location);
        }
    });
    
    // Add locations from item donations
    itemDonations.forEach(donation => {
        if (donation.location) {
            locations.add(donation.location);
        }
    });
    
    // Clear existing options except the first one
    while (locationSelect.options.length > 1) {
        locationSelect.remove(1);
    }
    
    // Add locations to dropdown
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
    });
}

// Function to display available donations
function displayAvailableDonations() {
    const donationsList = document.getElementById('available-donations-list');
    
    // Combine food and item donations
    const allDonations = [...foodDonations, ...itemDonations]
        .filter(donation => donation.status === 'available');
    
    // Sort by date (newest first)
    allDonations.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));
    
    if (allDonations.length === 0) {
        donationsList.innerHTML = `
            <div class="no-items">
                <i>📦</i>
                <h3>No donations available</h3>
                <p>Check back later for new donations</p>
            </div>
        `;
        return;
    }
    
    // Create HTML for each donation
    let donationsHTML = '';
    
    allDonations.forEach(donation => {
        donationsHTML += createDonationItemHTML(donation);
    });
    
    donationsList.innerHTML = donationsHTML;
    
    // Add event listeners to buttons
    addEventListenersToDonationItems();
}

// Function to create HTML for a donation item
function createDonationItemHTML(donation) {
    // Default image if none provided
    const imageUrl = donation.imageUrl || 'placeholder.jpg';
    
    // Format date
    const donationDate = new Date(donation.donationDate).toLocaleDateString();
    
    // Additional information based on donation type
    let additionalInfo = '';
    if (donation.type === 'food') {
        const expiryDate = new Date(donation.expiryDate).toLocaleDateString();
        additionalInfo = `<span>Expiry: ${expiryDate}</span>`;
    } else if (donation.type === 'items') {
        additionalInfo = `<span>Condition: ${donation.condition}</span>`;
    }
    
    return `
        <div class="donation-item" data-id="${donation.id}" data-type="${donation.type}">
            <div class="donation-item-image">
                <img src="${imageUrl}" alt="${donation.title}" onerror="this.src='placeholder.jpg'">
            </div>
            <div class="donation-item-details">
                <h3 class="donation-item-title">${donation.title}</h3>
                <div class="donation-item-info">
                    <span>Quantity: ${donation.quantity}</span>
                    ${additionalInfo}
                    <span>Location: ${donation.location}</span>
                    <span>Date: ${donationDate}</span>
                </div>
                <p class="donation-item-description">${donation.description}</p>
            </div>
            <div class="donation-item-actions">
                <button class="action-btn details-btn view-details" data-id="${donation.id}" data-type="${donation.type}">View Details</button>
                <button class="action-btn accept-btn accept-donation" data-id="${donation.id}" data-type="${donation.type}">Accept</button>
            </div>
        </div>
    `;
}

// Function to add event listeners to donation items
function addEventListenersToDonationItems() {
    // View details buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const donationId = this.getAttribute('data-id');
            const donationType = this.getAttribute('data-type');
            showDonationDetails(donationId, donationType);
        });
    });
    
    // Accept donation buttons
    const acceptButtons = document.querySelectorAll('.accept-donation');
    acceptButtons.forEach(button => {
        button.addEventListener('click', function() {
            const donationId = this.getAttribute('data-id');
            const donationType = this.getAttribute('data-type');
            acceptDonation(donationId, donationType);
        });
    });
}

// Function to show donation details in modal
function showDonationDetails(donationId, donationType) {
    let donation;
    
    if (donationType === 'food') {
        donation = foodDonations.find(item => item.id === donationId);
    } else if (donationType === 'items') {
        donation = itemDonations.find(item => item.id === donationId);
    }
    
    if (!donation) {
        console.error('Donation not found');
        return;
    }
    
    const modalContent = document.getElementById('donation-details-content');
    const modalTitle = document.querySelector('.modal-title');
    
    // Set modal title
    modalTitle.textContent = donation.title;
    
    // Create details content
    let detailsHTML = `
        <div style="display: flex; margin-bottom: 20px;">
            <div style="width: 150px; height: 150px; overflow: hidden; border-radius: 8px; margin-right: 20px;">
                <img src="${donation.imageUrl || 'placeholder.jpg'}" alt="${donation.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='placeholder.jpg'">
            </div>
            <div>
                <p><strong>Donor:</strong> ${donation.donorName}</p>
                <p><strong>Quantity:</strong> ${donation.quantity}</p>
                <p><strong>Location:</strong> ${donation.location}</p>
                <p><strong>Donation Date:</strong> ${new Date(donation.donationDate).toLocaleDateString()}</p>
    `;
    
    // Type-specific details
    if (donation.type === 'food') {
        detailsHTML += `<p><strong>Expiry Date:</strong> ${new Date(donation.expiryDate).toLocaleDateString()}</p>`;
    } else if (donation.type === 'items') {
        detailsHTML += `<p><strong>Condition:</strong> ${donation.condition}</p>`;
    }
    
    detailsHTML += `
            </div>
        </div>
        <div>
            <h4>Description</h4>
            <p>${donation.description}</p>
        </div>
    `;
    
    modalContent.innerHTML = detailsHTML;
    
    // Set up accept button in the modal
    const acceptBtn = document.getElementById('accept-donation-btn');
    acceptBtn.setAttribute('data-id', donationId);
    acceptBtn.setAttribute('data-type', donationType);
    
    // Add event listener to accept button
    acceptBtn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const type = this.getAttribute('data-type');
        acceptDonation(id, type);
        document.getElementById('donation-details-modal').style.display = 'none';
    });
    
    // Show modal
    document.getElementById('donation-details-modal').style.display = 'flex';
}

// Function to accept a donation
function acceptDonation(donationId, donationType) {
    let donationsList;
    let donation;
    
    if (donationType === 'food') {
        donationsList = foodDonations;
    } else if (donationType === 'items') {
        donationsList = itemDonations;
    } else {
        console.error('Invalid donation type');
        return;
    }
    
    // Find the donation
    donation = donationsList.find(item => item.id === donationId);
    
    if (!donation) {
        console.error('Donation not found');
        return;
    }
    
    // Update donation status
    donation.status = 'accepted';
    donation.acceptedDate = new Date().toISOString();
    
    // Add to accepted donations
    acceptedDonations.push({...donation});
    
    // Save to sessionStorage
    sessionStorage.setItem('acceptedDonations', JSON.stringify(acceptedDonations));
    
    // Update localStorage for the donation type
    if (donationType === 'food') {
        localStorage.setItem('foodDonations', JSON.stringify(foodDonations));
    } else if (donationType === 'items') {
        localStorage.setItem('itemDonations', JSON.stringify(itemDonations));
    }
    
    // Refresh displays
    displayAvailableDonations();
    displayAcceptedDonations();
    
    // Show success message
    alert(`You have successfully accepted the donation: ${donation.title}`);
}

// Function to display accepted donations
function displayAcceptedDonations() {
    const acceptedList = document.getElementById('accepted-donations-list');
    
    if (acceptedDonations.length === 0) {
        acceptedList.innerHTML = `
            <div class="no-items">
                <i>✓</i>
                <h3>No accepted donations</h3>
                <p>When you accept donations, they will appear here</p>
            </div>
        `;
        return;
    }
    
    // Sort by accepted date (newest first)
    acceptedDonations.sort((a, b) => new Date(b.acceptedDate) - new Date(a.acceptedDate));
    
    // Create HTML for each accepted donation
    let acceptedHTML = '';
    
    acceptedDonations.forEach(donation => {
        const imageUrl = donation.imageUrl || 'placeholder.jpg';
        const acceptedDate = new Date(donation.acceptedDate).toLocaleDateString();
        
        acceptedHTML += `
            <div class="donation-item">
                <div class="donation-item-image">
                    <img src="${imageUrl}" alt="${donation.title}" onerror="this.src='placeholder.jpg'">
                </div>
                <div class="donation-item-details">
                    <h3 class="donation-item-title">${donation.title}</h3>
                    <div class="donation-item-info">
                        <span>Quantity: ${donation.quantity}</span>
                        <span>Location: ${donation.location}</span>
                        <span>Accepted on: ${acceptedDate}</span>
                    </div>
                    <p class="donation-item-description">${donation.description}</p>
                </div>
                <div class="donation-item-actions">
                    <button class="action-btn details-btn view-details" data-id="${donation.id}" data-type="${donation.type}">View Details</button>
                    <button class="action-btn accept-btn" style="background-color: #3182ce;" onclick="completeDonation('${donation.id}')">Mark as Completed</button>
                </div>
            </div>
        `;
    });
    
    acceptedList.innerHTML = acceptedHTML;
    
    // Add event listeners to view details buttons
    const viewDetailsButtons = acceptedList.querySelectorAll('.view-details');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const donationId = this.getAttribute('data-id');
            const donationType = this.getAttribute('data-type');
            showDonationDetails(donationId, donationType);
        });
    });
}

// Function to mark a donation as completed
function completeDonation(donationId) {
    // Find the donation in accepted donations
    const donationIndex = acceptedDonations.findIndex(item => item.id === donationId);
    
    if (donationIndex === -1) {
        console.error('Donation not found in accepted donations');
        return;
    }
    
    const donation = acceptedDonations[donationIndex];
    donation.status = 'completed';
    donation.completedDate = new Date().toISOString();
    
    // Move to history
    donation
    // Function to mark a donation as completed (continued)
function completeDonation(donationId) {
    // Find the donation in accepted donations
    const donationIndex = acceptedDonations.findIndex(item => item.id === donationId);
    
    if (donationIndex === -1) {
        console.error('Donation not found in accepted donations');
        return;
    }
    
    const donation = acceptedDonations[donationIndex];
    donation.status = 'completed';
    donation.completedDate = new Date().toISOString();
    
    // Move to history
    donationHistory.push({...donation});
    
    // Remove from accepted donations
    acceptedDonations.splice(donationIndex, 1);
    
    // Save to sessionStorage
    sessionStorage.setItem('acceptedDonations', JSON.stringify(acceptedDonations));
    sessionStorage.setItem('donationHistory', JSON.stringify(donationHistory));
    
    // Refresh displays
    displayAcceptedDonations();
    displayDonationHistory();
    
    // Show success message
    alert(`Donation "${donation.title}" has been marked as completed.`);
}

// Function to display donation history
function displayDonationHistory() {
    const historyList = document.getElementById('history-list');
    
    if (donationHistory.length === 0) {
        historyList.innerHTML = `
            <div class="no-items">
                <i>📜</i>
                <h3>No donation history</h3>
                <p>Your completed donations will appear here</p>
            </div>
        `;
        return;
    }
    
    // Sort by completed date (newest first)
    donationHistory.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));
    
    // Create HTML for each history item
    let historyHTML = '';
    
    donationHistory.forEach(donation => {
        const imageUrl = donation.imageUrl || 'placeholder.jpg';
        const completedDate = new Date(donation.completedDate).toLocaleDateString();
        
        historyHTML += `
            <div class="donation-item">
                <div class="donation-item-image">
                    <img src="${imageUrl}" alt="${donation.title}" onerror="this.src='placeholder.jpg'">
                </div>
                <div class="donation-item-details">
                    <h3 class="donation-item-title">${donation.title}</h3>
                    <div class="donation-item-info">
                        <span>Quantity: ${donation.quantity}</span>
                        <span>Location: ${donation.location}</span>
                        <span>Completed on: ${completedDate}</span>
                    </div>
                    <p class="donation-item-description">${donation.description}</p>
                </div>
                <div class="donation-item-actions">
                    <button class="action-btn details-btn view-details" data-id="${donation.id}" data-type="${donation.type}">View Details</button>
                </div>
            </div>
        `;
    });
    
    historyList.innerHTML = historyHTML;
    
    // Add event listeners to view details buttons
    const viewDetailsButtons = historyList.querySelectorAll('.view-details');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const donationId = this.getAttribute('data-id');
            const donationType = this.getAttribute('data-type');
            showDonationDetails(donationId, donationType);
        });
    });
}

// Function to filter donations based on search and filters
function filterDonations() {
    const searchQuery = document.getElementById('search-donations').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;
    const locationFilter = document.getElementById('filter-location').value;
    
    // Filter food donations
    const filteredFoodDonations = foodDonations.filter(donation => {
        const matchesSearch = donation.title.toLowerCase().includes(searchQuery) || 
                             donation.description.toLowerCase().includes(searchQuery) ||
                             donation.donorName.toLowerCase().includes(searchQuery);
        
        const matchesCategory = categoryFilter === '' || categoryFilter === 'food';
        const matchesLocation = locationFilter === '' || donation.location === locationFilter;
        const isAvailable = donation.status === 'available';
        
        return matchesSearch && matchesCategory && matchesLocation && isAvailable;
    });
    
    // Filter item donations
    const filteredItemDonations = itemDonations.filter(donation => {
        const matchesSearch = donation.title.toLowerCase().includes(searchQuery) || 
                             donation.description.toLowerCase().includes(searchQuery) ||
                             donation.donorName.toLowerCase().includes(searchQuery);
        
        const matchesCategory = categoryFilter === '' || categoryFilter === 'items';
        const matchesLocation = locationFilter === '' || donation.location === locationFilter;
        const isAvailable = donation.status === 'available';
        
        return matchesSearch && matchesCategory && matchesLocation && isAvailable;
    });
    
    // Combine filtered donations
    const allFilteredDonations = [...filteredFoodDonations, ...filteredItemDonations];
    
    // Sort by date (newest first)
    allFilteredDonations.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));
    
    const donationsList = document.getElementById('available-donations-list');
    
    if (allFilteredDonations.length === 0) {
        donationsList.innerHTML = `
            <div class="no-items">
                <i>🔍</i>
                <h3>No matching donations found</h3>
                <p>Try changing your search criteria</p>
            </div>
        `;
        return;
    }
    
    // Create HTML for each filtered donation
    let donationsHTML = '';
    
    allFilteredDonations.forEach(donation => {
        donationsHTML += createDonationItemHTML(donation);
    });
    
    donationsList.innerHTML = donationsHTML;
    
    // Add event listeners to buttons
    addEventListenersToDonationItems();
}

// Function to fetch donations from donatefood.html and donateitems.html
function fetchDonationsFromLocalStorage() {
    try {
        // Try to fetch food donations
        const storedFoodData = localStorage.getItem('foodDonations');
        if (storedFoodData) {
            const parsedFoodDonations = JSON.parse(storedFoodData);
            if (Array.isArray(parsedFoodDonations)) {
                foodDonations = parsedFoodDonations;
            }
        }
        
        // Try to fetch item donations
        const storedItemData = localStorage.getItem('itemDonations');
        if (storedItemData) {
            const parsedItemDonations = JSON.parse(storedItemData);
            if (Array.isArray(parsedItemDonations)) {
                itemDonations = parsedItemDonations;
            }
        }
        
        // If both are empty, use mock data
        if (foodDonations.length === 0 && itemDonations.length === 0) {
            foodDonations = getMockFoodDonations();
            itemDonations = getMockItemDonations();
        }
        
        // Display the donations
        displayAvailableDonations();
    } catch (error) {
        console.error('Error fetching donations from localStorage:', error);
        // Use mock data as fallback
        foodDonations = getMockFoodDonations();
        itemDonations = getMockItemDonations();
        displayAvailableDonations();
    }
}

// Call this function when the page loads to attempt to fetch donations
window.addEventListener('DOMContentLoaded', fetchDonationsFromLocalStorage)};