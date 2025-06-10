// js/sepet.js (Tam ve Güncel Hali)

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.querySelector('.checkout-btn');

    let cart = JSON.parse(localStorage.getItem('onlineCart')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (cartSummary) cartSummary.style.display = 'none';
            updateCartCount();
            return;
        }

        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';

        cart.forEach((item, index) => {
            const itemTotalPrice = item.price * item.quantity;
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

        // Global fonksiyondan indirimli tutarı hesapla
        const summary = calculateDiscountedTotal(cart, loggedInUser);

        // İndirim satırını dinamik olarak yönet
        const discountRow = cartSummary.querySelector('.discount-row');
        if (discountRow) discountRow.remove();

        if (summary.totalDiscount > 0) {
            const newDiscountRow = document.createElement('div');
            newDiscountRow.classList.add('summary-row', 'discount-row');
            newDiscountRow.innerHTML = `
                <span>İndirim (${summary.appliedCampaignTitle}):</span>
                <span id="discount-amount">- ${summary.totalDiscount.toFixed(2)} TL</span>
            `;
            subtotalElement.parentElement.insertAdjacentElement('afterend', newDiscountRow);
        }
        
        subtotalElement.textContent = summary.originalTotal.toFixed(2) + ' TL';
        totalElement.textContent = summary.finalTotal.toFixed(2) + ' TL';

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
        const index = parseInt(event.currentTarget.dataset.index); 
        // Silme işlemi kritik olduğu için confirm penceresi burada kalabilir.
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
        if (!loggedInUser) {
            showToast('Siparişi tamamlamak için giriş yapmalısınız.', 'error');
            window.location.href = 'giris-yap.html';
            return;
        }
        if (cart.length === 0) {
            showToast('Sepetiniz boş. Lütfen ürün ekleyiniz.', 'error');
            return;
        }
        const summary = calculateDiscountedTotal(cart, loggedInUser);

        showToast(`Siparişiniz tamamlanıyor...`, 'info');

        setTimeout(() => {
            const orderTime = new Date();
            const newOrder = {
                id: `OL-${Date.now()}`,
                type: 'online',
                items: cart,
                originalTotal: summary.originalTotal,
                discountApplied: summary.totalDiscount,
                appliedCampaign: summary.appliedCampaignTitle,
                total: summary.finalTotal,
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
            
            showToast('Siparişiniz başarıyla tamamlandı!', 'success');
            
            setTimeout(() => {
                window.location.href = 'siparislerim.html';
            }, 1000);

        }, 3000);
    }

    renderCart();
});