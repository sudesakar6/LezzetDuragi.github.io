// js/main.js (Merkezi Veri Yönetimli Nihai Hali)

/**
 * Ekranda 3 saniye kalıp kaybolan bir bildirim mesajı (toast) gösterir.
 * @param {string} message Gösterilecek mesaj.
 * @param {string} type Bildirim türü: 'success', 'error', veya 'info'.
 */
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.classList.add('toast-container');
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast toast--${type}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

// --- Merkezi Veri ve Fonksiyonlar ---

const DEFAULT_MENU_DATA = {
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

const campaignsData = {
    "campaigns": [
        {
            "id": 1, "title": "2 Kahve Al 1 Kurabiye Öde", "image": "2al1ode.jpg",
            "startDate": "01.06.2025", "endDate": "30.07.2025",
            "description": "Seçili kahvelerde 2 alana 1 kurabiye bedava kampanyası!",
            "type": "BOGO",
            "bogoDef": {
                "buyItems": ["Filtre Kahve", "Latte", "Cappuccino", "Americano"],
                "buyQuantity": 2,
                "getFreeItems": ["Çikolatalı Kurabiye", "Cookie (Çikolatalı)", "Yulaflı Kurabiye"],
                "getFreeQuantity": 1
            }
        },
        { "id": 2, "title": "Anneler Günü Özel", "type": "percentage", "discountValue": 20, "startDate": "10.05.2025", "endDate": "12.05.2025" },
        { "id": 3, "title": "Öğrenci İndirimi", "type": "percentage", "discountValue": 15, "startDate": "01.09.2024", "endDate": "30.06.2025" }
    ]
};

function parseDate(dateString) {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
}

function calculateDiscountedTotal(cart, user) {
    const originalTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let bogoDiscount = 0;
    let percentageDiscount = 0;
    let appliedCampaigns = [];

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const activeCampaigns = campaignsData.campaigns.filter(campaign => {
        const startDate = parseDate(campaign.startDate);
        const endDate = parseDate(campaign.endDate);
        return currentDate >= startDate && currentDate <= endDate;
    });

    const bogoCampaign = activeCampaigns.find(c => c.type === 'BOGO');
    if (bogoCampaign) {
        const def = bogoCampaign.bogoDef;
        let buyItemCount = 0;
        let getItemsInCart = [];
        cart.forEach(item => {
            if (def.buyItems.includes(item.name)) {
                buyItemCount += item.quantity;
            }
            if (def.getFreeItems.includes(item.name)) {
                for (let i = 0; i < item.quantity; i++) { getItemsInCart.push(item); }
            }
        });
        const potentialFreeItems = Math.floor(buyItemCount / def.buyQuantity) * def.getFreeQuantity;
        if (potentialFreeItems > 0 && getItemsInCart.length > 0) {
            getItemsInCart.sort((a, b) => a.price - b.price);
            const actualFreeItemsCount = Math.min(potentialFreeItems, getItemsInCart.length);
            for (let i = 0; i < actualFreeItemsCount; i++) {
                bogoDiscount += getItemsInCart[i].price;
            }
            if (bogoDiscount > 0) appliedCampaigns.push(bogoCampaign.title);
        }
    }

    const subtotalAfterBogo = originalTotal - bogoDiscount;
    let bestPercentageCampaign = null;
    activeCampaigns.forEach(campaign => {
        if (campaign.type === 'percentage') {
            let isApplicable = false;
            if (campaign.title === 'Öğrenci İndirimi') {
                if (user && user.birthDate) {
                    const birthDate = new Date(user.birthDate);
                    let age = new Date().getFullYear() - birthDate.getFullYear();
                    const m = new Date().getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())) { age--; }
                    if (age >= 18 && age <= 25) isApplicable = true;
                }
            } else { isApplicable = true; }
            if (isApplicable) {
                if (!bestPercentageCampaign || campaign.discountValue > bestPercentageCampaign.discountValue) {
                    bestPercentageCampaign = campaign;
                }
            }
        }
    });
    if (bestPercentageCampaign) {
        percentageDiscount = (subtotalAfterBogo * bestPercentageCampaign.discountValue) / 100;
        appliedCampaigns.push(bestPercentageCampaign.title);
    }

    const totalDiscount = bogoDiscount + percentageDiscount;
    const finalTotal = originalTotal - totalDiscount;

    return { originalTotal, totalDiscount, finalTotal, appliedCampaignTitle: appliedCampaigns.join(' + ') || null };
}


function getActualGlobalMenuData() {
    const storedMenu = localStorage.getItem('currentCafeMenu');
    if (storedMenu) {
        try {
            return JSON.parse(storedMenu);
        } catch (e) {
            console.error("localStorage menüsü parse edilemedi, varsayılana dönülüyor.", e);
            return JSON.parse(JSON.stringify(DEFAULT_MENU_DATA));
        }
    }
    return JSON.parse(JSON.stringify(DEFAULT_MENU_DATA));
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeIcon = document.querySelector('.theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
        localStorage.setItem('theme', 'dark');
    } else {
        if (themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
        localStorage.setItem('theme', 'light');
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('onlineCart')) || [];
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('onlineCart')) || [];
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('onlineCart', JSON.stringify(cart));
    updateCartCount();
}

function removeFromCart(itemName) {
    let cart = JSON.parse(localStorage.getItem('onlineCart')) || [];
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === itemName);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity--;
        if (cart[existingItemIndex].quantity <= 0) {
            cart.splice(existingItemIndex, 1);
        }
        localStorage.setItem('onlineCart', JSON.stringify(cart));
        updateCartCount();
    }
}

function generateCartControlsHTML(item) {
    const cart = JSON.parse(localStorage.getItem('onlineCart')) || [];
    const itemInCart = cart.find(cartItem => cartItem.name === item.name);

    if (itemInCart) {
        return `
            <div class="quantity-controller">
                <button class="quantity-btn quantity-decrease-btn" data-name="${item.name}">-</button>
                <span class="item-quantity-display">${itemInCart.quantity}</span>
                <button class="quantity-btn quantity-increase-btn" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">+</button>
            </div>
        `;
    } else {
        return `
            <button class="add-to-cart-btn" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">Sepete Ekle</button>
        `;
    }
}

function openMenuModal() {
    const menuModal = document.getElementById('menu-modal');
    const modalMenuCategories = document.getElementById('modal-menu-categories');
    try {
        const menuDataToRender = getActualGlobalMenuData();
        if(modalMenuCategories) modalMenuCategories.innerHTML = ''; 

        if (menuDataToRender && menuDataToRender.categories) {
            for (const categoryName in menuDataToRender.categories) {
                const categorySection = document.createElement('div');
                categorySection.classList.add('menu-category');
                categorySection.innerHTML = `<h2>${categoryName}</h2>`;
                const itemsGrid = document.createElement('div');
                itemsGrid.classList.add('menu-items-grid');
                menuDataToRender.categories[categoryName].forEach(item => {
                    const menuItemCard = document.createElement('div');
                    menuItemCard.classList.add('menu-item-card');
                    menuItemCard.innerHTML = `
                        <img src="../images/${item.image}" alt="${item.name}">
                        <h4>${item.name}</h4>
                        <p class="price">${item.price.toFixed(2)} TL</p>
                        <div class="item-card-controls" data-name="${item.name}">
                            ${generateCartControlsHTML(item)}
                        </div>
                    `;
                    itemsGrid.appendChild(menuItemCard);
                });
                categorySection.appendChild(itemsGrid);
                if(modalMenuCategories) modalMenuCategories.appendChild(categorySection);
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

function openSelfServiceModal() {
    const selfServiceModal = document.getElementById('self-service-modal');
    const selfServiceMenuCategories = document.getElementById('self-service-menu-categories');
    const baristaSelectionContainer = document.getElementById('barista-selection-container');
    const filterContainer = document.getElementById('self-service-filter-container'); 

    const personnelData = {
        "ahmet": { "password": "ahmet123", "fullName": "Ahmet Yılmaz" },
        "ayse": { "password": "ayse123", "fullName": "Ayşe Demir" }
    };

    if (baristaSelectionContainer) {
        baristaSelectionContainer.innerHTML = `
            <div class="barista-selector-group">
                <label for="barista-selector">Lütfen Siparişinizi Hazırlayacak Baristayı Seçin:</label>
                <select id="barista-selector">
                    <option value="">-- Barista Seçiniz --</option>
                    ${Object.values(personnelData).map(p => `<option value="${p.fullName}">${p.fullName}</option>`).join('')}
                </select>
            </div>
        `;
    }

    let selfServiceCart = JSON.parse(localStorage.getItem('selfServiceCart')) || [];
    
    try {
        const menuDataToRender = getActualGlobalMenuData();
        if (selfServiceMenuCategories) selfServiceMenuCategories.innerHTML = '';

        if (filterContainer) {
            filterContainer.innerHTML = ''; 
            const allButton = document.createElement('button');
            allButton.className = 'filter-btn active';
            allButton.textContent = 'Tümü';
            allButton.dataset.category = 'Tümü';
            filterContainer.appendChild(allButton);

            Object.keys(menuDataToRender.categories).forEach(category => {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.textContent = category;
                button.dataset.category = category;
                filterContainer.appendChild(button);
            });

            filterContainer.querySelectorAll('.filter-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    filterContainer.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');
                    const categoryToFilter = e.target.dataset.category;
                    selfServiceMenuCategories.querySelectorAll('.menu-category').forEach(catDiv => {
                        if (categoryToFilter === 'Tümü' || catDiv.dataset.category === categoryToFilter) {
                            catDiv.style.display = 'block';
                        } else {
                            catDiv.style.display = 'none';
                        }
                    });
                });
            });
        }
       
        if (menuDataToRender && menuDataToRender.categories) {
            for (const categoryName in menuDataToRender.categories) {
                const categorySection = document.createElement('div');
                categorySection.classList.add('menu-category');
                categorySection.dataset.category = categoryName;
                categorySection.innerHTML = `<h2>${categoryName}</h2>`;
                const itemsGrid = document.createElement('div');
                itemsGrid.classList.add('menu-items-grid');
                menuDataToRender.categories[categoryName].forEach(item => {
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
                if (selfServiceMenuCategories) selfServiceMenuCategories.appendChild(categorySection);
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
            if (selfServiceMenuCategories) selfServiceMenuCategories.innerHTML = '<p>Menü içeriği bulunamadı.</p>';
        }
    } catch (error) {
        console.error('Error processing menu items for self-service modal:', error);
        if (selfServiceMenuCategories) selfServiceMenuCategories.innerHTML = '<p>Menü yüklenirken bir hata oluştu.</p>';
    }
    
    if (selfServiceModal) selfServiceModal.style.display = 'block';
}

function closeSelfServiceModal() {
    const selfServiceModal = document.getElementById('self-service-modal');
    if (selfServiceModal) selfServiceModal.style.display = 'none';
}

function updateSelfServiceModalCart(currentCart) {
    localStorage.setItem('selfServiceCart', JSON.stringify(currentCart));

    document.querySelectorAll('#self-service-modal .self-service-quantity').forEach(span => {
        const itemInCart = currentCart.find(item => item.name === span.dataset.name);
        span.textContent = itemInCart ? itemInCart.quantity : 0;
    });

    const modalCartSummary = document.querySelector('#self-service-modal .modal-cart-summary');
    if (!modalCartSummary) return;

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const summary = calculateDiscountedTotal(currentCart, loggedInUser);
    
    let summaryHTML = '';
    if (summary.totalDiscount > 0) {
        summaryHTML += `<div class="summary-row"><span>Ara Toplam:</span><span>${summary.originalTotal.toFixed(2)} TL</span></div><div class="summary-row discount-row"><span>İndirim (${summary.appliedCampaignTitle}):</span><span>- ${summary.totalDiscount.toFixed(2)} TL</span></div>`;
    }
    summaryHTML += `<div class="summary-row total-row"><span>Toplam:</span><span id="self-service-modal-total">${summary.finalTotal.toFixed(2)} TL</span></div><button id="place-self-service-order-btn" class="btn checkout-btn">Siparişi Onayla</button>`;

    modalCartSummary.innerHTML = summaryHTML;
    modalCartSummary.querySelector('#place-self-service-order-btn').addEventListener('click', placeSelfServiceOrder);
}

async function placeSelfServiceOrder() {
    const baristaSelector = document.getElementById('barista-selector');
    if (!baristaSelector || !baristaSelector.value) {
        showToast('Lütfen bir barista seçin.', 'error');
        return;
    }
    const selectedBaristaName = baristaSelector.value;
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        showToast('Sipariş vermek için giriş yapmalısınız.', 'error');
        closeSelfServiceModal();
        window.location.href = 'giris-yap.html';
        return;
    }
    const selfServiceCart = JSON.parse(localStorage.getItem('selfServiceCart')) || [];
    if (selfServiceCart.length === 0) {
        showToast('Sepetiniz boş. Lütfen ürün ekleyiniz.', 'error');
        return;
    }
    const summary = calculateDiscountedTotal(selfServiceCart, loggedInUser);
    
    showToast(`${selectedBaristaName} için siparişiniz alınıyor...`, 'info');

    setTimeout(() => {
        const orderTime = new Date();
        const newOrder = {
            id: `SS-${Date.now()}`,
            type: 'self-service',
            items: selfServiceCart,
            originalTotal: summary.originalTotal,
            discountApplied: summary.totalDiscount,
            appliedCampaign: summary.appliedCampaignTitle,
            total: summary.finalTotal,
            status: 'Beklemede',
            orderDate: orderTime.toISOString(),
            displayTime: `${orderTime.toLocaleDateString('tr-TR')} ${orderTime.toLocaleTimeString('tr-TR')}`,
            customerEmail: loggedInUser.email,
            assignedPersonnel: selectedBaristaName
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
        
        showToast(`Siparişiniz başarıyla alındı!`, 'success');
    }, 3000);
}

function performLogout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('onlineCart'); 
    localStorage.removeItem('selfServiceCart'); 
    window.location.href = 'ana-sayfa.html'; 
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
        if (profileIconContainer) profileIconContainer.style.display = 'flex';

        if (profileInfoContent) {
            let age = "Bilinmiyor";
            if (loggedInUser.birthDate) {
                const birthDate = new Date(loggedInUser.birthDate);
                if (!isNaN(birthDate.getTime())) { 
                    const today = new Date();
                    age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                }
            }
            const cardNumberDisplay = loggedInUser.creditCard && loggedInUser.creditCard.length > 4 
                ? `**** **** **** ${loggedInUser.creditCard.slice(-4)}` 
                : 'Bilgi Yok';
            profileInfoContent.innerHTML = `<p><strong>Ad:</strong> ${loggedInUser.firstName || 'N/A'}</p><p><strong>Soyad:</strong> ${loggedInUser.lastName || 'N/A'}</p><p><strong>Telefon:</strong> ${loggedInUser.phone || 'N/A'}</p><p><strong>E-posta:</strong> ${loggedInUser.email || 'N/A'}</p><p><strong>Yaş:</strong> ${age}</p><p><strong>Cinsiyet:</strong> ${loggedInUser.gender || 'Belirtilmemiş'}</p><p><strong>Kredi Kartı:</strong> ${cardNumberDisplay}</p>`;
        }

        if (headerLogoutBtn) {
             headerLogoutBtn.onclick = (event) => { 
                event.stopPropagation(); 
                performLogout(); 
            };
        }
        if (goToProfileBtn) {
            goToProfileBtn.onclick = (event) => { 
                event.stopPropagation(); 
                window.location.href = 'musteri-paneli.html'; 
            };
        }

        if (profileIconContainer) {
            profileIconContainer.onclick = (event) => {
                event.stopPropagation();
                const hamburgerElement = document.getElementById('hamburger-menu-toggle');
                const isMobileView = hamburgerElement && getComputedStyle(hamburgerElement).display !== 'none';
                if (isMobileView) {
                    window.location.href = 'musteri-paneli.html';
                } else {
                    if (profileDropdown) { 
                        profileIconContainer.classList.toggle('active');
                    }
                }
            };
            if (profileDropdown) {
                profileDropdown.onclick = (event) => { 
                    event.stopPropagation(); 
                };
            }
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
    }
    const selfServiceModal = document.getElementById('self-service-modal');
    if (selfServiceModal) {
        const closeButton = selfServiceModal.querySelector('.close-button');
        if (closeButton) closeButton.addEventListener('click', closeSelfServiceModal);
        const placeSelfServiceOrderBtn = document.getElementById('place-self-service-order-btn');
        if (placeSelfServiceOrderBtn) placeSelfServiceOrderBtn.addEventListener('click', placeSelfServiceOrder);
    }

    const hamburgerToggle = document.getElementById('hamburger-menu-toggle');
    const menuItemsWrapper = document.getElementById('menu-items-wrapper');

    if (hamburgerToggle && menuItemsWrapper) {
        hamburgerToggle.addEventListener('click', (event) => {
            event.stopPropagation(); 
            menuItemsWrapper.classList.toggle('active');
            const isExpanded = menuItemsWrapper.classList.contains('active');
            hamburgerToggle.setAttribute('aria-expanded', isExpanded);
            const icon = hamburgerToggle.querySelector('i');
            if (icon) {
                if (isExpanded) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    document.addEventListener('click', function(event) {
        const hamburgerToggle = document.getElementById('hamburger-menu-toggle'); 
        const menuItemsWrapper = document.getElementById('menu-items-wrapper');
        if (menuItemsWrapper && menuItemsWrapper.classList.contains('active')) {
            const isClickInsideMenuWrapper = menuItemsWrapper.contains(event.target);
            const isClickOnHamburger = hamburgerToggle ? hamburgerToggle.contains(event.target) : false;
            if (!isClickInsideMenuWrapper && !isClickOnHamburger) {
                menuItemsWrapper.classList.remove('active');
                if (hamburgerToggle) {
                    hamburgerToggle.setAttribute('aria-expanded', 'false');
                    const icon = hamburgerToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        }

        const profileIconContainer = document.getElementById('profile-icon-container');
        if (profileIconContainer && profileIconContainer.classList.contains('active')) {
            const profileDropdown = document.getElementById('profile-dropdown');
            if (profileDropdown && !profileDropdown.contains(event.target) && !profileIconContainer.contains(event.target) ) {
                 profileIconContainer.classList.remove('active');
            }
        }
        
        const currentMenuModal = document.getElementById('menu-modal');
        const currentSelfServiceModal = document.getElementById('self-service-modal');
        if (currentMenuModal && event.target == currentMenuModal) { 
            closeMenuModal();
        }
        if (currentSelfServiceModal && event.target == currentSelfServiceModal) {
            closeSelfServiceModal();
        }
    });

    document.body.addEventListener('click', function(event) {
        const target = event.target;
        
        // Sadece online sepet kontrolleri için
        if(target.closest('.item-card-controls')) {
            const controlsContainer = target.closest('.item-card-controls');
            const itemName = controlsContainer.dataset.name;

            let itemData = {};
            // Orijinal ürün verisini bulmak için global menü verisini kullan
            const allItems = Object.values(getActualGlobalMenuData().categories).flat();
            const originalItem = allItems.find(i => i.name === itemName);
            if(originalItem) itemData = originalItem;


            if (target.classList.contains('add-to-cart-btn')) {
                addToCart(itemData);
                showToast(`${itemName} sepete eklendi!`, 'success');
                controlsContainer.innerHTML = generateCartControlsHTML(itemData);
            }
            
            if (target.classList.contains('quantity-increase-btn')) {
                addToCart(itemData);
                const displaySpan = target.parentElement.querySelector('.item-quantity-display');
                const cart = JSON.parse(localStorage.getItem('onlineCart')) || [];
                const itemInCart = cart.find(cartItem => cartItem.name === itemName);
                if (displaySpan && itemInCart) {
                    displaySpan.textContent = itemInCart.quantity;
                }
            }
            
            if (target.classList.contains('quantity-decrease-btn')) {
                removeFromCart(itemName);
                const cart = JSON.parse(localStorage.getItem('onlineCart')) || [];
                const itemInCart = cart.find(cartItem => cartItem.name === itemName);
                if (itemInCart) {
                    const displaySpan = target.parentElement.querySelector('.item-quantity-display');
                    if(displaySpan) displaySpan.textContent = itemInCart.quantity;
                } else {
                    controlsContainer.innerHTML = generateCartControlsHTML(originalItem);
                }
            }
        }
    });
});