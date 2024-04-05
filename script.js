// Global Variables
let balance = 0;
let cart = [];
let purchaseHistory = [];
let discountApplied = false;
let appliedDiscountPercentage = 0;
const discountCodes = {
    'melikemoney': 20, // 20% discount
    'mereallylikemoney': 40, // 40% discount
    'mehopeyougobankrupt': 60, // 60% discount
    'melikefreestuff': 100, // 100% discount
};
const apiKey = '660d8c40d34bb00dc38ed4a9'; // Your API key for restdb.io

// Example Product List
const products = [
    { name: 'Video Game', price: 60 },
    // Add other products as needed
];

// Function to Render Cart Items
function renderCartItems() {
    // Implementation depends on your HTML structure
}

// Function to Add to Cart
function addToCart(productName, price) {
    cart.push({ productName, price });
    renderCartItems();
}

// Function to Register a User
function register(username, password) {
    const url = 'https://shoppingsite-0267.restdb.io/rest/accounts';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log('User registered:', data);
        alert('Registration successful!');
    })
    .catch(error => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
    });
}

// Function to Log In
function login(username, password) {
    const query = encodeURIComponent(`{"username":"${username}","password":"${password}"}`);
    const url = `https://shoppingsite-0267.restdb.io/rest/accounts?q=${query}`;
    fetch(url, {
        method: 'GET',
        headers: { 'x-apikey': apiKey }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            alert('Login successful');
            localStorage.setItem('isLoggedIn', 'true');
            // Update login status on UI
        } else {
            alert('Login failed. Username or password is incorrect.');
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');
    });
}

// Function to Redeem a Gift Card
function redeemGiftCard(code) {
    const query = encodeURIComponent(`{"code":"${code}","isRedeemed":false}`);
    const url = `https://shoppingsite-0267.restdb.io/rest/gift-card-codes?q=${query}`;
    fetch(url, {
        method: 'GET',
        headers: { 'x-apikey': apiKey }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            const giftCard = data[0];
            balance += giftCard.value; // Assuming 'value' field holds the gift card amount
            updateBalanceDisplay(); // Refresh the balance displayed on the UI
            markGiftCardAsRedeemed(giftCard._id); // Mark the gift card as redeemed
        } else {
            alert('Invalid or already redeemed gift card.');
        }
    })
    .catch(error => {
        console.error('Error redeeming gift card:', error);
        alert('Error redeeming gift card. Please try again.');
    });
}

// Function to Mark a Gift Card as Redeemed
function markGiftCardAsRedeemed(id) {
    const url = `https://shoppingsite-0267.restdb.io/rest/gift-card-codes/${id}`;
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        },
        body: JSON.stringify({ "isRedeemed": true })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to mark gift card as redeemed');
        console.log('Gift card marked as redeemed');
    })
    .catch(error => {
        console.error('Error marking gift card as redeemed:', error);
    });
}

// Function to Update Balance Display (Placeholder Implementation)
function updateBalanceDisplay() {
    // Update the UI with the new balance
}
