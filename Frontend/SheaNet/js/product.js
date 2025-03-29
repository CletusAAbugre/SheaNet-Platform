document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    
    // Complete product database matching your products page
    const products = {
        // Retail Raw Shea Butter
        '1': {
            name: 'Brut shea butter',
            image: 'images/node-11.png',
            price: 32,
            description: 'Pure unrefined shea butter with all natural benefits. Harvested straight from the shea nut, preserving its natural richness and nourishing benefits. Packed with vitamins and essential fatty acids, it provides deep hydration and protection for skin and hair.',
            size: '150ml'
        },
        '2': {
            name: 'Premium Shea Butter',
            image: 'images/retail-butter-3-1-12.png',
            price: 26,
            description: 'Premium quality shea butter with smooth texture. Expertly crafted for enhanced application, providing intense moisture with a soft, velvety feel. Ideal for daily skincare routine.',
            size: '150ml'
        },
        '3': {
            name: 'Pure Shea Butter',
            image: 'images/node-13.png',
            price: 20,
            description: '100% pure shea butter with no additives. Perfect for those who want the raw, unprocessed benefits of shea butter for both skin and hair care applications.',
            size: '150ml'
        },
        
        // Bulk Shea Butter
        '4': {
            name: 'Bulk Shea Butter',
            image: 'images/bulk-butter-1-1-49.png',
            price: 152,
            description: 'Premium bulk shea butter for businesses and manufacturers. Sustainably sourced and ethically produced, ensuring consistent quality for your cosmetic formulations.',
            size: '20kg'
        },
        '5': {
            name: 'White Bulk Butter',
            image: 'images/bulk-butter-2-1-50.png',
            price: 152,
            description: 'High-quality white shea butter in bulk quantities. Perfect for creating light-colored cosmetic products without altering your desired pigment.',
            size: '20kg'
        },
        '6': {
            name: 'Gold Bulk Butter',
            image: 'images/bulk-butter-3-1-51.png',
            price: 152,
            description: 'Golden shea butter in bulk, known for its rich color and slightly nutty aroma. Ideal for natural cosmetic products where color is part of the appeal.',
            size: '20kg'
        },
        '7': {
            name: 'Organic Shea Butter',
            image: 'images/bulk-butter-4-1-52.png',
            price: 152,
            description: 'Certified organic shea butter in bulk quantities. Processed without chemicals or additives, perfect for organic product lines.',
            size: '20kg'
        },
        
        // Shea Skincare Products
        '8': {
            name: 'Shea Butter Lotion',
            image: 'images/shea-body-1-1-99.png',
            price: 40,
            description: 'Nourishing shea lotion blended with essential oils for daily moisturizing. Lightweight yet deeply hydrating formula that absorbs quickly.',
            size: '100ml'
        },
        '9': {
            name: 'Organic Shea Butter Cream',
            image: 'images/shea-body-2-1-100.png',
            price: 45,
            description: 'Certified organic shea butter cream with no synthetic ingredients. Perfect for sensitive skin and those preferring organic skincare solutions.',
            size: '100ml'
        },
        '10': {
            name: 'Luxury Shea Cream',
            image: 'images/shea-body-3-1-101.png',
            price: 60,
            description: 'Premium luxury shea cream with added botanical extracts. Provides intense hydration while leaving skin silky smooth with a delicate fragrance.',
            size: '100ml'
        },
        '11': {
            name: 'Shea Body Butter',
            image: 'images/shea-body-4-1-102.png',
            price: 25,
            description: 'Rich shea body butter formulated for extra dry skin. Provides long-lasting moisture and helps improve skin elasticity.',
            size: '100ml'
        },
        
        // Scented Shea Butter
        '12': {
            name: 'Scented Shea Lotion',
            image: 'images/node-148.png',
            price: 40,
            description: 'Shea lotion infused with a delicate floral fragrance. Provides all the benefits of shea butter with a pleasant, light scent.',
            size: '100ml'
        },
        '13': {
            name: 'Whipped Body Butter',
            image: 'images/node-149.png',
            price: 40,
            description: 'Luxury whipped shea butter with vanilla scent. Light, fluffy texture that melts into skin for deep hydration.',
            size: '100ml'
        },
        '14': {
            name: 'Citrus Whipped Butter',
            image: 'images/node-150.png',
            price: 40,
            description: 'Whipped shea butter infused with refreshing citrus essential oils. Energizing scent with all the moisturizing benefits of shea.',
            size: '100ml'
        }
    };

    const product = products[productId];
    
    if (product) {
        document.title = `${product.name} | SheaNet`;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-img').src = product.image;
        document.getElementById('product-img').alt = product.name;
        document.getElementById('product-price').textContent = `${product.size} | $${product.price}`;
        document.getElementById('product-desc').textContent = product.description;
        
        document.getElementById('add-to-cart').addEventListener('click', function() {
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            
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
            
            //To show a nice toast notification instead of alert
            const toast = document.createElement('div');
            toast.className = 'position-fixed bottom-0 end-0 p-3';
            toast.innerHTML = `
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-success text-white">
                        <strong class="me-auto">Added to Cart</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        ${quantity} x ${product.name} added to your cart.
                    </div>
                </div>
            `;
            document.body.appendChild(toast);
            
            // To remove toast after 3 seconds
            setTimeout(() => {
                toast.remove();
            }, 3000);
        });
        
        document.getElementById('buy-now').addEventListener('click', function() {
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            localStorage.setItem('cart', JSON.stringify([{
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                size: product.size,
                quantity: quantity
            }]));
            updateCartCount();
            window.location.href = 'checkout.html';
        });
    } else {
        document.querySelector('.container').innerHTML = `
            <div class="alert alert-danger mt-5">
                <h4 class="alert-heading">Product Not Found</h4>
                <p>The requested product could not be found. It may have been removed or the link might be incorrect.</p>
                <hr>
                <a href="products.html" class="btn btn-outline-danger">Back to Products</a>
            </div>
        `;
    }
});

// Updating  cart count function (should match your cart.js)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}