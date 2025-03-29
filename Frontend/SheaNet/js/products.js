document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    updateCartCount();
    
    // Product database with all 14 products
    const products = {
        '1': { name: 'Brut shea butter', price: 32, image: 'images/node-11.png', size: '150ml' },
        '2': { name: 'Shea Butter', price: 26, image: 'images/retail-butter-3-1-12.png', size: '150ml' },
        '3': { name: 'Shea Butter', price: 20, image: 'images/node-13.png', size: '150ml' },
        '4': { name: 'Bulk Butter', price: 152, image: 'images/bulk-butter-1-1-49.png', size: '20kg' },
        '5': { name: 'White bulk butter', price: 152, image: 'images/bulk-butter-2-1-50.png', size: '20kg' },
        '6': { name: 'Gold bulk butter', price: 152, image: 'images/bulk-butter-3-1-51.png', size: '20kg' },
        '7': { name: 'Organic shea butter', price: 152, image: 'images/bulk-butter-4-1-52.png', size: '20kg' },
        '8': { name: 'Shea butter lotion', price: 40, image: 'images/shea-body-1-1-99.png', size: '100ml' },
        '9': { name: 'Organic shea butter', price: 45, image: 'images/shea-body-2-1-100.png', size: '100ml' },
        '10': { name: 'Organic shea butter cream', price: 60, image: 'images/shea-body-3-1-101.png', size: '100ml' },
        '11': { name: 'Shea butter cream', price: 25, image: 'images/shea-body-4-1-102.png', size: '100ml' },
        '12': { name: 'Shea butter lotion', price: 40, image: 'images/node-148.png', size: '100ml' },
        '13': { name: 'Whipped body butter', price: 40, image: 'images/node-149.png', size: '100ml' },
        '14': { name: 'Whipped body butter', price: 40, image: 'images/node-150.png', size: '100ml' }
    };

    // "Add to Bag" button clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-bag') ) {
            e.preventDefault();
            const button = e.target.closest('.add-to-bag');
            const productId = button.getAttribute('data-id');
            addToCart(productId);
        }
    });

    // Add product to cart
    function addToCart(productId, quantity = 1) {
        const product = products[productId];
        if (!product) return;
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                size: product.size,
                quantity: quantity
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showToast(`${product.name} added to your bag`);
    }

    // Show toast notification
    function showToast(message) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast show align-items-center text-white bg-success border-0';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fa fa-check-circle me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        toastContainer.appendChild(toast);
        
        // Initialize Bootstrap toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove toast after it hides
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    }
});