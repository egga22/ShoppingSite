//js
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
    const apiKey = '660d8c40d34bb00dc38ed4a9'; // Remember to secure your API key
    const giftCardData = {
        code: code,
        value: value,
        isRedeemed: false
    };
    
    // Use fetch to POST giftCardData to your restdb.io gift card collection
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

    return code; // Might want to adjust handling based on async nature of POST
}



function addToCart(productName, price, isGiftCard = false) {
    cart.push({productName, price, isGiftCard});
    renderCartItems();
}



const products = [
    //products
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
    
    { name: '$5 Gift Card', price: 5, isGiftCard: true },
    { name: '$10 Gift Card', price: 10, isGiftCard: true },
    { name: '$20 Gift Card', price: 20, isGiftCard: true }
  
];
let currentDisplayedProducts = products; // This will always hold the currently displayed products

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

function applyDiscount() {
    const discountCode = document.getElementById('discount-code').value;
    if (discountCodes[discountCode] && !discountApplied) {
        appliedDiscountPercentage = discountCodes[discountCode];
        alert(`Discount applied: ${appliedDiscountPercentage}%`);
        discountApplied = true;
    } else if (discountApplied) {
        alert('Discount already applied.');
    } else {
        alert('Invalid discount code.');
    }
}


function checkout() {
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    let discountAmount = total * (appliedDiscountPercentage / 100);
    let finalTotal = total - discountAmount;

    if (finalTotal > balance) {
        alert(`Insufficient balance. You need $${finalTotal - balance} more.`);
        return;
    }
    
    // Process gift cards in the cart
    cart.forEach(item => {
        if (item.isGiftCard) {
            const code = generateGiftCardCode(item.price); // Adjust generateGiftCardCode to return the code
            alert(`Your gift card code: ${code}\nValue: $${item.price}`);
        }
    });

    // Complete the checkout process
    balance -= finalTotal;
    purchaseHistory.push(...cart.filter(item => !item.isGiftCard)); // Exclude gift cards from purchase history
    cart = []; // Clear the cart
    alert('Purchase successful!');
    updateBalanceDisplay();
    renderCartItems();
    renderPurchaseHistory();
    discountApplied = false;
    appliedDiscountPercentage = 0;
    document.getElementById('discount-code').value = ''; // Clear the discount code field
}
function addBalance() {
    const amount = prompt('How much would you like to add?');
    if (amount) {
        balance += parseInt(amount, 10);
        updateBalanceDisplay();
    }
}

function updateBalanceDisplay() {
    document.getElementById('balance-amount').textContent = balance;
}

function renderPurchaseHistory() {
    const historyItemsEl = document.getElementById('history-items');
    historyItemsEl.innerHTML = ''; // Clear current items
    purchaseHistory.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.textContent = `${item.productName} - $${item.price}`;
        historyItemsEl.appendChild(itemEl);
    });
}

function clearHistory() {
    purchaseHistory = [];
    renderPurchaseHistory();
}
function sortProducts(sortMethod) {
    let sortedProducts = [...currentDisplayedProducts]; // Create a copy to sort
    switch (sortMethod) {
        case 'priceLowToHigh':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'priceHighToLow':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'alphabeticalAZ':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'alphabeticalZA':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'default':
            // If you want "default" to return to the original list order,
            // you'll need to maintain an original, unsorted copy of products
            // or reload it if it's dynamically fetched.
            break;
    }
    renderProducts(sortedProducts); // Render the sorted list
}

function renderProducts(productArray) {
    const productListEl = document.getElementById('product-list');
    productListEl.innerHTML = ''; // Clear existing items

    productArray.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'product';
        productEl.innerHTML = `
            <span class="name">${product.name}</span>
            <span class="price">$${product.price}</span>
            <button onclick="addToCart('${product.name.replace("'", "\\'")}', ${product.price}${product.isGiftCard ? ', true' : ''})">Add to Cart</button>
            <button onclick="addToWishlist('${product.name.replace("'", "\\'")}')" class="wishlist-btn">Add to Wishlist</button>
        `;
        productListEl.appendChild(productEl);
    });
}


// Existing JavaScript code

function updateBalance(amount) {
    balance += amount;
    updateBalanceDisplay();
}
function searchProducts() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchValue)
    );
    renderProducts(filteredProducts); // Ensure this calls the correctly defined renderProducts function
}
function attemptRegister() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    register(username, password);
}
function register(username, password) {
    // Ensure the username is unique and has not been used before
    username = String(username).trim();
    password = String(password).trim();

    const url = 'https://shoppingsite-0267.restdb.io/rest/accounts';
    const apiKey = '660d8c40d34bb00dc38ed4a9'; // Remember to secure your API key

    const userData = {
        "Username": username,
        "password": password
    };

    console.log("Attempting to register:", userData); // Log the userData for debugging

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.message || "Failed to register.");
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('User registered:', data);
        alert('Registration successful!');
        // Handle successful registration
    })
    .catch(error => {
        console.error('Error during registration:', error);
        alert(`Registration failed: ${error.message}`);
    });
}



function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const query = encodeURIComponent(`{"Username":"${username}","password":"${password}"}`);
    const url = `https://shoppingsite-0267.restdb.io/rest/accounts?q=${query}`;
    const apiKey = '660d8c40d34bb00dc38ed4a9'; // Ensure your API key is correct

    fetch(url, {
        method: 'GET',
        headers: {
            'x-apikey': apiKey
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.length > 0) {
            // User found
            alert('Login successful');
            localStorage.setItem('isLoggedIn', 'true');
            updateLoginStatus();
        } else {
            // User not found
            alert('Login failed');
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('Login failed');
    });
}



function logout() {
    localStorage.removeItem('isLoggedIn');
    updateLoginStatus();
}

function updateLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('register').style.display = 'none';
        document.getElementById('logout-section').style.display = 'block';
    } else {
        document.getElementById('login').style.display = 'block';
        document.getElementById('register').style.display = 'block';
        document.getElementById('logout-section').style.display = 'none';
    }
}

function redeemGiftCard(code) {
    const query = encodeURIComponent(`{"code":"${code}","isRedeemed":false}`);
    const url = `https://shoppingsite-0267.restdb.io/rest/gift-card-codes?q=${query}`;
    const apiKey = '660d8c40d34bb00dc38ed4a9'; // Replace with your actual API key

    fetch(url, {
        method: 'GET',
        headers: {
            'x-apikey': apiKey
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch gift card data');
        return response.json();
    })
    .then(data => {
        if (data.length === 0) {
            console.error('Gift card not found or already redeemed:', code);
            alert('Invalid or already redeemed gift card.');
        } else {
            console.log('Gift card data for redemption:', data[0]);
            const value = data[0].value; // Define the value variable here
            balance += value; // Use the defined value variable
            updateBalanceDisplay(); // Refresh the displayed balance
            // Mark the gift card as redeemed using the _id from the fetched data
            return fetch(`https://shoppingsite-0267.restdb.io/rest/gift-card-codes/${data[0]._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': apiKey
                },
                body: JSON.stringify({
                    "code": data[0].code, // Assuming you want to reaffirm the code, though this might be optional depending on your backend requirements.
                    "value": value, // Use the value variable here
                    "isRedeemed": true
                })
            });
        }
    })
    .then(updateResponse => {
        if (!updateResponse.ok) throw new Error('Failed to mark gift card as redeemed');
        return updateResponse.json();
    })
    .then(updateData => {
        console.log('Gift card redeemed successfully:', updateData);
        alert('Gift card redeemed successfully!');
    })
    .catch(error => {
        console.error('Error during the gift card redemption process:', error);
        alert('Error redeeming gift card. Please try again.');
    });
}


function updateGiftCardAsRedeemed(id, code, value) {
    const url = `https://shoppingsite-0267.restdb.io/rest/gift-card-codes/${id}`;
    const apiKey = '660d8c40d34bb00dc38ed4a9'; // Ensure this is your actual, correct API key
    const loggedInUser = localStorage.getItem('loggedInUser');

    // Debugging: Log the username being sent in the request
    console.log(`Redeeming gift card for user: ${loggedInUser}`);

    const bodyData = {
        "code": code,
        "value": value,
        "isRedeemed": true,
        "redeemedBy": loggedInUser // Ensure this matches your database schema exactly
    };
    console.log('Sending update payload:', bodyData);

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        },
        body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(updatedData => {
        console.log('Gift card redeemed successfully:', updatedData);
        alert('Gift card redeemed successfully!');
    })
    .catch(error => {
        console.error('Error marking gift card as redeemed:', error);
        alert('Failed to mark gift card as redeemed. Please try again.');
    });
}

function renderWishlist() {
    const wishlistItemsEl = document.getElementById('wishlist-items');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    wishlistItemsEl.innerHTML = '';
    wishlist.forEach(productName => {
        const itemEl = document.createElement('div');
        itemEl.textContent = productName;

        const addToCartBtn = document.createElement('button');
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.onclick = () => addToCartFromWishlist(productName);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => removeFromWishlist(productName);

        itemEl.appendChild(addToCartBtn);
        itemEl.appendChild(removeBtn);
        wishlistItemsEl.appendChild(itemEl);
    });
}



function addToWishlist(productName) {
    console.log(`Adding ${productName} to wishlist`); // Debugging line
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!wishlist.includes(productName)) {
        wishlist.push(productName);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert(`${productName} added to wishlist!`);
    } else {
        alert(`${productName} is already in your wishlist.`);
    }
    renderWishlist(); // Make sure to call renderWishlist to update the wishlist display
}

function addToCartFromWishlist(productName) {
    const product = products.find(p => p.name === productName);
    if (product) {
        addToCart(product.name, product.price, product.isGiftCard || false);

        // Remove from wishlist
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist = wishlist.filter(name => name !== productName);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));

        renderWishlist(); // Refresh the wishlist display
        alert(`${productName} added to cart and removed from wishlist!`);
    } else {
        alert('Product not found.');
    }
}
function removeFromWishlist(productName) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(name => name !== productName);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderWishlist(); // Refresh the wishlist display
}
function removeFromCart(index) {
    cart.splice(index, 1); // Remove item at index
    renderCartItems(); // Refresh the cart display
}


// Call updateLoginStatus on page load to reflect the correct login state
window.onload = function() {
    updateLoginStatus();
};

// Make sure to include this new function in your existing script.
renderProducts(products);
updateBalanceDisplay();
renderWishlist();
