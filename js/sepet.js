document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.querySelector('.checkout-btn');

    let cart = JSON.parse(localStorage.getItem('onlineCart')) || [];

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartSummary.style.display = 'none';
            updateCartCount();
            return;
        }

        emptyCartMessage.style.display = 'none';
        cartSummary.style.display = 'block';

        cart.forEach((item, index) => {
            const itemTotalPrice = item.price * item.quantity;
            subtotal += itemTotalPrice;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="../images/${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="price-per-item">${item.price.toFixed(2)} TL / adet</p>
                </div>
                <div class="item-quantity-controls">
                    <button data-index="${index}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button data-index="${index}" data-action="increase">+</button>
                </div>
                <span class="item-total-price">${itemTotalPrice.toFixed(2)} TL</span>
                <button class="remove-item-btn" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });

        subtotalElement.textContent = subtotal.toFixed(2) + ' TL';
        totalElement.textContent = subtotal.toFixed(2) + ' TL';

        updateCartCount();
        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll('.item-quantity-controls button').forEach(button => {
            button.removeEventListener('click', handleQuantityChange);
            button.addEventListener('click', handleQuantityChange);
        });

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.removeEventListener('click', handleRemoveItem);
            button.addEventListener('click', handleRemoveItem);
        });

        if (checkoutBtn) {
            checkoutBtn.removeEventListener('click', handleCheckout);
            checkoutBtn.addEventListener('click', handleCheckout);
        }
    }

    function handleQuantityChange(event) {
        const index = parseInt(event.target.dataset.index);
        const action = event.target.dataset.action;

        if (action === 'increase') {
            cart[index].quantity++;
        } else if (action === 'decrease') {
            cart[index].quantity--;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }
        saveCartAndRender();
    }

    function handleRemoveItem(event) {
        const index = parseInt(event.target.dataset.index);
        if (confirm('Bu ürünü sepetten silmek istediğinize emin misiniz?')) {
            cart.splice(index, 1);
            saveCartAndRender();
        }
    }

    function saveCartAndRender() {
        localStorage.setItem('onlineCart', JSON.stringify(cart));
        renderCart();
    }

    function handleCheckout() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            alert('Online siparişi tamamlamak için lütfen giriş yapın veya kaydolun!');
            window.location.href = 'giris-yap.html';
            return;
        }

        if (cart.length === 0) {
            alert('Sepetiniz boş. Lütfen ürün ekleyiniz.');
            return;
        }
        
        const totalAmount = parseFloat(totalElement.textContent.replace(' TL', ''));
        if (confirm(`Toplam ${totalAmount.toFixed(2)} TL tutarında online siparişi tamamlamak istiyor musunuz?`)) {
            const orderTime = new Date();
            const newOrder = {
                id: `OL-${Date.now()}`,
                type: 'online',
                items: cart,
                total: totalAmount,
                status: 'Beklemede',
                orderDate: orderTime.toISOString(),
                displayTime: `${orderTime.toLocaleDateString('tr-TR')} ${orderTime.toLocaleTimeString('tr-TR')}`,
                customerEmail: loggedInUser.email
            };

            let onlineOrders = JSON.parse(localStorage.getItem('onlineOrders')) || [];
            onlineOrders.push(newOrder);
            localStorage.setItem('onlineOrders', JSON.stringify(onlineOrders));

            let customerOrderHistory = JSON.parse(localStorage.getItem('customerOrderHistory')) || [];
            customerOrderHistory.push(newOrder);
            localStorage.setItem('customerOrderHistory', JSON.stringify(customerOrderHistory));

            cart = [];
            localStorage.removeItem('onlineCart');
            
            alert('Online siparişiniz başarıyla alındı! Teşekkür ederiz.');
            window.location.href = 'ana-sayfa.html';
        }
    }

    renderCart();
});