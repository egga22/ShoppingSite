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
    giftCardCodes[code] = value;
    return code; // Return the code for use in the checkout function
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
function registerUser(username, password) {
    // Assuming you have a users collection in restdb.io
    const url = 'https://<your-database-id>.restdb.io/rest/users'; // Replace <your-database-id> with your actual database ID from restdb.io
    const apiKey = 'YOUR_API_KEY'; // Secure your API key

    const userData = {
        username: username,
        password: password, // In a real application, never send plain passwords like this
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => console.log('User registered:', data))
    .catch(error => console.error('Error:', error));
}


function login() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (storedUser && storedUser.username === username && storedUser.password === password) {
        alert('Login successful');
        localStorage.setItem('isLoggedIn', 'true');
        updateLoginStatus();
    } else {
        alert('Login failed');
    }
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

function redeemGiftCard() {
    const code = document.getElementById('gift-card-code').value;
    if (giftCardCodes[code]) {
        balance += giftCardCodes[code];
        alert(`$${giftCardCodes[code]} added to your balance.`);
        delete giftCardCodes[code]; // Ensure the code can't be used again
        updateBalanceDisplay();
        document.getElementById('gift-card-code').value = ''; // Clear input
    } else {
        alert('Invalid or already used gift card code.');
    }
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
