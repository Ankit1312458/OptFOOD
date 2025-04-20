// Global state
const state = {
    foodDonations: [],
    itemDonations: [],
    acceptedDonations: [],
    donationHistory: []
  };
  
  // Initialize application when DOM is ready
  document.addEventListener('DOMContentLoaded', initializeApp);
  
  function initializeApp() {
    // Check if user is logged in
    if (!checkUserAuth()) return;
    
    // Initialize UI components
    setupTabs();
    setupModal();
    setupLogout();
    setupFilters();
    
    // Load and display data
    loadData();
  }
  
  // Authentication check
  function checkUserAuth() {
    const loggedIn = sessionStorage.getItem('ngoLoggedIn');
    if (!loggedIn) {
      window.location.href = 'login.html';
      return false;
    }
    
    // Display NGO name
    const ngoName = sessionStorage.getItem('ngoName') || 'NGO User';
    document.getElementById('ngo-name').textContent = ngoName;
    return true;
  }
  
  // Setup tab switching
  function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Update active states
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        this.classList.add('active');
        document.getElementById(`${tabId}-donations`).classList.add('active');
      });
    });
  }
  
  // Setup modal functionality
  function setupModal() {
    const modal = document.getElementById('donation-details-modal');
    
    // Close button handlers
    document.querySelectorAll('.close-modal').forEach(button => {
      button.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    });
    
    // Close when clicking outside
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  // Setup logout functionality
  function setupLogout() {
    document.getElementById('logout-btn').addEventListener('click', () => {
      // Clear session data
      sessionStorage.removeItem('ngoLoggedIn');
      sessionStorage.removeItem('ngoName');
      sessionStorage.removeItem('ngoId');
      
      // Redirect to login page
      window.location.href = 'login.html';
    });
  }
  
  // Setup search and filter functionality
  function setupFilters() {
    const searchInput = document.getElementById('search-donations');
    const categoryFilter = document.getElementById('filter-category');
    const locationFilter = document.getElementById('filter-location');
    
    // Add event listeners
    searchInput.addEventListener('input', filterDonations);
    categoryFilter.addEventListener('change', filterDonations);
    locationFilter.addEventListener('change', filterDonations);
  }
  
  // Load data from storage or mock data
  async function loadData() {
    try {
      // Load food donations
      state.foodDonations = loadFromStorage('foodDonations') || getMockFoodDonations();
      
      // Load item donations
      state.itemDonations = loadFromStorage('itemDonations') || getMockItemDonations();
      
      // Load accepted donations
      state.acceptedDonations = loadFromStorage('acceptedDonations', true) || [];
      
      // Load donation history
      state.donationHistory = loadFromStorage('donationHistory', true) || [];
      
      // Populate UI
      populateLocationsDropdown();
      refreshAllViews();
    } catch (error) {
      console.error('Error loading donations:', error);
      // Fall back to mock data
      state.foodDonations = getMockFoodDonations();
      state.itemDonations = getMockItemDonations();
      refreshAllViews();
    }
  }
  
  // Helper to load data from storage
  function loadFromStorage(key, useSessionStorage = false) {
    const storage = useSessionStorage ? sessionStorage : localStorage;
    const data = storage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  
  // Helper to save data to storage
  function saveToStorage(key, data, useSessionStorage = false) {
    const storage = useSessionStorage ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(data));
  }
  
  // Refresh all views
  function refreshAllViews() {
    displayAvailableDonations();
    displayAcceptedDonations();
    displayDonationHistory();
  }
  
  // Function to get mock food donations
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
  
  // Function to get mock item donations
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
  
  // Populate locations dropdown
  function populateLocationsDropdown() {
    const locationSelect = document.getElementById('filter-location');
    const locations = new Set();
    
    // Add all locations from donations
    [...state.foodDonations, ...state.itemDonations].forEach(donation => {
      if (donation.location) {
        locations.add(donation.location);
      }
    });
    
    // Clear existing options (except "All Locations")
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
  
  // Display available donations
  function displayAvailableDonations() {
    const donationsList = document.getElementById('available-donations-list');
    
    // Get available donations and sort by date
    const availableDonations = [...state.foodDonations, ...state.itemDonations]
      .filter(donation => donation.status === 'available')
      .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));
    
    // Handle empty state
    if (availableDonations.length === 0) {
      donationsList.innerHTML = getEmptyStateHTML('available');
      return;
    }
    
    // Create HTML for donations
    donationsList.innerHTML = availableDonations
      .map(donation => createDonationItemHTML(donation))
      .join('');
    
    // Add event listeners to buttons
    addEventListenersToDonationItems(donationsList);
  }
  
  // Display accepted donations
  function displayAcceptedDonations() {
    const acceptedList = document.getElementById('accepted-donations-list');
    
    // Handle empty state
    if (state.acceptedDonations.length === 0) {
      acceptedList.innerHTML = getEmptyStateHTML('accepted');
      return;
    }
    
    // Sort by accepted date
    const sortedDonations = [...state.acceptedDonations]
      .sort((a, b) => new Date(b.acceptedDate) - new Date(a.acceptedDate));
    
    // Create HTML for accepted donations
    acceptedList.innerHTML = sortedDonations
      .map(donation => {
        const donationHTML = createDonationItemHTML(donation);
        // Replace the "Accept" button with "Mark as Completed" button
        return donationHTML.replace(
          `<button class="action-btn accept-btn accept-donation" data-id="${donation.id}" data-type="${donation.type}">Accept</button>`,
          `<button class="action-btn accept-btn mark-completed" data-id="${donation.id}" style="background-color: #3182ce;">Mark as Completed</button>`
        );
      })
      .join('');
    
    // Add event listeners
    addEventListenersToDonationItems(acceptedList);
    
    // Add event listeners for "Mark as Completed" buttons
    const completeButtons = acceptedList.querySelectorAll('.mark-completed');
    completeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const donationId = this.getAttribute('data-id');
        completeDonation(donationId);
      });
    });
  }
  
  // Display donation history
  function displayDonationHistory() {
    const historyList = document.getElementById('history-list');
    
    // Handle empty state
    if (state.donationHistory.length === 0) {
      historyList.innerHTML = getEmptyStateHTML('history');
      return;
    }
    
    // Sort by completed date
    const sortedHistory = [...state.donationHistory]
      .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));
    
    // Create HTML for history items
    historyList.innerHTML = sortedHistory
      .map(donation => {
        // Use the regular donation HTML but remove the "Accept" button
        const donationHTML = createDonationItemHTML(donation);
        // Find and remove the accept button
        return donationHTML.replace(
          /<button class="action-btn accept-btn accept-donation"[^>]*>Accept<\/button>/,
          ''
        );
      })
      .join('');
    
    // Add event listeners for view details buttons
    addEventListenersToDonationItems(historyList);
  }
  
  // Create HTML for a donation item
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
  
  // Add event listeners to donation items
  function addEventListenersToDonationItems(container) {
    // View details buttons
    const viewDetailsButtons = container.querySelectorAll('.view-details');
    viewDetailsButtons.forEach(button => {
      button.addEventListener('click', function() {
        const donationId = this.getAttribute('data-id');
        const donationType = this.getAttribute('data-type');
        showDonationDetails(donationId, donationType);
      });
    });
    
    // Accept donation buttons
    const acceptButtons = container.querySelectorAll('.accept-donation');
    acceptButtons.forEach(button => {
      button.addEventListener('click', function() {
        const donationId = this.getAttribute('data-id');
        const donationType = this.getAttribute('data-type');
        acceptDonation(donationId, donationType);
      });
    });
  }
  
  // Show donation details in modal
  function showDonationDetails(donationId, donationType) {
    // Find the donation in the appropriate collection
    let donation;
    
    switch(donationType) {
      case 'food':
        donation = state.foodDonations.find(item => item.id === donationId);
        break;
      case 'items':
        donation = state.itemDonations.find(item => item.id === donationId);
        break;
      default:
        // Try to find in accepted or history if not found
        donation = state.acceptedDonations.find(item => item.id === donationId) ||
                  state.donationHistory.find(item => item.id === donationId);
    }
    
    if (!donation) {
      console.error('Donation not found');
      return;
    }
    
    const modalContent = document.getElementById('donation-details-content');
    const modalTitle = document.querySelector('.modal-title');
    const acceptBtn = document.getElementById('accept-donation-btn');
    
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
    
    // Configure accept button visibility based on donation status
    if (donation.status === 'available') {
      acceptBtn.style.display = 'block';
      acceptBtn.setAttribute('data-id', donationId);
      acceptBtn.setAttribute('data-type', donationType);
      
      // Remove existing listeners and add new one
      acceptBtn.replaceWith(acceptBtn.cloneNode(true));
      document.getElementById('accept-donation-btn').addEventListener('click', function() {
        acceptDonation(donationId, donationType);
        document.getElementById('donation-details-modal').style.display = 'none';
      });
    } else {
      acceptBtn.style.display = 'none';
    }
    
    // Show modal
    document.getElementById('donation-details-modal').style.display = 'flex';
  }
  
  // Accept a donation
  function acceptDonation(donationId, donationType) {
    let donationCollection, donation;
    
    // Determine which collection to use
    if (donationType === 'food') {
      donationCollection = state.foodDonations;
    } else if (donationType === 'items') {
      donationCollection = state.itemDonations;
    } else {
      console.error('Invalid donation type');
      return;
    }
    
    // Find the donation
    donation = donationCollection.find(item => item.id === donationId);
    
    if (!donation) {
      console.error('Donation not found');
      return;
    }
    
    // Update donation status
    donation.status = 'accepted';
    donation.acceptedDate = new Date().toISOString();
    
    // Add to accepted donations
    state.acceptedDonations.push({...donation});
    
    // Save to storage
    saveToStorage('acceptedDonations', state.acceptedDonations, true);
    
    // Update localStorage for the donation type
    if (donationType === 'food') {
      saveToStorage('foodDonations', state.foodDonations);
    } else if (donationType === 'items') {
      saveToStorage('itemDonations', state.itemDonations);
    }
    
    // Refresh displays
    refreshAllViews();
    
    // Show success message
    alert(`You have successfully accepted the donation: ${donation.title}`);
  }
  
  // Complete a donation
  function completeDonation(donationId) {
    // Find the donation in accepted donations
    const donationIndex = state.acceptedDonations.findIndex(item => item.id === donationId);
    
    if (donationIndex === -1) {
      console.error('Donation not found in accepted donations');
      return;
    }
    
    const donation = state.acceptedDonations[donationIndex];
    donation.status = 'completed';
    donation.completedDate = new Date().toISOString();
    
    // Move to history
    state.donationHistory.push({...donation});
    
    // Remove from accepted donations
    state.acceptedDonations.splice(donationIndex, 1);
    
    // Save to sessionStorage
    saveToStorage('acceptedDonations', state.acceptedDonations, true);
    saveToStorage('donationHistory', state.donationHistory, true);
    
    // Refresh displays
    refreshAllViews();
    
    // Show success message
    alert(`Donation "${donation.title}" has been marked as completed.`);
  }
  
  // Filter available donations
  function filterDonations() {
    const searchQuery = document.getElementById('search-donations').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;
    const locationFilter = document.getElementById('filter-location').value;
    
    // Get available donations
    const availableFoodDonations = state.foodDonations.filter(d => d.status === 'available');
    const availableItemDonations = state.itemDonations.filter(d => d.status === 'available');
    
    // Apply filters
    const filteredFoodDonations = availableFoodDonations.filter(donation => {
      const matchesSearch = 
        donation.title.toLowerCase().includes(searchQuery) || 
        donation.description.toLowerCase().includes(searchQuery) ||
        donation.donorName.toLowerCase().includes(searchQuery);
      
      const matchesCategory = categoryFilter === '' || categoryFilter === 'food';
      const matchesLocation = locationFilter === '' || donation.location === locationFilter;
      
      return matchesSearch && matchesCategory && matchesLocation;
    });
    
    const filteredItemDonations = availableItemDonations.filter(donation => {
      const matchesSearch = 
        donation.title.toLowerCase().includes(searchQuery) || 
        donation.description.toLowerCase().includes(searchQuery) ||
        donation.donorName.toLowerCase().includes(searchQuery);
      
      const matchesCategory = categoryFilter === '' || categoryFilter === 'items';
      const matchesLocation = locationFilter === '' || donation.location === locationFilter;
      
      return matchesSearch && matchesCategory && matchesLocation;
    });
    
    // Combine and sort filtered donations
    const allFilteredDonations = [...filteredFoodDonations, ...filteredItemDonations]
      .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));
    
    const donationsList = document.getElementById('available-donations-list');
    
    // Handle empty state
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
    
    // Display filtered donations
    donationsList.innerHTML = allFilteredDonations
      .map(donation => createDonationItemHTML(donation))
      .join('');
    
    // Add event listeners
    addEventListenersToDonationItems(donationsList);
  }
  
  // Helper function for empty state HTML
  function getEmptyStateHTML(type) {
    switch(type) {
      case 'available':
        return `
          <div class="no-items">
            <i>📦</i>
            <h3>No donations available</h3>
            <p>Check back later for new donations</p>
          </div>
        `;
      case 'accepted':
        return `
          <div class="no-items">
            <i>✓</i>
            <h3>No accepted donations</h3>
            <p>When you accept donations, they will appear here</p>
          </div>
        `;
      case 'history':
        return `
          <div class="no-items">
            <i>📜</i>
            <h3>No donation history</h3>
            <p>Your completed donations will appear here</p>
          </div>
        `;
      case 'filtered':
        return `
          <div class="no-items">
            <i>🔍</i>
            <h3>No matching donations found</h3>
            <p>Try changing your search criteria</p>
          </div>
        `;
    }
  }