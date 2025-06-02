document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcome-message');
    const panelTabButtons = document.querySelectorAll('.panel-tab-button');
    const panelContents = document.querySelectorAll('.panel-content');
    const selfServiceOrdersList = document.getElementById('self-service-orders-list');
    const reportsList = document.getElementById('reports-list');
    const menuManagementCategories = document.getElementById('menu-management-categories');
    const addMenuItemBtn = document.getElementById('add-new-menu-item-btn');
    const logoutBtnPersonnel = document.getElementById('logout-btn-personnel');
    const onlineOrdersList = document.getElementById('online-orders-list');

    // --- menu.json içeriği (varsayılan menü için) ---
    const defaultMenuData = {
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

    const loggedInPersonnel = JSON.parse(localStorage.getItem('loggedInPersonnel'));
    if (!loggedInPersonnel) {
        alert('Bu sayfayı görüntülemek için personel girişi yapmalısınız!');
        window.location.href = 'giris-yap.html';
        return;
    }
    if(welcomeMessage) welcomeMessage.textContent = `Hoş geldiniz, ${loggedInPersonnel.fullName}!`;

    panelTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            panelTabButtons.forEach(btn => btn.classList.remove('active'));
            panelContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            const targetTab = button.dataset.tab;
            const targetElement = document.getElementById(targetTab);
            if(targetElement) targetElement.classList.add('active');

            if (targetTab === 'self-service-orders') loadSelfServiceOrders();
            else if (targetTab === 'online-orders') loadOnlineOrders();
            else if (targetTab === 'reports') loadReports();
            else if (targetTab === 'menu-management') loadMenuManagement();
        });
    });

    if (logoutBtnPersonnel) {
        logoutBtnPersonnel.addEventListener('click', () => {
            localStorage.removeItem('loggedInPersonnel');
            alert('Başarıyla çıkış yapıldı.');
            window.location.href = 'giris-yap.html';
        });
    }

    function loadSelfServiceOrders() {
        if(!selfServiceOrdersList) return;
        selfServiceOrdersList.innerHTML = '';
        let selfServiceOrders = JSON.parse(localStorage.getItem('selfServiceOrders')) || [];
        if (selfServiceOrders.length === 0) {
            selfServiceOrdersList.innerHTML = '<p>Henüz self servis sipariş bulunmamaktadır.</p>';
            return;
        }
        selfServiceOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        selfServiceOrders.forEach((order, orderIndex) => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');
            orderCard.innerHTML = `
                <h3>Self Servis Sipariş #${order.id.substring(0,5)}... (${order.displayTime})</h3>
                <p>Toplam: ${order.total.toFixed(2)} TL</p>
                <p>Durum: <span class="order-status ${order.status.replace(/\s/g, '')}">${order.status}</span></p>
                <h4>Ürünler:</h4>
                <ul>${order.items.map(item => `<li>${item.name} x ${item.quantity}</li>`).join('')}</ul>
                <button class="order-status-btn" data-order-id="${order.id}" data-order-type="selfService" data-new-status="Hazırlanıyor">Hazırlanıyor</button>
                <button class="order-status-btn" data-order-id="${order.id}" data-order-type="selfService" data-new-status="Hazır">Hazır</button>
                <button class="order-status-btn" data-order-id="${order.id}" data-order-type="selfService" data-new-status="Tamamlandı">Tamamlandı</button>
                <button class="order-delete-btn" data-order-id="${order.id}" data-order-type="selfService">Sil</button>
            `;
            selfServiceOrdersList.appendChild(orderCard);
        });
        attachOrderButtonListeners(selfServiceOrdersList, 'selfService');
    }

    function loadOnlineOrders() {
        if(!onlineOrdersList) return;
        onlineOrdersList.innerHTML = '';
        let onlineOrders = JSON.parse(localStorage.getItem('onlineOrders')) || [];
        if (onlineOrders.length === 0) {
            onlineOrdersList.innerHTML = '<p>Henüz online sipariş bulunmamaktadır.</p>';
            return;
        }
        onlineOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        onlineOrders.forEach((order, orderIndex) => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');
            orderCard.innerHTML = `
                <h3>Online Sipariş #${order.id.substring(0,5)}... (${order.displayTime})</h3>
                <p>Müşteri: ${order.customerEmail || 'Misafir'}</p>
                <p>Toplam: ${order.total.toFixed(2)} TL</p>
                <p>Durum: <span class="order-status ${order.status.replace(/\s/g, '')}">${order.status}</span></p>
                <h4>Ürünler:</h4>
                <ul>${order.items.map(item => `<li>${item.name} x ${item.quantity}</li>`).join('')}</ul>
                <button class="order-status-btn" data-order-id="${order.id}" data-order-type="online" data-new-status="Hazırlanıyor">Hazırlanıyor</button>
                <button class="order-status-btn" data-order-id="${order.id}" data-order-type="online" data-new-status="Yolda">Yolda</button>
                <button class="order-status-btn" data-order-id="${order.id}" data-order-type="online" data-new-status="Teslim Edildi">Teslim Edildi</button>
                <button class="order-delete-btn" data-order-id="${order.id}" data-order-type="online">Sil</button>
            `;
            onlineOrdersList.appendChild(orderCard);
        });
        attachOrderButtonListeners(onlineOrdersList, 'online');
    }
    
    function attachOrderButtonListeners(listElement, orderTypePrefix) {
        listElement.querySelectorAll('.order-status-btn').forEach(button => {
            button.addEventListener('click', updateOrderStatus);
        });
        listElement.querySelectorAll('.order-delete-btn').forEach(button => {
            button.addEventListener('click', deleteOrder);
        });
    }

    function updateOrderStatus(event) {
        const orderId = event.target.dataset.orderId;
        const orderType = event.target.dataset.orderType; // 'selfService' or 'online'
        const newStatus = event.target.dataset.newStatus;
        
        let ordersKey = orderType === 'selfService' ? 'selfServiceOrders' : 'onlineOrders';
        let orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        let customerOrderHistory = JSON.parse(localStorage.getItem('customerOrderHistory')) || [];

        const orderIndex = orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            localStorage.setItem(ordersKey, JSON.stringify(orders));

            const customerOrderIndex = customerOrderHistory.findIndex(order => order.id === orderId);
            if (customerOrderIndex !== -1) {
                customerOrderHistory[customerOrderIndex].status = newStatus;
                localStorage.setItem('customerOrderHistory', JSON.stringify(customerOrderHistory));
            }
            alert(`${orderType === 'selfService' ? 'Self Servis' : 'Online'} Sipariş durumu "${newStatus}" olarak güncellendi.`);
            if(orderType === 'selfService') loadSelfServiceOrders(); else loadOnlineOrders();
        }
    }

    function deleteOrder(event) {
        const orderId = event.target.dataset.orderId;
        const orderType = event.target.dataset.orderType;
        
        if (confirm(`${orderType === 'selfService' ? 'Self Servis' : 'Online'} Siparişini silmek istediğinize emin misiniz?`)) {
            let ordersKey = orderType === 'selfService' ? 'selfServiceOrders' : 'onlineOrders';
            let orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
            let customerOrderHistory = JSON.parse(localStorage.getItem('customerOrderHistory')) || [];

            orders = orders.filter(order => order.id !== orderId);
            localStorage.setItem(ordersKey, JSON.stringify(orders));

            customerOrderHistory = customerOrderHistory.filter(order => order.id !== orderId);
            localStorage.setItem('customerOrderHistory', JSON.stringify(customerOrderHistory));

            alert(`${orderType === 'selfService' ? 'Self Servis' : 'Online'} Siparişi silindi.`);
            if(orderType === 'selfService') loadSelfServiceOrders(); else loadOnlineOrders();
        }
    }

    function loadReports() {
        if(!reportsList) return;
        reportsList.innerHTML = '';
        const reports = JSON.parse(localStorage.getItem('personnelReports')) || [];
        if (reports.length === 0) {
            reportsList.innerHTML = '<p>Henüz rapor bulunmamaktadır.</p>';
            return;
        }
        reports.forEach((report, index) => {
            const reportCard = document.createElement('div');
            reportCard.classList.add('report-card');
            reportCard.innerHTML = `
                <h3>Konu: ${report.subject || 'Belirtilmemiş'}</h3>
                <p class="report-meta">Gönderen: ${report.fullName} (${report.email}) | ${report.timestamp}</p>
                <p><strong>Mesaj:</strong> ${report.message}</p>
                <button class="delete-report-btn" data-index="${index}">Sil</button>
            `;
            reportsList.appendChild(reportCard);
        });
        reportsList.querySelectorAll('.delete-report-btn').forEach(button => {
            button.addEventListener('click', deleteReport);
        });
    }

    function deleteReport(event) {
        const indexToDelete = parseInt(event.target.dataset.index);
        let reports = JSON.parse(localStorage.getItem('personnelReports')) || [];
        if (confirm('Bu raporu silmek istediğinize emin misiniz?')) {
            reports.splice(indexToDelete, 1);
            localStorage.setItem('personnelReports', JSON.stringify(reports));
            loadReports();
            alert('Rapor başarıyla silindi.');
        }
    }

    let cafeMenu = { categories: {} }; 

    function loadMenuManagement() { // async kaldırıldı
        if(menuManagementCategories) menuManagementCategories.innerHTML = '';
        try {
            let menuData = JSON.parse(localStorage.getItem('currentCafeMenu'));
            if (!menuData) {
                console.log("localStorage'da 'currentCafeMenu' bulunamadı, gömülü varsayılan menü kullanılıyor.");
                menuData = JSON.parse(JSON.stringify(defaultMenuData)); // Derin kopya al
            }
            cafeMenu = menuData;

            if (cafeMenu && cafeMenu.categories) {
                for (const categoryName in cafeMenu.categories) {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.classList.add('menu-management-category');
                    categoryDiv.innerHTML = `<h3>${categoryName}</h3>`;
                    const itemList = document.createElement('div');
                    itemList.classList.add('menu-management-item-list');
                    cafeMenu.categories[categoryName].forEach(item => {
                        const itemCard = document.createElement('div');
                        itemCard.classList.add('menu-management-item-card');
                        itemCard.innerHTML = `
                            <img src="../images/${item.image}" alt="${item.name}">
                            <h4>${item.name}</h4>
                            <p>Fiyat: ${item.price.toFixed(2)} TL</p>
                            <div class="item-actions">
                                <button class="edit-item-btn" data-category="${categoryName}" data-name="${item.name}">Düzenle</button>
                                <button class="delete-btn" data-category="${categoryName}" data-name="${item.name}">Sil</button>
                            </div>
                        `;
                        itemList.appendChild(itemCard);
                    });
                    categoryDiv.appendChild(itemList);
                    if(menuManagementCategories) menuManagementCategories.appendChild(categoryDiv);
                }
                document.querySelectorAll('.edit-item-btn').forEach(button => button.addEventListener('click', editMenuItem));
                document.querySelectorAll('.delete-btn').forEach(button => button.addEventListener('click', deleteMenuItem));
            } else {
                 if(menuManagementCategories) menuManagementCategories.innerHTML = '<p>Menü içeriği bulunamadı.</p>';
            }
        } catch (error) {
            console.error('Error loading menu for management:', error);
            if(menuManagementCategories) menuManagementCategories.innerHTML = '<p>Menü yönetimi yüklenirken bir hata oluştu.</p>';
        }
    }

    function editMenuItem(event) {
        const category = event.target.dataset.category;
        const itemName = event.target.dataset.name;
        const itemToEdit = cafeMenu.categories[category].find(item => item.name === itemName);
        if (itemToEdit) {
            const newName = prompt(`Yeni ürün adını girin (${itemName}):`, itemToEdit.name);
            if (newName === null) return;
            const newPrice = prompt(`Yeni fiyatı girin (${itemToEdit.price} TL):`, itemToEdit.price);
            if (newPrice === null || isNaN(parseFloat(newPrice))) {
                alert('Geçersiz fiyat girdiniz.'); return;
            }
            itemToEdit.name = newName;
            itemToEdit.price = parseFloat(newPrice);
            saveMenuChanges(cafeMenu);
            loadMenuManagement();
            alert(`${itemName} başarıyla güncellendi.`);
        }
    }

    function deleteMenuItem(event) {
        const category = event.target.dataset.category;
        const itemName = event.target.dataset.name;
        if (confirm(`"${itemName}" adlı ürünü menüden silmek istediğinize emin misiniz?`)) {
            cafeMenu.categories[category] = cafeMenu.categories[category].filter(item => item.name !== itemName);
            if (cafeMenu.categories[category].length === 0) delete cafeMenu.categories[category];
            saveMenuChanges(cafeMenu);
            loadMenuManagement();
            alert(`${itemName} menüden başarıyla silindi.`);
        }
    }

    if(addMenuItemBtn) {
        addMenuItemBtn.addEventListener('click', () => {
            const newItemName = prompt('Eklenecek yeni ürünün adını girin:');
            if (!newItemName) return;
            const newItemPrice = prompt(`"${newItemName}" için fiyatı girin:`);
            if (!newItemPrice || isNaN(parseFloat(newItemPrice))) { alert('Geçersiz fiyat girdiniz.'); return; }
            const newItemImage = prompt(`"${newItemName}" için resim dosya adını girin (örn: kahve.jpg):`);
            if (!newItemImage) return;
            let targetCategory = prompt(`"${newItemName}" hangi kategoriye eklenecek? (örn: Sıcak İçecekler)`);
            if (!targetCategory) return;
            targetCategory = targetCategory.charAt(0).toUpperCase() + targetCategory.slice(1); // Basit bir baş harf büyütme
            if (!cafeMenu.categories[targetCategory]) cafeMenu.categories[targetCategory] = [];
            cafeMenu.categories[targetCategory].push({ name: newItemName, image: newItemImage, price: parseFloat(newItemPrice) });
            saveMenuChanges(cafeMenu);
            loadMenuManagement();
            alert(`${newItemName} başarıyla menüye eklendi.`);
        });
    }

    function saveMenuChanges(updatedMenu) {
        localStorage.setItem('currentCafeMenu', JSON.stringify(updatedMenu));
    }

    if(panelTabButtons.length > 0) panelTabButtons[0].click(); // İlk tabı aktif et
});