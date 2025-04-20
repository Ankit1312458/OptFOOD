// donateitems.js - Add this to your donateitems.html page

// Function to handle item donation submission
function submitItemDonation(event) {
    event.preventDefault();
    
    // Get form values
    const itemType = document.getElementById('item-type').value;
    const quantity = document.getElementById('quantity').value;
    const condition = document.getElementById('condition').value;
    const location = document.getElementById('location').value;
    const donorName = document.getElementById('donor-name').value;
    const description = document.getElementById('description').value;
    
    // Generate a unique ID
    const donationId = 'item-' + new Date().getTime();
    
    // Create donation object
    const itemDonation = {
        id: donationId,
        type: 'items',
        title: itemType,
        quantity: quantity,
        condition: condition,
        location: location,
        donorName: donorName,
        description: description,
        donationDate: new Date().toISOString(),
        status: 'available'
    };
    
    // Get existing donations from localStorage
    let itemDonations = [];
    const storedDonations = localStorage.getItem('itemDonations');
    
    if (storedDonations) {
        itemDonations = JSON.parse(storedDonations);
    }
    
    // Add new donation
    itemDonations.push(itemDonation);
    
    // Save back to localStorage
    localStorage.setItem('itemDonations', JSON.stringify(itemDonations));
    
    // Show success message
    alert('Thank you for your item donation! NGOs will be able to see it now.');
    
    // Reset form
    document.getElementById('item-donation-form').reset();
}

// Add event listener to form submit
document.addEventListener('DOMContentLoaded', function() {
    const itemDonationForm = document.getElementById('item-donation-form');
    if (itemDonationForm) {
        itemDonationForm.addEventListener('submit', submitItemDonation);
    }
});