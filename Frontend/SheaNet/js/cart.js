// Updating cart count display
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'block' : 'none';
    });
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Re-render cart items and update count
    renderCartItems();
    updateCartCount();
    
    // Show removal feedback
    showToast('Item removed from cart');
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-danger text-white">
                <strong class="me-auto">Cart Update</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Render cart items
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsEl = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<div class="alert alert-info">Your cart is empty</div>';
        subtotalEl.textContent = '$0.00';
        totalEl.textContent = '$5.00';
        return;
    }
    
    let itemsHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        itemsHTML += `
            <div class="card mb-3" data-id="${item.id}">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
                        </div>
                        <div class="col-md-3">
                            <h5 class="mb-1">${item.name}</h5>
                            <p class="text-muted small mb-1">${item.size || 'One size'}</p>
                            <p class="mb-0">$${item.price.toFixed(2)}</p>
                        </div>
                        <div class="col-md-3">
                            <div class="input-group" style="max-width: 150px">
                                <button class="btn btn-outline-secondary minus">-</button>
                                <input type="number" class="form-control text-center quantity" 
                                       value="${item.quantity}" min="1">
                                <button class="btn btn-outline-secondary plus">+</button>
                            </div>
                        </div>
                        <div class="col-md-3 text-md-end">
                            <p class="mb-1 fw-bold">$${(item.price * item.quantity).toFixed(2)}</p>
                            <button class="btn btn-sm btn-link text-danger remove-item">
                                <i class="fa fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItemsEl.innerHTML = itemsHTML;
    subtotalEl.textContent = '$' + subtotal.toFixed(2);
    totalEl.textContent = '$' + (subtotal + 5).toFixed(2);
    
    // Added event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.card');
            const productId = card.getAttribute('data-id');
            removeFromCart(productId);
        });
    });
    
    // Added other event listeners (for plus/minus buttons)
    document.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.nextElementSibling;
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
                updateCartItem(this.closest('.card'), parseInt(input.value));
            }
        });
    });
    
    document.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            input.value = parseInt(input.value) + 1;
            updateCartItem(this.closest('.card'), parseInt(input.value));
        });
    });
    
    document.querySelectorAll('.quantity').forEach(input => {
        input.addEventListener('change', function() {
            const value = Math.max(1, parseInt(this.value) || 1);
            this.value = value;
            updateCartItem(this.closest('.card'), value);
        });
    });
}

// Update cart item quantity
function updateCartItem(card, quantity) {
    const productId = card.getAttribute('data-id');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
        showToast('Cart updated');
    }
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }
});