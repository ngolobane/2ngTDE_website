// Main JavaScript for Clothing Shop

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navList = document.getElementById('navList');
    
    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', function() {
            navList.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
    
    // Initialize countdown timer if on homepage
    initCountdown();
    
    // Initialize cart functionality
    initCart();
});

// Countdown Timer
function initCountdown() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;
    
    // Set the date we're counting down to (3 days from now)
    const countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + 3);
    
    // Update the countdown every 1 second
    const countdownTimer = setInterval(function() {
        // Get current date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the countdown date
        const distance = countDownDate - now;
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        daysElement.textContent = days < 10 ? '0' + days : days;
        hoursElement.textContent = hours < 10 ? '0' + hours : hours;
        minutesElement.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsElement.textContent = seconds < 10 ? '0' + seconds : seconds;
        
        // If the countdown is finished, clear the interval
        if (distance < 0) {
            clearInterval(countdownTimer);
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
        }
    }, 1000);
}

// Shopping Cart Functionality
function initCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCountElement = document.querySelector('.cart-count');
    
    // Initialize cart from localStorage or create new cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    
    // Add event listeners to all "Add to Cart" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const productCard = e.target.closest('.product-card');
            if (!productCard) return;
            
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const productImg = productCard.querySelector('.product-img').src;
            const productCategory = productCard.querySelector('.product-category').textContent;
            
            // Check if product is already in cart
            const existingProductIndex = cart.findIndex(item => item.title === productTitle);
            
            if (existingProductIndex > -1) {
                // Product exists, increase quantity
                cart[existingProductIndex].quantity += 1;
            } else {
                // Add new product to cart
                cart.push({
                    title: productTitle,
                    price: productPrice,
                    image: productImg,
                    category: productCategory,
                    quantity: 1
                });
            }
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Show notification
            showNotification(`${productTitle} added to cart!`);
        });
    });
    
    // Update cart count in header
    function updateCartCount() {
        if (!cartCountElement) return;
        
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
    
    // Cart icon click - redirect to cart page
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }
    
    // User icon click - redirect to login/account page
    const userIcon = document.getElementById('userIcon');
    if (userIcon) {
        userIcon.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--success-color)';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'all 0.3s ease';
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Search functionality
const searchIcon = document.getElementById('searchIcon');
if (searchIcon) {
    searchIcon.addEventListener('click', function() {
        // Create search overlay
        const searchOverlay = document.createElement('div');
        searchOverlay.className = 'search-overlay';
        searchOverlay.innerHTML = `
            <div class="search-container">
                <form class="search-form">
                    <input type="text" class="search-input" placeholder="Search for products...">
                    <button type="submit" class="search-btn">
                        <i class="fas fa-search"></i>
                    </button>
                </form>
                <button class="close-search">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        searchOverlay.style.position = 'fixed';
        searchOverlay.style.top = '0';
        searchOverlay.style.left = '0';
        searchOverlay.style.width = '100%';
        searchOverlay.style.height = '100%';
        searchOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        searchOverlay.style.zIndex = '2000';
        searchOverlay.style.display = 'flex';
        searchOverlay.style.justifyContent = 'center';
        searchOverlay.style.alignItems = 'center';
        searchOverlay.style.opacity = '0';
        searchOverlay.style.transition = 'opacity 0.3s ease';
        
        const searchContainer = searchOverlay.querySelector('.search-container');
        searchContainer.style.width = '80%';
        searchContainer.style.maxWidth = '600px';
        
        const searchForm = searchOverlay.querySelector('.search-form');
        searchForm.style.display = 'flex';
        searchForm.style.position = 'relative';
        
        const searchInput = searchOverlay.querySelector('.search-input');
        searchInput.style.width = '100%';
        searchInput.style.padding = '15px 50px 15px 15px';
        searchInput.style.fontSize = '1.2rem';
        searchInput.style.border = 'none';
        searchInput.style.borderRadius = '5px';
        
        const searchBtn = searchOverlay.querySelector('.search-btn');
        searchBtn.style.position = 'absolute';
        searchBtn.style.right = '0';
        searchBtn.style.top = '0';
        searchBtn.style.height = '100%';
        searchBtn.style.padding = '0 15px';
        searchBtn.style.background = 'var(--primary-color)';
        searchBtn.style.border = 'none';
        searchBtn.style.borderRadius = '0 5px 5px 0';
        searchBtn.style.color = 'white';
        searchBtn.style.cursor = 'pointer';
        
        const closeSearch = searchOverlay.querySelector('.close-search');
        closeSearch.style.position = 'absolute';
        closeSearch.style.top = '20px';
        closeSearch.style.right = '20px';
        closeSearch.style.background = 'none';
        closeSearch.style.border = 'none';
        closeSearch.style.color = 'white';
        closeSearch.style.fontSize = '1.5rem';
        closeSearch.style.cursor = 'pointer';
        
        // Add to DOM
        document.body.appendChild(searchOverlay);
        
        // Show overlay
        setTimeout(() => {
            searchOverlay.style.opacity = '1';
            searchInput.focus();
        }, 10);
        
        // Close search on button click
        closeSearch.addEventListener('click', function() {
            searchOverlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(searchOverlay);
            }, 300);
        });
        
        // Handle search form submission
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    });
}
