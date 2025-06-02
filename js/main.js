// --- menu.json içeriği (modallar için) ---
const mainDefaultMenuData = {
    "categories": {
        "Sıcak İçecekler": [
            { "name": "Filtre Kahve", "image": "filtre-kahve.jpg", "price": 45.00 },
            { "name": "Latte", "image": "latte.jpg", "price": 50.00 },
            { "name": "Cappuccino", "image": "cappuccino.jpg", "price": 50.00 },
            { "name": "Türk Kahvesi", "image": "turk-kahvesi.jpg", "price": 40.00 },
            { "name": "Americano", "image": "americano.jpg", "price": 48.00 },
            { "name": "Çay (Bardak)", "image": "cay.jpg", "price": 20.00 },
            { "name": "Sıcak Çikolata", "image": "sicak-cikolata.jpg", "price": 55.00 }
        ],
        "Soğuk İçecekler": [
            { "name": "Ice Latte", "image": "ice-latte.jpg", "price": 55.00 },
            { "name": "Cold Brew", "image": "cold-brew.jpg", "price": 52.00 },
            { "name": "Limonata (Ev Yapımı)", "image": "limonata.jpg", "price": 35.00 },
            { "name": "Milkshake (Çikolatalı)", "image": "milkshake-cikolatali.jpg", "price": 60.00 },
            { "name": "Meyve Suyu (Portakal)", "image": "meyve-suyu-portakal.jpg", "price": 30.00 }
        ],
        "Atıştırmalıklar": [
            { "name": "Kruvasan", "image": "kruvasan.jpg", "price": 30.00 },
            { "name": "Simit", "image": "simit.jpg", "price": 25.00 },
            { "name": "Poğaça", "image": "pogaca.jpg", "price": 25.00 },
            { "name": "Tost (Kaşarlı)", "image": "tost.jpg", "price": 40.00 },
            { "name": "Sandviç (Ton Balıklı)", "image": "sandvic-ton-balikli.jpg", "price": 65.00 }
        ],
        "Tatlılar": [
            { "name": "Cheesecake (Limonlu)", "image": "cheesecake.jpg", "price": 60.00 },
            { "name": "Brownie", "image": "brownie.jpg", "price": 50.00 },
            { "name": "Cookie (Çikolatalı)", "image": "cookie.jpg", "price": 30.00 },
            { "name": "Tiramisu", "image": "tiramisu.jpg", "price": 65.00 }
        ]
    }
};
// --- JSON içeriği sonu ---

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeIcon = document.querySelector('.theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        if(themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
        localStorage.setItem('theme', 'dark');
    } else {
        if(themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
        localStorage.setItem('theme', 'light');
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('onlineCart')) || [];
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0); // Toplam ürün adedini göster
    }
}

function addToCart(item, cartType = 'onlineCart') {
    let cart = JSON.parse(localStorage.getItem(cartType)) || [];
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += (item.quantity || 1); // Gelen miktar kadar ekle, yoksa 1
    } else {
        cart.push({ ...item, quantity: (item.quantity || 1) }); // Gelen miktar kadar ekle, yoksa 1
    }
    localStorage.setItem(cartType, JSON.stringify(cart));
    
    if (cartType === 'onlineCart') { // Sadece online sepet için header'daki sayacı güncelle
        updateCartCount();
    }
}

function openMenuModal() { // async kaldırıldı
    const menuModal = document.getElementById('menu-modal');
    const modalMenuCategories = document.getElementById('modal-menu-categories');
    
    try {
        const menuData = JSON.parse(JSON.stringify(mainDefaultMenuData)); // Derin kopya kullan
        if(modalMenuCategories) modalMenuCategories.innerHTML = ''; 
        if (menuData && menuData.categories) {
            for (const categoryName in menuData.categories) {
                const categorySection = document.createElement('div');
                categorySection.classList.add('menu-category');
                categorySection.innerHTML = `<h2>${categoryName}</h2>`;
                const itemsGrid = document.createElement('div');
                itemsGrid.classList.add('menu-items-grid');
                menuData.categories[categoryName].forEach(item => {
                    const menuItemCard = document.createElement('div');
                    menuItemCard.classList.add('menu-item-card');
                    menuItemCard.innerHTML = `
                        <img src="../images/${item.image}" alt="${item.name}">
                        <h4>${item.name}</h4>
                        <p class="price">${item.price.toFixed(2)} TL</p>
                        <button class="add-to-cart-btn" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}" data-cart-type="onlineCart">Sepete Ekle</button>
                    `;
                    itemsGrid.appendChild(menuItemCard);
                });
                categorySection.appendChild(itemsGrid);
                if(modalMenuCategories) modalMenuCategories.appendChild(categorySection);
            }
            if(modalMenuCategories) {
                modalMenuCategories.querySelectorAll('.add-to-cart-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const name = event.target.dataset.name;
                        const price = parseFloat(event.target.dataset.price);
                        const image = event.target.dataset.image;
                        const cartType = event.target.dataset.cartType; 
                        addToCart({ name, price, image, quantity: 1 }, cartType);
                        alert(`${name} online sepetine eklendi!`);
                    });
                });
            }
        } else {
            if(modalMenuCategories) modalMenuCategories.innerHTML = '<p>Menü içeriği bulunamadı.</p>';
        }
    } catch (error) {
        console.error('Error processing menu items for online order modal:', error);
        if(modalMenuCategories) modalMenuCategories.innerHTML = '<p>Menü yüklenirken bir hata oluştu.</p>';
    }
    if(menuModal) menuModal.style.display = 'block';
}

function closeMenuModal() {
    const menuModal = document.getElementById('menu-modal');
    if(menuModal) menuModal.style.display = 'none';
}

function openSelfServiceModal() { // async kaldırıldı
    const selfServiceModal = document.getElementById('self-service-modal');
    const selfServiceMenuCategories = document.getElementById('self-service-menu-categories');
    let selfServiceCart = JSON.parse(localStorage.getItem('selfServiceCart')) || [];

    try {
        const menuData = JSON.parse(JSON.stringify(mainDefaultMenuData)); // Derin kopya kullan
        if(selfServiceMenuCategories) selfServiceMenuCategories.innerHTML = '';
        if (menuData && menuData.categories) {
            for (const categoryName in menuData.categories) {
                const categorySection = document.createElement('div');
                categorySection.classList.add('menu-category');
                categorySection.innerHTML = `<h2>${categoryName}</h2>`;
                const itemsGrid = document.createElement('div');
                itemsGrid.classList.add('menu-items-grid'); 
                menuData.categories[categoryName].forEach(item => {
                    const menuItemCard = document.createElement('div');
                    menuItemCard.classList.add('menu-item-card'); 
                    const currentItemInCart = selfServiceCart.find(cartItem => cartItem.name === item.name);
                    const currentQuantity = currentItemInCart ? currentItemInCart.quantity : 0;
                    menuItemCard.innerHTML = `
                        <div class="menu-item-details-column"> 
                            <h4>${item.name}</h4>
                            <p class="price">${item.price.toFixed(2)} TL</p>
                            <div class="self-service-item-controls">
                                <button class="self-service-quantity-btn" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}" data-action="decrease">-</button>
                                <span class="self-service-quantity" data-name="${item.name}">${currentQuantity}</span>
                                <button class="self-service-quantity-btn" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}" data-action="increase">+</button>
                            </div>
                        </div>
                        <img src="../images/${item.image}" alt="${item.name}">  
                    `;
                    itemsGrid.appendChild(menuItemCard);
                });
                categorySection.appendChild(itemsGrid);
                if(selfServiceMenuCategories) selfServiceMenuCategories.appendChild(categorySection);
            }
            if(selfServiceMenuCategories) {
                selfServiceMenuCategories.querySelectorAll('.self-service-quantity-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const name = event.target.dataset.name;
                        const price = parseFloat(event.target.dataset.price);
                        const image = event.target.dataset.image;
                        const action = event.target.dataset.action;
                        let cart = JSON.parse(localStorage.getItem('selfServiceCart')) || [];
                        const existingItemIndex = cart.findIndex(cartItem => cartItem.name === name);
                        if (action === 'increase') {
                            if (existingItemIndex !== -1) cart[existingItemIndex].quantity++;
                            else cart.push({ name, price, image, quantity: 1 });
                        } else if (action === 'decrease') {
                            if (existingItemIndex !== -1) {
                                cart[existingItemIndex].quantity--;
                                if (cart[existingItemIndex].quantity <= 0) cart.splice(existingItemIndex, 1);
                            }
                        }
                        updateSelfServiceModalCart(cart); 
                    });
                });
            }
            updateSelfServiceModalCart(selfServiceCart); 
        } else {
            if(selfServiceMenuCategories) selfServiceMenuCategories.innerHTML = '<p>Menü içeriği bulunamadı.</p>';
        }
    } catch (error) {
        console.error('Error processing menu items for self-service modal:', error);
        if(selfServiceMenuCategories) selfServiceMenuCategories.innerHTML = '<p>Menü yüklenirken bir hata oluştu.</p>';
    }
    if(selfServiceModal) selfServiceModal.style.display = 'block';
}

function closeSelfServiceModal() {
    const selfServiceModal = document.getElementById('self-service-modal');
    if(selfServiceModal) selfServiceModal.style.display = 'none';
}

function updateSelfServiceModalCart(currentCart) {
    const selfServiceModalTotalElement = document.getElementById('self-service-modal-total');
    let total = 0;
    currentCart.forEach(item => {
        total += item.price * item.quantity;
        const quantitySpan = document.querySelector(`#self-service-modal .self-service-quantity[data-name="${item.name}"]`);
        if (quantitySpan) quantitySpan.textContent = item.quantity;
    });
    document.querySelectorAll('#self-service-modal .self-service-quantity').forEach(span => {
        const itemName = span.dataset.name;
        if (!currentCart.find(item => item.name === itemName) && parseInt(span.textContent) !== 0) {
            span.textContent = 0;
        }
    });
    if(selfServiceModalTotalElement) selfServiceModalTotalElement.textContent = total.toFixed(2) + ' TL';
    localStorage.setItem('selfServiceCart', JSON.stringify(currentCart));
}

async function placeSelfServiceOrder() { // Bu fonksiyon fetch kullanmıyor ama async kalması sorun yaratmaz
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('Self servis siparişi vermek için lütfen giriş yapın veya kaydolun!');
        closeSelfServiceModal(); 
        window.location.href = 'giris-yap.html'; 
        return;
    }
    const selfServiceCart = JSON.parse(localStorage.getItem('selfServiceCart')) || [];
    if (selfServiceCart.length === 0) {
        alert('Sepetiniz boş. Lütfen ürün ekleyiniz.'); return;
    }
    const orderTotalElement = document.getElementById('self-service-modal-total');
    const orderTotal = orderTotalElement ? parseFloat(orderTotalElement.textContent.replace(' TL', '')) : 0;
    if (confirm(`Toplam ${orderTotal.toFixed(2)} TL tutarındaki self servis siparişi onaylıyor musunuz?`)) {
        const orderTime = new Date();
        const newOrder = {
            id: `SS-${Date.now()}`, type: 'self-service', items: selfServiceCart, total: orderTotal,
            status: 'Beklemede', orderDate: orderTime.toISOString(),
            displayTime: `${orderTime.toLocaleDateString('tr-TR')} ${orderTime.toLocaleTimeString('tr-TR')}`,
            customerEmail: loggedInUser.email
        };
        let currentOrders = JSON.parse(localStorage.getItem('selfServiceOrders')) || [];
        currentOrders.push(newOrder);
        localStorage.setItem('selfServiceOrders', JSON.stringify(currentOrders));
        let customerOrderHistory = JSON.parse(localStorage.getItem('customerOrderHistory')) || [];
        customerOrderHistory.push(newOrder);
        localStorage.setItem('customerOrderHistory', JSON.stringify(customerOrderHistory));
        localStorage.removeItem('selfServiceCart');
        updateSelfServiceModalCart([]); 
        closeSelfServiceModal();
        alert('Self servis siparişiniz alındı! Personelimiz siparişinizi hazırlamaya başlıyor.');
    }
}

function updateAuthButtonsInHeader() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const kaydolBtn = document.getElementById('kaydol-btn');
    const girisYapBtn = document.getElementById('giris-yap-btn');
    const profileIconContainer = document.getElementById('profile-icon-container');
    const profileDropdown = document.getElementById('profile-dropdown'); 
    const profileInfoContent = document.getElementById('profile-info-content'); 
    const headerLogoutBtn = document.getElementById('logout-btn');
    const goToProfileBtn = document.getElementById('go-to-profile-btn'); 

    if (loggedInUser) {
        if (kaydolBtn) kaydolBtn.style.display = 'none';
        if (girisYapBtn) girisYapBtn.style.display = 'none';
        if (profileIconContainer) profileIconContainer.style.display = 'inline-block';
        if (profileInfoContent) {
            const birthDate = new Date(loggedInUser.birthDate);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
            const cardNumberDisplay = loggedInUser.creditCard && loggedInUser.creditCard.length > 4 
                ? `**** **** **** ${loggedInUser.creditCard.slice(-4)}` : 'Bilgi Yok';
            profileInfoContent.innerHTML = `
                <p><strong>Ad:</strong> ${loggedInUser.firstName}</p>
                <p><strong>Soyad:</strong> ${loggedInUser.lastName}</p>
                <p><strong>Telefon:</strong> ${loggedInUser.phone}</p>
                <p><strong>E-posta:</strong> ${loggedInUser.email}</p>
                <p><strong>Yaş:</strong> ${age}</p>
                <p><strong>Cinsiyet:</strong> ${loggedInUser.gender}</p>
                <p><strong>Kredi Kartı:</strong> ${cardNumberDisplay}</p>`;
        }
        if (headerLogoutBtn) {
             headerLogoutBtn.onclick = (event) => { 
                event.stopPropagation(); localStorage.removeItem('loggedInUser');
                localStorage.removeItem('onlineCart'); localStorage.removeItem('selfServiceCart');
                alert('Başarıyla çıkış yapıldı.'); updateAuthButtonsInHeader(); 
                window.location.href = 'ana-sayfa.html'; 
            };
        }
        if (goToProfileBtn) {
            goToProfileBtn.onclick = (event) => { 
                event.stopPropagation(); window.location.href = 'musteri-paneli.html'; 
            };
        }
        if (profileIconContainer && profileDropdown) {
            profileIconContainer.onclick = (event) => { 
                event.stopPropagation(); profileIconContainer.classList.toggle('active');
            };
            profileDropdown.onclick = (event) => { event.stopPropagation(); };
            document.onclick = (event) => { 
                const isClickInsideProfile = profileIconContainer.contains(event.target);
                if (!isClickInsideProfile && profileIconContainer.classList.contains('active')) {
                    profileIconContainer.classList.remove('active');
                }
            };
        }
    } else { 
        if (kaydolBtn) kaydolBtn.style.display = 'inline-block';
        if (girisYapBtn) girisYapBtn.style.display = 'inline-block';
        if (profileIconContainer) profileIconContainer.style.display = 'none';
        if (profileIconContainer && profileIconContainer.classList.contains('active')) {
             profileIconContainer.classList.remove('active');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const themeIcon = document.querySelector('.theme-toggle i');
        if(themeIcon){ themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
    }
    updateCartCount();
    updateAuthButtonsInHeader();

    const menuModal = document.getElementById('menu-modal');
    if (menuModal) {
        const closeButton = menuModal.querySelector('.close-button');
        if (closeButton) closeButton.addEventListener('click', closeMenuModal);
        window.addEventListener('click', (event) => { if (event.target == menuModal) closeMenuModal(); });
    }
    const selfServiceModal = document.getElementById('self-service-modal');
    if (selfServiceModal) {
        const closeButton = selfServiceModal.querySelector('.close-button');
        if (closeButton) closeButton.addEventListener('click', closeSelfServiceModal);
        window.addEventListener('click', (event) => { if (event.target == selfServiceModal) closeSelfServiceModal(); });
        const placeSelfServiceOrderBtn = document.getElementById('place-self-service-order-btn');
        if (placeSelfServiceOrderBtn) placeSelfServiceOrderBtn.addEventListener('click', placeSelfServiceOrder);
    }
});