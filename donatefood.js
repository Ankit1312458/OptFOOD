// donatefood.js - Add this to your donatefood.html page

// Function to handle food donation submission
function submitFoodDonation(event) {
    event.preventDefault();
    
    // Get form values
    const foodType = document.getElementById('food-type').value;
    const quantity = document.getElementById('quantity').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const location = document.getElementById('location').value;
    const donorName = document.getElementById('donor-name').value;
    const description = document.getElementById('description').value;
    
    // Generate a unique ID
    const donationId = 'food-' + new Date().getTime();
    
    // Create donation object
    const foodDonation = {
        id: donationId,
        type: 'food',
        title: foodType,
        quantity: quantity,
        expiryDate: expiryDate,
        location: location,
        donorName: donorName,
        description: description,
        donationDate: new Date().toISOString(),
        status: 'available'
    };
    
    // Get existing donations from localStorage
    let foodDonations = [];
    const storedDonations = localStorage.getItem('foodDonations');
    
    if (storedDonations) {
        foodDonations = JSON.parse(storedDonations);
    }
    
    // Add new donation
    foodDonations.push(foodDonation);
    
    // Save back to localStorage
    localStorage.setItem('foodDonations', JSON.stringify(foodDonations));
    
    // Show success message
    alert('Thank you for your food donation! NGOs will be able to see it now.');
    
    // Reset form
    document.getElementById('food-donation-form').reset();
}

// Add event listener to form submit
document.addEventListener('DOMContentLoaded', function() {
    const foodDonationForm = document.getElementById('food-donation-form');
    if (foodDonationForm) {
        foodDonationForm.addEventListener('submit', submitFoodDonation);
    }
});