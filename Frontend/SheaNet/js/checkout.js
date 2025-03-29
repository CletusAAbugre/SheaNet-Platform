document.addEventListener('DOMContentLoaded', function() {
    const stripe = Stripe('pk_test_your_test_key_here');
    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');
    
    const form = document.getElementById('shipping-form');
    const submitBtn = document.getElementById('submit-payment');
    
    function renderOrderSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orderItemsEl = document.getElementById('order-items');
        const subtotalEl = document.getElementById('order-subtotal');
        const totalEl = document.getElementById('order-total');
        
        let itemsHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            itemsHTML += `
                <div class="d-flex justify-content-between mb-2">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        });
        
        orderItemsEl.innerHTML = itemsHTML;
        subtotalEl.textContent = '$' + subtotal.toFixed(2);
        totalEl.textContent = '$' + (subtotal + 5).toFixed(2);
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        submitBtn.disabled = true;
        document.getElementById('button-text').classList.add('d-none');
        document.getElementById('spinner').classList.remove('d-none');
        
        // Simulate payment processing
        setTimeout(() => {
            localStorage.removeItem('cart');
            window.location.href = 'success.html';
        }, 1500);
    });
    
    card.addEventListener('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
    
    renderOrderSummary();
    updateCartCount();
});