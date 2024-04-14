//js
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDkDjPcUcDDsP2UDsfdF_mItknyRoimk1w",
    authDomain: "eggas-shopping-site.firebaseapp.com",
    projectId: "eggas-shopping-site",
    storageBucket: "eggas-shopping-site.appspot.com",
    messagingSenderId: "927805795789",
    appId: "1:927805795789:web:966656e8e6635e0a612884",
    measurementId: "G-60J8CSZN7M"
  };
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
    saveCartToDatabase();
    console.log("ATC")
}

function saveCartToDatabase() {
    console.log("SAVING TO DATABASE");
    const apiKey = '660d8c40d34bb00dc38ed4a9'; // Remember to secure your API keyF
    const username = localStorage.getItem('username');
    if (!username) {
        console.error('No username found in localStorage.');
        return;
    }

    fetch(`https://shoppingsite-0267.restdb.io/rest/accounts?q={"Username":"${username}"}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        }
    })
    .then(response => response.json())
    .then(users => {
        if (users.length > 0) {
            const user = users[0];
            // Ensure all necessary fields are included and correctly formatted
            const updatedData = {
                // Assuming 'Username' is required but was causing issues,
                // verify if it's necessary to update it or just the cart.
                // If other fields are required, ensure they are included here.
                cart: cart
            };

            return fetch(`https://shoppingsite-0267.restdb.io/rest/accounts/${user._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': apiKey
                },
                body: JSON.stringify(updatedData)
            });
        } else {
            throw new Error("No user found for the given username.");
        }
    })
    .then(response => {
        if (!response.ok) {
            // Handle non-OK responses here
            return response.json().then(data => Promise.reject(data));
        }
        return response.json();
    })
    .then(updatedUser => {
        console.log('Cart updated in database:', updatedUser);
    })
    .catch(error => {
        console.error('Error updating cart:', error);
    });
}



const products = [
    //products
    { name: 'Video Game', price: 60, img: "https://m.media-amazon.com/images/I/7166--AaJIL._SX342_.jpg" },
    { name: 'Gaming Console', price: 500, img: "https://media.gamestop.com/i/gamestop/10147700/Nintendo-Switch-Dock-Set?$pdp$$&fmt=webp" },
    { name: 'Ice Cream', price: 12, img: "https://m.media-amazon.com/images/I/71N8aNfYkwL._SX342_.jpg" },
    { name: 'Movie Ticket', price: 14, img: "https://www.greatfallstribune.com/gcdn/-mm-/72e1a45c7efca1ca71bc23fad5400586ffaeb551/c=0-625-3155-2407/local/-/media/2016/07/14/GreatFalls/GreatFalls/636040887353096551-ThinkstockPhotos-497273387.jpg?width=660&height=373&fit=crop&format=pjpg&auto=webp" },
    { name: 'Pair of Pants', price: 40, img: "https://m.media-amazon.com/images/I/813-PeyXi2L._AC_SX522_.jpg" },
    { name: 'Nerf Gun', price: 25, img: "https://m.media-amazon.com/images/I/618LQZjaFHL.__AC_SX300_SY300_QL70_FMwebp_.jpg"},
    { name: 'Pokemon Card Pack', price: 15, img: "https://m.media-amazon.com/images/I/61TE86s9NBL.__AC_SY300_SX300_QL70_FMwebp_.jpg"},
    { name: 'Anime Convention Ticket', price: 150, img: "https://www.t-ono.net/media/k2/items/cache/e578c616ab24d5ce2543a79c560f9317_XL.jpg" },
    { name: 'Fancy Pencil Set', price: 25, img: "https://m.media-amazon.com/images/I/519tEtGILdL.__AC_SY300_SX300_QL70_FMwebp_.jpg" },
    { name: 'Movie Ticket 3 Pack', price: 40, img: "https://i.ibb.co/jGzRv16/Untitled-presentation.png" },
    { name: 'Anime t-shirt', price: 70, img: "https://i.ibb.co/Myv97tK/DALL-E-2024-04-09-15-44-25-A-stylish-modern-t-shirt-featuring-a-vibrant-anime-character-The-t-shirt.webp" },
    { name: 'High End Skateboard', price: 100, img: "https://m.media-amazon.com/images/I/714SrAn3W+L._AC_SX425_.jpg" },
    { name: '$10 Roblox Gift Card', price: 10, img: "https://fpstatic.cashstar.com/faceplates/DTCPGTNS5/MASTER-1.png" },
    { name: '$20 Roblox Gift Card', price: 20, img: "https://fpstatic.cashstar.com/faceplates/DTCPGTNS5/MASTER-1.png" },
    { name: '$50 Roblox Gift Card', price: 50, img: "https://fpstatic.cashstar.com/faceplates/DTCPGTNS5/MASTER-1.png" },
    { name: 'Nike Shoes', price: 120, img: "https://m.media-amazon.com/images/I/51RFfemMaoL._AC_SY625_.jpg" },
    { name: 'Lego Set', price: 80, img: "https://m.media-amazon.com/images/I/81uHFvVmGkL.__AC_SX300_SY300_QL70_FMwebp_.jpg" },
    { name: 'Poster', price: 20, img: "https://m.media-amazon.com/images/I/71j-fENqR0L._AC_SY450_.jpg" },
    { name: 'Music Album', price: 10, img: "https://m.media-amazon.com/images/I/41xPUHbhLZL._AC_UY327_FMwebp_QL65_.jpg" },
    { name: '3 Pizzas', price: 40, img: "https:/https://i.ibb.co/QbPftmv/9881326a-4af1-4c10-b5ef-3f69a8ca534b.webp" },
    { name: '$20 Arcade credits', price: 20, img: "https://m.media-amazon.com/images/I/51fEd9uiTWL.jpg" },
    { name: '$40 Arcade credits', price: 40, img: "https://m.media-amazon.com/images/I/51fWD3vt8sL.jpg" },
    { name: '$100 Arcade credits', price: 100, img: "https://m.media-amazon.com/images/I/51fWD3vt8sL.jpg" },
    { name: '$5 Gift Card', price: 5, isGiftCard: true, img: "https://i.ibb.co/5GKVt5P/A-10-gift-card-for-a-shopping-website-called-Elliott-s-shopping-site-2.png" },
    { name: '$10 Gift Card', price: 10, isGiftCard: true, img: "https://i.ibb.co/Gx3d3Nz/A-10-gift-card-for-a-shopping-website-called-Elliott-s-shopping-site.png" },
    { name: '$20 Gift Card', price: 20, isGiftCard: true, img: "https://i.ibb.co/gTJsyFJ/A-10-gift-card-for-a-shopping-website-called-Elliott-s-shopping-site-1.png" }
  
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
    const username = localStorage.getItem('username');
    if (username) {
        updateUserBalance(username, balance);
    }
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
        const newAmount = parseInt(amount, 10);
        balance += newAmount;
        updateBalanceDisplay();
        // Assume username is stored in localStorage after login
        const username = localStorage.getItem('username');
        if (username) {
            updateUserBalance(username, balance);
        }
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

        // Create image element
        const imgEl = document.createElement('img');
        imgEl.src = product.img; // Set image source
        imgEl.alt = product.name; // Set alt text
        imgEl.className = 'product-image'; // Optional: Add a class for styling

        productEl.appendChild(imgEl); // Append the image to the product element

        productEl.innerHTML += `
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
    const username = localStorage.getItem('username');
        if (username) {
            updateUserBalance(username, balance);
        }
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
    username = String(username).trim().toLowerCase();
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
    let username = document.getElementById('login-username').value.trim().toLowerCase(); // Convert to lowercase
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
            localStorage.setItem('username', username); // Store the username in lowercase in localStorage
            fetchUserBalance(username); // Fetch and update the balance
            updateLoginStatus();
        } else {
            // User not found
            alert('Incorrect username or password!');
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('Login failed');
    });
}


function fetchUserCart() {
    const username = localStorage.getItem("username");
    if (!username) return; // Stop if no username is found

    const query = encodeURIComponent(`{"Username":"${username}"}`);
    fetch(`https://shoppingsite-0267.restdb.io/rest/accounts?q=${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': '660d8c40d34bb00dc38ed4a9'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("1")
        if (data && data.length > 0) {
            console.log("2");
            // Assuming the cart is stored directly in the data object and is an array
            cart = data[0].cart || [];
            renderCartItems(); // Update UI with fetched cart
        }
    })
    .catch(error => console.error('Error fetching cart:', error));
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
                    "code": code, // Re-supply the existing code
                    "value": value, // Re-supply the existing value
                    "isRedeemed": true, // Update the isRedeemed status
                    "redeemedBy": localStorage.getItem("username")
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

    // Retrieve the username of the currently logged-in user from localStorage
    // Adjust this line if the username is stored/retrieved differently

    const bodyData = {
        "code": code, // Re-supply the existing code
        "value": value, // Re-supply the existing value
        "isRedeemed": true, // Update the isRedeemed status
        "redeemedBy": "foot"
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        },
        body: JSON.stringify(bodyData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to mark gift card as redeemed');
        }
        return response.json();
    })
    .then(updatedData => {
        console.log('Gift card redeemed successfully:', updatedData);
        alert('Gift card redeemed successfully!');
        // Here, you might want to update the UI or perform additional actions
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
function fetchUserBalance(username) {
    const url = `https://shoppingsite-0267.restdb.io/rest/accounts?q={"Username":"${username}"}`;
    fetch(url, {
        method: 'GET',
        headers: {
            'x-apikey': '660d8c40d34bb00dc38ed4a9' // Use your actual API key here
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data && data.length > 0) {
            balance = data[0].balance; // Assuming balance is stored in the user's record
            updateBalanceDisplay();
        }
    })
    .catch(error => console.error('Failed to fetch user balance:', error));
}

async function updateUserBalance(username, newBalance) {
    console.log("#satan  for life")
    const query = encodeURIComponent(`{"Username":"${username}"}`);
    try {
        const response = await fetch(`https://shoppingsite-0267.restdb.io/rest/accounts?q=${query}`, {
            method: 'GET',
            headers: {
                'x-apikey': '660d8c40d34bb00dc38ed4a9' // Your actual API key
            }
        });
        const data = await response.json();
        if (data && data.length > 0) {
            const userId = data[0]._id;
            console.log('User ID:', userId); // Debugging line
            const updateUrl = `https://shoppingsite-0267.restdb.io/rest/accounts/${userId}`;
            const updateResponse = await fetch(updateUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': '660d8c40d34bb00dc38ed4a9'
                },
                body: JSON.stringify({ balance: newBalance })
            });
            if (!updateResponse.ok) throw new Error('Failed to update user balance');
            console.log('Balance updated successfully');
        } else {
            console.error('User not found');
        }
    } catch (error) {
        console.error('Error updating user balance:', error);
    }
}
window.onload = function() {
    updateLoginStatus();
    // Load Google Sign-In if needed
    if (!localStorage.getItem('isLoggedIn')) {
        google.accounts.id.initialize({
            client_id: "20859272744-g2h36a1eb9mmsf46d474t7afhinfcet4.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("g_id_signin"),
            { theme: "outline", size: "large" }
        );
        google.accounts.id.prompt(); // Optional: for automatic sign-in prompt.
    }
    // Fetch user balance if logged in
    const username = localStorage.getItem('username');
    if (username) {
        fetchUserBalance(username); // Fetch and update the balance if logged in
    }
};

function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential); // Decode JWT to access payload
    const userId = data.sub; // Google's user ID

    checkUserExists(userId).then(userExists => {
        if (!userExists) {
            // Register new user in restdb.io if not already registered
            createUser(data).then(() => {
                console.log("New user registered.");
                createSession(data);
            });
        } else {
            // User exists, update last login or other relevant data
            console.log("User logged in.");
            createSession(data);
        }
    });
}

function createSession(userData) {
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("user", JSON.stringify(userData)); // Store user data in localStorage
    updateLoginStatus();
    // Redirect user or update UI
}

function checkUserExists(userId) {
    return fetch(`https://shoppingsite-0267.restdb.io/rest/accounts?q={"userId":"${userId}"}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': '660d8c40d34bb00dc38ed4a9'
        }
    })
    .then(res => res.json())
    .then(users => users.length > 0);
}

function createUser(userData) {
    return fetch('https://shoppingsite-0267.restdb.io/rest/accounts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': '660d8c40d34bb00dc38ed4a9'
        },
        body: JSON.stringify({
            userId: userData.sub,
            email: userData.email,
            name: userData.name,
            lastLogin: new Date().toISOString()
        })
    });
}


function updateUserLastLogin(userId) {
    return fetch(`https://shoppingsite-0267.restdb.io/rest/accounts?q={"userId":"${userId}"}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': '660d8c40d34bb00dc38ed4a9'
        },
        body: JSON.stringify({
            lastLogin: new Date().toISOString()
        })
    });
}


  



// Make sure to include this new function in your existing script.
renderProducts(products);
updateBalanceDisplay();
renderWishlist();
