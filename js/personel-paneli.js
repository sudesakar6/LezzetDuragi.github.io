// js/personel-paneli.js (Daha Okunaklı Formatta Nihai Hali)

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTLERİ ---
    const welcomeMessage = document.getElementById('welcome-message');
    const panelTabButtons = document.querySelectorAll('.panel-tab-button');
    const panelContents = document.querySelectorAll('.panel-content');
    const selfServiceOrdersList = document.getElementById('self-service-orders-list');
    const onlineOrdersList = document.getElementById('online-orders-list');
    const reportsList = document.getElementById('reports-list');
    const menuManagementCategories = document.getElementById('menu-management-categories');
    const addMenuItemBtn = document.getElementById('add-new-menu-item-btn');
    const logoutBtnPersonnel = document.getElementById('logout-btn-personnel');
    const usersListContainer = document.getElementById('users-list');

    // Modallar ve İçerikleri
    const userDetailsModal = document.getElementById('user-details-modal');
    const closeUserDetailsModalBtn = document.getElementById('close-user-details-modal');
    const userDetailsContent = document.getElementById('user-details-content');
    const deleteUserBtn = document.getElementById('delete-user-btn');

    // Genel Onay Modalı Elemanları
    const confirmModal = document.getElementById('confirm-modal');
    const confirmModalText = document.getElementById('confirm-modal-text');
    const confirmModalConfirmBtn = document.getElementById('confirm-modal-confirm-btn');
    const confirmModalCancelBtn = document.getElementById('confirm-modal-cancel-btn');
    const closeConfirmModalBtn = document.getElementById('close-confirm-modal');

    // Ürün Ekleme/Düzenleme Modalı Elemanları
    const itemModal = document.getElementById('item-modal');
    const itemModalTitle = document.getElementById('item-modal-title');
    const closeItemModalBtn = document.getElementById('close-item-modal');
    const cancelItemBtn = document.getElementById('cancel-item-btn');
    const itemForm = document.getElementById('item-form');
    const itemFormSubmitBtn = document.getElementById('item-form-submit-btn');
    const itemCategorySelect = document.getElementById('itemCategory');
    const newCategoryGroup = document.getElementById('new-category-group');

    // --- DEĞİŞKENLER ---
    let cafeMenu = { categories: {} };
    let activeConfirmCallback = null;

    // --- SAYFA YÜKLEME VE YETKİLENDİRME ---
    const loggedInPersonnel = JSON.parse(localStorage.getItem('loggedInPersonnel'));
    if (!loggedInPersonnel) {
        alert('Bu sayfayı görüntülemek için personel girişi yapmalısınız!');
        window.location.href = 'giris-yap.html';
        return;
    }

    if (welcomeMessage) {
        welcomeMessage.textContent = `Hoş geldiniz, ${loggedInPersonnel.fullName}!`;
    }

    // --- YARDIMCI FONKSİYONLAR ---
    function showConfirmModal(message, onConfirm) {
        if (confirmModalText) {
            confirmModalText.textContent = message;
        }
        activeConfirmCallback = onConfirm;
        if (confirmModal) {
            confirmModal.style.display = 'block';
        }
    }

    function hideConfirmModal() {
        if (confirmModal) {
            confirmModal.style.display = 'none';
        }
        activeConfirmCallback = null;
    }

    // --- OLAY DİNLEYİCİLERİ VE BAŞLATMA ---
    function initializeEventListeners() {
        panelTabButtons.forEach(button => {
            button.addEventListener('click', () => switchTab(button.dataset.tab));
        });

        if (logoutBtnPersonnel) {
            logoutBtnPersonnel.addEventListener('click', performLogout);
        }

        if (closeUserDetailsModalBtn) {
            closeUserDetailsModalBtn.addEventListener('click', () => {
                userDetailsModal.style.display = 'none';
            });
        }

        if (closeConfirmModalBtn) {
            closeConfirmModalBtn.addEventListener('click', hideConfirmModal);
        }

        if (confirmModalCancelBtn) {
            confirmModalCancelBtn.addEventListener('click', hideConfirmModal);
        }

        if (closeItemModalBtn) {
            closeItemModalBtn.addEventListener('click', () => {
                itemModal.style.display = 'none';
            });
        }

        if (cancelItemBtn) {
            cancelItemBtn.addEventListener('click', () => {
                itemModal.style.display = 'none';
            });
        }

        window.addEventListener('click', (event) => {
            if (event.target == userDetailsModal) {
                userDetailsModal.style.display = 'none';
            }
            if (event.target == confirmModal) {
                hideConfirmModal();
            }
            if (event.target == itemModal) {
                itemModal.style.display = 'none';
            }
        });

        if (confirmModalConfirmBtn) {
            confirmModalConfirmBtn.addEventListener('click', () => {
                if (typeof activeConfirmCallback === 'function') {
                    activeConfirmCallback();
                }
                hideConfirmModal();
            });
        }

        if (addMenuItemBtn) {
            addMenuItemBtn.addEventListener('click', openAddItemModal);
        }

        if (itemForm) {
            itemForm.addEventListener('submit', handleItemFormSubmit);
        }

        if (itemCategorySelect) {
            itemCategorySelect.addEventListener('change', () => {
                const isNewCategory = (itemCategorySelect.value === '_new_');
                newCategoryGroup.style.display = isNewCategory ? 'block' : 'none';
                document.getElementById('newCategoryName').required = isNewCategory;
            });
        }
    }

    // --- ANA FONKSİYONLAR ---
    function switchTab(targetTabId) {
        panelTabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === targetTabId);
        });

        panelContents.forEach(content => {
            content.classList.toggle('active', content.id === targetTabId);
        });

        const tabActions = {
            'self-service-orders': loadSelfServiceOrders,
            'online-orders': loadOnlineOrders,
            'reports': loadReports,
            'menu-management': loadMenuManagement,
            'users': loadUsers
        };

        if (tabActions[targetTabId]) {
            tabActions[targetTabId]();
        }
    }

    function performLogout() {
        localStorage.removeItem('loggedInPersonnel');
        window.location.href = 'giris-yap.html';
    }

    // --- KULLANICI YÖNETİMİ ---
    function loadUsers() {
        if (!usersListContainer) {
            return;
        }

        usersListContainer.innerHTML = '';
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        if (registeredUsers.length === 0) {
            usersListContainer.innerHTML = '<p>Henüz kayıtlı kullanıcı bulunmamaktadır.</p>';
            return;
        }

        registeredUsers.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));

        registeredUsers.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-list-item';
            let registrationDate = 'Bilinmiyor';
            if (user.registrationDate) {
                registrationDate = new Date(user.registrationDate).toLocaleString('tr-TR');
            }
            userItem.innerHTML = `<h4>${user.firstName} ${user.lastName}</h4><span class="registration-date">Kayıt: ${registrationDate}</span>`;
            userItem.addEventListener('click', () => showUserDetails(user));
            usersListContainer.appendChild(userItem);
        });
    }

    function showUserDetails(user) {
        if (!userDetailsContent || !userDetailsModal) {
            return;
        }

        let age = "Bilinmiyor";
        if (user.birthDate) {
            const birthDate = new Date(user.birthDate);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }

        let registrationDate = 'Bilinmiyor';
        if (user.registrationDate) {
            registrationDate = new Date(user.registrationDate).toLocaleString('tr-TR');
        }

        userDetailsContent.innerHTML = `
            <p><strong>Ad Soyad:</strong> ${user.firstName} ${user.lastName}</p>
            <p><strong>E-posta:</strong> ${user.email}</p>
            <p><strong>Telefon:</strong> ${user.phone}</p>
            <p><strong>Doğum Tarihi:</strong> ${new Date(user.birthDate).toLocaleDateString('tr-TR')}</p>
            <p><strong>Yaş:</strong> ${age}</p>
            <p><strong>Cinsiyet:</strong> ${user.gender}</p>
            <p><strong>Kayıt Tarihi:</strong> ${registrationDate}</p>
        `;
        
        if (deleteUserBtn) {
            deleteUserBtn.onclick = () => deleteUser(user.email);
        }

        userDetailsModal.style.display = 'block';
    }
    
    function deleteUser(userEmail) {
        const message = `'${userEmail}' e-posta adresli kullanıcıyı ve bu kullanıcıya ait TÜM verileri (siparişler, mesajlar) kalıcı olarak silmek istediğinizden emin misiniz?\nBu işlem geri alınamaz!`;
        showConfirmModal(message, () => {
            localStorage.setItem('registeredUsers', JSON.stringify((JSON.parse(localStorage.getItem('registeredUsers')) || []).filter(user => user.email !== userEmail)));
            localStorage.setItem('customerOrderHistory', JSON.stringify((JSON.parse(localStorage.getItem('customerOrderHistory')) || []).filter(order => order.customerEmail !== userEmail)));
            localStorage.setItem('selfServiceOrders', JSON.stringify((JSON.parse(localStorage.getItem('selfServiceOrders')) || []).filter(order => order.customerEmail !== userEmail)));
            localStorage.setItem('onlineOrders', JSON.stringify((JSON.parse(localStorage.getItem('onlineOrders')) || []).filter(order => order.customerEmail !== userEmail)));
            localStorage.setItem('personnelReports', JSON.stringify((JSON.parse(localStorage.getItem('personnelReports')) || []).filter(report => report.email !== userEmail)));
            
            userDetailsModal.style.display = 'none';
            loadUsers();
            showToast('Kullanıcı başarıyla silindi.', 'success');
        });
    }

    // --- SİPARİŞ YÖNETİMİ ---
    function loadSelfServiceOrders() {
        if (!selfServiceOrdersList) {
            return;
        }
        const allOrders = JSON.parse(localStorage.getItem('selfServiceOrders')) || [];
        const assignedOrders = allOrders.filter(order => order.assignedPersonnel === loggedInPersonnel.fullName);
        displayOrders(assignedOrders, selfServiceOrdersList, 'selfService');
    }

    function loadOnlineOrders() {
        if (!onlineOrdersList) {
            return;
        }
        const allOrders = JSON.parse(localStorage.getItem('onlineOrders')) || [];
        displayOrders(allOrders, onlineOrdersList, 'online');
    }
    
    function displayOrders(orders, container, orderType) {
        container.innerHTML = '';

        if (orders.length === 0) {
            container.innerHTML = `<p>Bu kategoride sipariş bulunmamaktadır.</p>`;
            return;
        }

        orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');
            
            let customerInfo = '';
            if (orderType === 'online') {
                customerInfo = `<p>Müşteri: ${order.customerEmail || 'Misafir'}</p>`;
            }
            
            let statusButtons = '';
            if ((orderType === 'selfService' && order.status !== 'Tamamlandı') || 
                (orderType === 'online' && order.status !== 'Teslim Edildi')) {
                if (orderType === 'online') {
                    statusButtons = `
                        <button class="order-status-btn" data-order-id="${order.id}" data-order-type="online" data-new-status="Hazırlanıyor">Hazırlanıyor</button>
                        <button class="order-status-btn" data-order-id="${order.id}" data-order-type="online" data-new-status="Yolda">Yolda</button>
                        <button class="order-status-btn" data-order-id="${order.id}" data-order-type="online" data-new-status="Teslim Edildi">Teslim Edildi</button>
                    `;
                } else {
                    statusButtons = `
                        <button class="order-status-btn" data-order-id="${order.id}" data-order-type="selfService" data-new-status="Hazırlanıyor">Hazırlanıyor</button>
                        <button class="order-status-btn" data-order-id="${order.id}" data-order-type="selfService" data-new-status="Hazır">Hazır</button>
                        <button class="order-status-btn" data-order-id="${order.id}" data-order-type="selfService" data-new-status="Tamamlandı">Tamamlandı</button>
                    `;
                }
            }

            orderCard.innerHTML = `
                <h3>${orderType === 'online' ? 'Online' : 'Self Servis'} Sipariş #${order.id.substring(0,5)}...</h3>
                <p class="order-meta">(${order.displayTime})</p>
                ${customerInfo}
                <p>Toplam: ${order.total.toFixed(2)} TL</p>
                <p>Durum: <span class="order-status ${order.status.replace(/\s/g, '')}">${order.status}</span></p>
                <h4>Ürünler:</h4>
                <ul>${order.items.map(item => `<li>${item.name} x ${item.quantity}</li>`).join('')}</ul>
                ${statusButtons}
                <button class="order-delete-btn" data-order-id="${order.id}" data-order-type="${orderType}">Sil</button>
            `;
            container.appendChild(orderCard);
        });

        attachOrderButtonListeners(container);
    }

    function attachOrderButtonListeners(listElement) {
        listElement.querySelectorAll('.order-status-btn').forEach(button => {
            button.addEventListener('click', updateOrderStatus);
        });
        listElement.querySelectorAll('.order-delete-btn').forEach(button => {
            button.addEventListener('click', deleteOrder);
        });
    }
    
    function updateOrderStatus(event) {
        const { orderId, orderType, newStatus } = event.target.dataset;
        const ordersKey = `${orderType}Orders`;
        let orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        const orderIndex = orders.findIndex(order => order.id === orderId);

        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            localStorage.setItem(ordersKey, JSON.stringify(orders));
            updateCustomerHistory(orderId, { status: newStatus });
            showToast(`Sipariş durumu "${newStatus}" olarak güncellendi.`, 'success');
            
            if (orderType === 'selfService') {
                loadSelfServiceOrders();
            } else {
                loadOnlineOrders();
            }
        }
    }

    function deleteOrder(event) {
        const { orderId, orderType } = event.target.dataset;
        showConfirmModal('Bu siparişi silmek istediğinizden emin misiniz?', () => {
            const ordersKey = `${orderType}Orders`;
            let updatedOrders = (JSON.parse(localStorage.getItem(ordersKey)) || []).filter(order => order.id !== orderId);
            localStorage.setItem(ordersKey, JSON.stringify(updatedOrders));
            updateCustomerHistory(orderId, null);
            
            if (orderType === 'selfService') {
                loadSelfServiceOrders();
            } else {
                loadOnlineOrders();
            }
            showToast('Sipariş silindi.', 'success');
        });
    }
    
    function updateCustomerHistory(orderId, newValues) {
        let history = JSON.parse(localStorage.getItem('customerOrderHistory')) || [];
        if (newValues === null) {
            history = history.filter(o => o.id !== orderId);
        } else {
            const index = history.findIndex(o => o.id === orderId);
            if (index !== -1) {
                Object.assign(history[index], newValues);
            }
        }
        localStorage.setItem('customerOrderHistory', JSON.stringify(history));
    }

    // --- RAPOR YÖNETİMİ ---
    function loadReports() {
        if (!reportsList) {
            return;
        }
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
            reportCard.querySelector('.delete-report-btn').addEventListener('click', () => deleteReport(index));
            reportsList.appendChild(reportCard);
        });
    }
    
    function deleteReport(indexToDelete) {
        showConfirmModal('Bu raporu silmek istediğinize emin misiniz?', () => {
            let reports = JSON.parse(localStorage.getItem('personnelReports')) || [];
            reports.splice(indexToDelete, 1);
            localStorage.setItem('personnelReports', JSON.stringify(reports));
            loadReports();
            showToast('Rapor silindi.', 'success');
        });
    }

    // --- MENÜ YÖNETİMİ ---
    function loadMenuManagement() {
        if (!menuManagementCategories) {
            return;
        }
        menuManagementCategories.innerHTML = '';
        try {
            const menuData = getActualGlobalMenuData();
            cafeMenu = menuData;
            
            if (!cafeMenu || !cafeMenu.categories || Object.keys(cafeMenu.categories).length === 0) { 
                menuManagementCategories.innerHTML = '<p>Menü içeriği bulunamadı. Lütfen yeni bir öğe ekleyin.</p>'; 
                return; 
            }

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
                    itemCard.querySelector('.edit-item-btn').addEventListener('click', (e) => openEditItemModal(e.currentTarget.dataset.category, e.currentTarget.dataset.name));
                    itemCard.querySelector('.delete-btn').addEventListener('click', (e) => deleteMenuItem(e.currentTarget.dataset.category, e.currentTarget.dataset.name));
                    itemList.appendChild(itemCard);
                });
                
                categoryDiv.appendChild(itemList);
                menuManagementCategories.appendChild(categoryDiv);
            }
        } catch (error) { 
            console.error('Error loading menu for management:', error); 
            if(menuManagementCategories) {
                menuManagementCategories.innerHTML = '<p>Menü yönetimi yüklenirken bir hata oluştu.</p>';
            } 
        }
    }

    function openAddItemModal() {
        itemForm.reset();
        itemForm.dataset.mode = 'add';
        itemModalTitle.textContent = 'Yeni Menü Öğesi Ekle';
        itemFormSubmitBtn.textContent = 'Öğeyi Kaydet';
        populateCategorySelect();
        newCategoryGroup.style.display = 'none';
        itemModal.style.display = 'block';
    }

    function openEditItemModal(category, name) {
        const itemToEdit = cafeMenu.categories[category].find(item => item.name === name);
        if (!itemToEdit) {
            return;
        }

        itemForm.reset();
        itemForm.dataset.mode = 'edit';
        itemModalTitle.textContent = 'Menü Öğesini Düzenle';
        itemFormSubmitBtn.textContent = 'Değişiklikleri Kaydet';

        document.getElementById('edit-item-original-name').value = name;
        document.getElementById('edit-item-original-category').value = category;

        document.getElementById('itemName').value = itemToEdit.name;
        document.getElementById('itemPrice').value = itemToEdit.price;
        document.getElementById('itemImage').value = itemToEdit.image;
        
        populateCategorySelect();
        itemCategorySelect.value = category;
        newCategoryGroup.style.display = 'none';

        itemModal.style.display = 'block';
    }
    
    function populateCategorySelect() {
        itemCategorySelect.innerHTML = '<option value="">-- Mevcut Kategori Seç --</option>';
        if (cafeMenu && cafeMenu.categories) {
            Object.keys(cafeMenu.categories).forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                itemCategorySelect.appendChild(option);
            });
        }
        itemCategorySelect.innerHTML += '<option value="_new_">** Yeni Kategori Ekle **</option>';
    }

    function handleItemFormSubmit(event) {
        event.preventDefault();
        const mode = itemForm.dataset.mode;

        const itemName = document.getElementById('itemName').value.trim();
        const itemPrice = parseFloat(document.getElementById('itemPrice').value);
        const itemImage = document.getElementById('itemImage').value.trim() || 'default.jpg';
        let selectedCategory = itemCategorySelect.value;
        const newCategoryName = document.getElementById('newCategoryName').value.trim();

        if (selectedCategory === '_new_') {
            if (!newCategoryName) {
                return showToast('Lütfen yeni kategori adını girin.', 'error');
            }
            selectedCategory = newCategoryName.charAt(0).toUpperCase() + newCategoryName.slice(1);
        }

        if (!itemName || isNaN(itemPrice) || !selectedCategory) {
            return showToast('Lütfen tüm zorunlu alanları (*) doldurun.', 'error');
        }

        if (mode === 'add') {
            if (!cafeMenu.categories[selectedCategory]) {
                cafeMenu.categories[selectedCategory] = [];
            }
            cafeMenu.categories[selectedCategory].push({ name: itemName, price: itemPrice, image: itemImage });
            showToast('Ürün başarıyla eklendi.', 'success');
        } else {
            const originalName = document.getElementById('edit-item-original-name').value;
            const originalCategory = document.getElementById('edit-item-original-category').value;
            
            if (cafeMenu.categories[originalCategory]) {
                cafeMenu.categories[originalCategory] = cafeMenu.categories[originalCategory].filter(item => item.name !== originalName);
                if (cafeMenu.categories[originalCategory].length === 0) {
                    delete cafeMenu.categories[originalCategory];
                }
            }
            
            if (!cafeMenu.categories[selectedCategory]) {
                cafeMenu.categories[selectedCategory] = [];
            }
            cafeMenu.categories[selectedCategory].push({ name: itemName, price: itemPrice, image: itemImage });
            showToast('Ürün başarıyla güncellendi.', 'success');
        }

        saveMenuChanges();
        itemModal.style.display = 'none';
        loadMenuManagement();
    }

    function deleteMenuItem(category, name) {
        showConfirmModal(`"${name}" adlı ürünü menüden silmek istediğinize emin misiniz?`, () => {
            if (cafeMenu.categories[category]) {
                cafeMenu.categories[category] = cafeMenu.categories[category].filter(item => item.name !== name);
                if (cafeMenu.categories[category].length === 0) {
                    delete cafeMenu.categories[category];
                }
                saveMenuChanges();
                loadMenuManagement();
                showToast('Ürün silindi.', 'success');
            }
        });
    }
    
    function saveMenuChanges() {
        localStorage.setItem('currentCafeMenu', JSON.stringify(cafeMenu));
    }

    // --- UYGULAMAYI BAŞLAT ---
    initializeEventListeners();
    if (panelTabButtons.length > 0) {
        switchTab(panelTabButtons[0].dataset.tab);
    }
});