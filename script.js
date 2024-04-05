let balance = 0;
let cart = [];
let purchaseHistory = [];
let discountApplied = false;
let appliedDiscountPercentage = 0;
const discountCodes = {
    'melikemoney': 20,
    'mereallylikemoney': 40,
    'mehopeyougobankrupt': 60,
    'melikefreestuff': 100,
};

function generateGiftCardCode(value) {
    const code = 'GC' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const apiKey = '660d8c40d34bb00dc38ed4a9';
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
    const url = `https://shoppingsite-0267.restdb.io/rest/accounts/${userId}`;
    const apiKey = '660d8c40d34bb00dc38ed4a9';
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
    cart.push({ productName, price, isGiftCard });
    const userId = localStorage.getItem('userId');
    if (userId) updateCartInDatabase(userId, cart);
    renderCartItems();
}

function updatePurchaseHistoryInDatabase(userId, newPurchaseHistory) {
    const url = `https://shoppingsite-0267.restdb.io/rest/accounts/${userId}`;
    const apiKey = '660d8c40d34bb00dc38ed4a9';
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        },
        body: JSON.stringify({ purchaseHistory: newPurchaseHistory })
    })
    .then(response => response.json())
    .then(data => console.log('Purchase history updated on server:', data))
    .catch(error => console.error('Error updating purchase history:', error));
}

const products = [
    { name: 'Video Game', price: 60 },
    // Add the rest of your products here
];

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

    cart.forEach(item => {
        if (item.isGiftCard) {
            const code = generateGiftCardCode(item.price);
            alert(`Your gift card code: ${code}\nValue: $${item.price}`);
        }
    });

    balance -= finalTotal;
    purchaseHistory.push(...cart.filter(item => !item.isGiftCard));
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

function addBalance() {
    const amount = prompt('How much would you like to add?');
    if (amount) {
        balance += parseInt(amount, 10);
        updateBalanceDisplay();
        const userId = localStorage.getItem('userId');
        if (userId) updateBalanceInDatabase(userId, balance);
    }
}

function updateBalanceDisplay() {
    document.getElementById('balance-amount').textContent = `$${balance}`;
}

function renderPurchaseHistory() {
    const historyItemsEl = document.getElementById('history-items');
    historyItemsEl.innerHTML = '';
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
    let sortedProducts = [...products];
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
        default:
            break;
    }
    renderProducts(sortedProducts);
}

function renderProducts(productsArray) {
    const productListEl = document.getElementById('product-list');
    productListEl.innerHTML = '';
    productsArray.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'product';
        productEl.innerHTML = `
            <span class="name">${product.name}</span>
            <span class="price">$${product.price}</span>
            <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
        `;
        productListEl.appendChild(productEl);
    });
}

function updateBalanceInDatabase(userId, newBalance) {
    const url = `https://shoppingsite-0267.restdb.io/rest/accounts/${userId}`;
    const apiKey = '660d8c40d34bb00dc38ed4a9';
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
    if (userId) updateBalanceInDatabase(userId, balance);
}

function searchProducts() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchValue));
    renderProducts(filteredProducts);
}

function register(username, password) {
    const url = 'https://shoppingsite-0267.restdb.io/rest/accounts';
    const apiKey = '660d8c40d34bb00dc38ed4a9';
    const userData = { Username: username, password: password };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('User registered:', data);
        alert('Registration successful!');
    })
    .catch(error => {
        console.error('Error during registration:', error);
        alert(`Registration failed: ${error.message}`);
    });
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const url = `https://shoppingsite-0267.restdb.io/rest/accounts?q={"Username":"${username}","password":"${password}"}`;
    const apiKey = '660d8c40d34bb00dc38ed4a9';

    fetch(url, {
        method: 'GET',
        headers: {
            'x-apikey': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            alert('Login successful');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', data[0]._id);
            updateLoginStatus();
            fetchUserData(username);
        } else {
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
    localStorage.removeItem('userId');
    updateLoginStatus();
    window.location.reload(); // Reload the page to reset the app state
}

function updateLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginSection = document.getElementById('login');
    const registerSection = document.getElementById('register');
    const logoutSection = document.getElementById('logout-section');
    
    if (isLoggedIn) {
        if (loginSection) loginSection.style.display = 'none';
        if (registerSection) registerSection.style.display = 'none';
        if (logoutSection) logoutSection.style.display = 'block';
    } else {
        if (loginSection) loginSection.style.display = 'block';
        if (registerSection) registerSection.style.display = 'block';
        if (logoutSection) logoutSection.style.display = 'none';
    }
}

function fetchUserData(username) {
    const query = encodeURIComponent(`{"Username":"${username}"}`);
    const url = `https://shoppingsite-0267.restdb.io/rest/accounts?q=${query}`;
    const apiKey = '660d8c40d34bb00dc38ed4a9';

    fetch(url, {
        method: 'GET',
        headers: {
            'x-apikey': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            const user = data[0];
            balance = user.balance || 0;
            cart = user.cart || [];
            purchaseHistory = user.purchaseHistory || [];
            localStorage.setItem('userId', user._id); // Store user ID for future operati
            updateBalanceDisplay();
            renderCartItems();
            renderPurchaseHistory();
        } else {
            console.error('User data not found');
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
    renderProducts(products); // Add this line to render products after fetching user data
}

function removeFromCart(index) {
    cart.splice(index, 1);
    const userId = localStorage.getItem('userId');
    if (userId) updateCartInDatabase(userId, cart);
    renderCartItems();
}

window.onload = function() {
    updateLoginStatus();
    renderProducts(products);
};
