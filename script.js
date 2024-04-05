//js
const products = [
    { name: 'Video Game', price: 60 },
    { name: 'Gaming Console', price: 500 },
    { name: 'Ice Cream', price: 12 },
    { name: 'Movie Ticket', price: 14 },
    { name: 'Pair of Pants', price: 40 },
    { name: 'Nerf Gun', price: 25 },
    { name: 'Pokemon Card Pack', price: 15 },
    { name: 'Anime Convention Ticket', price: 150 },
    { name: 'Fancy Pencil Set', price: 25 },
    { name: 'Movie Ticket 3 Pack', price: 40 },
    { name: 'High End Skateboard', price: 100 },
    { name: '$5 Roblox Gift Card', price: 5 },
    { name: '$10 Roblox Gift Card', price: 10 },
    { name: '$20 Roblox Gift Card', price: 20 },
    { name: 'Nike Shoes', price: 120 },
    { name: 'Lego Set', price: 80 },
    { name: 'Poster', price: 20 },
    { name: 'Music Album', price: 10 },
    { name: '3 Pizzas', price: 40 },
    { name: 'Anime Tee Shirt', price: 70 },
    { name: '$10 Arcade credits', price: 10 },
    { name: '$20 Arcade credits', price: 20 },
    { name: '$40 Arcade credits', price: 40 },
    { name: '$100 Arcade credits', price: 100 },
    { name: 'flowers', price: 34 },
    { name: '$5 Gift Card', price: 5, isGiftCard: true },
    { name: '$10 Gift Card', price: 10, isGiftCard: true },
    { name: '$20 Gift Card', price: 20, isGiftCard: true }
]
let balance = 0;
let cart = [];
let purchaseHistory = [];
let discountApplied = false;
let appliedDiscountPercentage = 0;
const discountCodes = {
    'melikemoney': 20, // This means a 20% discount
    'mereallylikemoney': 40,
    'mehopeyougobankrupt': 60,
    'melikefreestuff': 100,
};
let giftCardCodes = {}; // Stores codes and their values

function generateGiftCardCode(value) {
    const code = 'GC' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const apiKey = '660d8c40d34bb00dc38ed4a9'; // Use your actual API key
    const giftCardData = {
        code: code,
        value: value,
        isRedeemed: false
    };
    
    fetch('https://shoppingsite-0267.restdb.io/rest/gift-card-codes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        },
        body: JSON.stringify(giftCardData)
    })
    .then(response => response.json())
    .then(data => console.log('Gift card generated:', data))
    .catch(error => console.error('Error generating gift card:', error));

    return code;
}

function updateCartInDatabase(userId, newCart) {
    if (!userId) return; // Guard clause to prevent update attempts with invalid userId
    const url = `https://shoppingsite-0267.restdb.io/rest/accounts/${userId}`;
    const apiKey = '660d8c40d34bb00dc38ed4a9'; // Use your actual API key
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        },
        body: JSON.stringify({ cart: newCart })
    })
    .then(response => response.json())
    .then(data => console.log('Cart updated on server:', data))
    .catch(error => console.error('Error updating Cart:', error));
}

function addToCart(productName, price, isGiftCard = false) {
    cart.push({productName, price, isGiftCard});
    const userId = localStorage.getItem('userId');
    if (userId) {
        updateCartInDatabase(userId, cart); // Now userId is checked before calling update
    }
    renderCartItems();
}

function updatePurchaseHistoryInDatabase(userId, newPurchaseHistory) {
    if (!userId) return; // Guard clause
    const url = `https://shoppingsite-0267.restdb.io/rest/accounts/${userId}`;
    const apiKey = '660d8c40d34bb00dc38ed4a9'; // Use your actual API key
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        },
        body: JSON.stringify({ purchaseHistory: newPurchaseHistory })
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => console.log('Purchase history updated on server:', data))
    .catch(error => console.error('Error updating purchase history:', error));
}

// Products array remains unchanged

function renderCartItems() {
    const cartItemsEl = document.getElementById('cart-items');
    cartItemsEl.innerHTML = '';
    cart.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.textContent = `${item.productName} - $${item.price}`;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => removeFromCart(index);
        itemEl.appendChild(removeBtn);
        cartItemsEl.appendChild(itemEl);
    });
}

// Discount application function remains unchanged

function checkout() {
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    let discountAmount = total * (appliedDiscountPercentage / 100);
    let finalTotal = total - discountAmount;
    if (finalTotal > balance) {
        alert(`Insufficient balance. You need $${finalTotal - balance} more.`);
        return;
    }
    cart.forEach(item => {
        if (item.isGiftCard) {
            const code = generateGiftCardCode(item.price);
            alert(`Your gift card code: ${code}\nValue: $${item.price}`);
        }
    });
    balance -= finalTotal;
    purchaseHistory.push(...cart);
    cart = [];
    alert('Purchase successful!');
    updateBalanceDisplay();
    renderCartItems();
    renderPurchaseHistory();
    discountApplied = false;
    appliedDiscountPercentage = 0;
    document.getElementById('discount-code').value = '';
    const userId = localStorage.getItem('userId');
    if (userId) {
        updateBalanceInDatabase(userId, balance);
        updateCartInDatabase(userId, []);
        updatePurchaseHistoryInDatabase(userId, purchaseHistory);
    }
}

// Add balance, update balance display, and render purchase history functions remain unchanged

// Sort products function remains unchanged

function renderProducts(productArray) {
    const productListEl = document.getElementById('product-list');
    productListEl.innerHTML = '';
    productArray.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'product';
        productEl.innerHTML = `<span class="name">${product.name}</span><span class="price">$${product.price}</span><button onclick="addToCart('${product.name}', ${product.price}${product.isGiftCard ? ', true' : ''})">Add to Cart</button><button onclick="addToWishlist('${product.name}')" class="wishlist-btn">Add to Wishlist</button>`;
        productListEl.appendChild(productEl);
    });
}

function updateBalanceInDatabase(userId, newBalance) {
    if (!userId) return; // Guard clause
    const url = `https://shoppingsite-0267.restdb.io/rest/accounts/${userId}`;
    const apiKey = '660d8c40d34bb00dc38ed4a9'; // Use your actual API key
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        },
        body: JSON.stringify({ balance: newBalance })
    })
    .then(response => response.json())
    .then(data => console.log('Balance updated on server:', data))
    .catch(error => console.error('Error updating balance:', error));
}

function updateBalance(amount) {
    balance += amount;
    updateBalanceDisplay();
    const userId = localStorage.getItem('userId');
    if (userId) {
        updateBalanceInDatabase(userId, balance); // Ensuring userId is valid
    }
}

// Search, register, login, logout, and update login status functions remain unchanged

function redeemGiftCard(code) {
    const query = encodeURIComponent(`{"code":"${code}","isRedeemed":false}`);
    const url = `https://shoppingsite-0267.restdb.io/rest/gift-card-codes?q=${query}`;
    const apiKey = '660d8c40d34bb00dc38ed4a9'; // Use your actual API key
    fetch(url, {
        method: 'GET',
        headers: {
            'x-apikey': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.length === 0) {
            console.error('Gift card not found or already redeemed:', code);
            alert('Invalid or already redeemed gift card.');
        } else {
            console.log('Gift card data for redemption:', data[0]);
            const value = data[0].value;
            balance += value;
            updateBalanceDisplay();
            const userId = localStorage.getItem('userId');
            if (userId) {
                updateBalanceInDatabase(userId, balance); // Update the balance on redemption
            }
            return fetch(`https://shoppingsite-0267.restdb.io/rest/gift-card-codes/${data[0]._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': apiKey
                },
                body: JSON.stringify({
                    "isRedeemed": true
                })
            });
        }
    })
    .then(response => response.json())
    .then(updateData => console.log('Gift card redeemed successfully:', updateData))
    .catch(error => console.error('Error during the gift card redemption process:', error));
}

function updateGiftCardAsRedeemed(id, code, value) {
    const url = `https://shoppingsite-0267.restdb.io/rest/gift-card-codes/${id}`;
    const apiKey = '660d8c40d34bb00dc38ed4a9'; // Use your actual API key
    const bodyData = {
        "isRedeemed": true
    };
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        },
        body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(updatedData => console.log('Gift card redeemed successfully:', updatedData))
    .catch(error => console.error('Error marking gift card as redeemed:', error));
}

// Fetch user data, update user data, render wishlist, and related functions remain unchanged

// Make sure to include this new function in your existing script.
renderProducts(products);
updateBalanceDisplay();
renderWishlist();

// Ensure the 'your-api-key' placeholders are replaced with your actual API key from restdb.io.
window.onload = function() {
    updateLoginStatus();
};
