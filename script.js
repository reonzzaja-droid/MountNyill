// Cart data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsDiv = document.getElementById('cart-items');
const cartCountSpan = document.getElementById('cart-count');
const cartTotalSpan = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');

// Initialize cart display
updateCartDisplay();

// Cart toggle
cartToggle.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.toggle('active');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});

// Clear all cart
clearCartBtn.addEventListener('click', clearAllCart);

// Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Terima kasih! Total pembelian Anda: Rp ${total.toLocaleString('id-ID')}\n\nSilakan lanjutkan ke pembayaran.`);
    
    // Reset cart
    cart = [];
    saveCart();
    updateCartDisplay();
    cartSidebar.classList.remove('active');
});

// Add to cart function
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();
    updateCartDisplay();
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartDisplay();
}

// Clear all cart
function clearAllCart() {
    if (cart.length === 0) {
        alert('Keranjang sudah kosong!');
        return;
    }
    
    if (confirm('Apakah Anda yakin ingin menghapus semua produk dari keranjang?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        alert('Semua produk telah dihapus dari keranjang.');
    }
}

// Update quantity
function updateQuantity(id, quantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart display
function updateCartDisplay() {
    cartCountSpan.textContent = cart.length;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart">Keranjang kosong</p>';
        cartTotalSpan.textContent = 'Rp 0';
        return;
    }

    let total = 0;
    cartItemsDiv.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-header">
                <h4>${item.name}</h4>
                <button class="btn-remove" onclick="removeFromCart('${item.id}')">×</button>
            </div>
            <div class="cart-item-details">
                <p>Harga: Rp ${item.price.toLocaleString('id-ID')}</p>
                <div class="quantity-control">
                    <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
                    <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <p class="item-total">Subtotal: Rp ${itemTotal.toLocaleString('id-ID')}</p>
            </div>
        `;
        cartItemsDiv.appendChild(cartItem);
    });

    cartTotalSpan.textContent = 'Rp ' + total.toLocaleString('id-ID');
}
