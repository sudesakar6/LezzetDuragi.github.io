// js/musteri-paneli.js (Dinamik Favoriler Eklenmiş Nihai Hali)

document.addEventListener('DOMContentLoaded', () => {
    // --- Mevcut DOM Elementleri ---
    const customerWelcomeMessage = document.getElementById('customer-welcome-message');
    const displayFullname = document.getElementById('display-fullname');
    const displayEmail = document.getElementById('display-email');
    const displayPhone = document.getElementById('display-phone');
    const displayBirthdate = document.getElementById('display-birthdate');
    const displayGender = document.getElementById('display-gender');
    const lastOrdersList = document.getElementById('last-orders-list');
    const favoritesList = document.getElementById('favorites-list'); // Favoriler listesi için DOM elementi
    
    // Profil Düzenleme Modalı Elemanları
    const editProfileBtn = document.getElementById('edit-profile-btn'); 
    const profileEditModal = document.getElementById('profile-edit-modal');
    const closeProfileEditModalBtn = document.getElementById('close-profile-edit-modal');
    const cancelProfileEditBtn = document.getElementById('cancel-profile-edit');
    const profileEditForm = document.getElementById('profile-edit-form');
    const editFirstNameInput = document.getElementById('editFirstName');
    const editLastNameInput = document.getElementById('editLastName');
    const editEmailInput = document.getElementById('editEmail');
    const editPhoneInput = document.getElementById('editPhone');
    const editBirthDateInput = document.getElementById('editBirthDate');
    const editAgeWarning = document.getElementById('edit-age-warning');
    const logoutBtnPanel = document.getElementById('logout-btn-panel');

    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let originalUserEmailForUpdate = ''; 

    // --- Yetkilendirme Kontrolü ---
    if (!loggedInUser) {
        if (window.location.pathname.endsWith('musteri-paneli.html')) {
            alert('Bu sayfayı görüntülemek için müşteri girişi yapmalısınız!');
            window.location.href = 'giris-yap.html';
        }
        return; 
    }
    
    // --- Profil Bilgilerini Gösterme Fonksiyonları ---
    function updateDisplayedProfileInfo() {
        if (loggedInUser) {
            if (customerWelcomeMessage) customerWelcomeMessage.textContent = `Hoş geldiniz, ${loggedInUser.firstName} ${loggedInUser.lastName}!`;
            if (displayFullname) displayFullname.textContent = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
            if (displayEmail) displayEmail.textContent = loggedInUser.email;
            if (displayPhone) displayPhone.textContent = loggedInUser.phone;
            if (displayBirthdate) displayBirthdate.textContent = loggedInUser.birthDate ? new Date(loggedInUser.birthDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş';
            if (displayGender) displayGender.textContent = loggedInUser.gender || 'Belirtilmemiş';
            if (typeof updateAuthButtonsInHeader === 'function') updateAuthButtonsInHeader();
        }
    }

    function displayRecentOrders() {
        const customerOrderHistory = JSON.parse(localStorage.getItem('customerOrderHistory')) || [];
        if (lastOrdersList && customerOrderHistory) {
            const userOrders = customerOrderHistory.filter(order => order.customerEmail === loggedInUser.email);

            if (userOrders.length > 0) {
                const recentOrders = userOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);
                lastOrdersList.innerHTML = recentOrders.map(order => `
                    <li>
                        <strong>Sipariş ${order.id.split('-')[0]}</strong> (${new Date(order.orderDate).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}) - ${order.total.toFixed(2)} TL
                        <br>Durum: <span class="order-status ${order.status.replace(/\s/g, '')}">${order.status}</span>
                    </li>
                `).join('');
            } else {
                lastOrdersList.innerHTML = '<li>Henüz siparişiniz bulunmamaktadır.</li>';
            }
        }
    }

    // --- YENİ: Favori ürünleri hesaplayan ve gösteren fonksiyon ---
    function displayTopFavorites() {
        if (!favoritesList) return;

        const customerOrderHistory = JSON.parse(localStorage.getItem('customerOrderHistory')) || [];
        const userOrders = customerOrderHistory.filter(order => order.customerEmail === loggedInUser.email);

        if (userOrders.length === 0) {
            favoritesList.innerHTML = '<li>Daha favoriniz henüz gözükmemektedir.</li>';
            return;
        }

        const itemCounts = {};
        // Tüm siparişlerdeki ürünleri ve miktarlarını say
        userOrders.forEach(order => {
            order.items.forEach(item => {
                if (itemCounts[item.name]) {
                    itemCounts[item.name] += item.quantity;
                } else {
                    itemCounts[item.name] = item.quantity;
                }
            });
        });

        // Sayılan ürünleri bir diziye çevir
        const sortedItems = Object.keys(itemCounts).map(name => {
            return { name: name, count: itemCounts[name] };
        });

        // Diziyi en çok sipariş edilenden en aza doğru sırala
        sortedItems.sort((a, b) => b.count - a.count);

        // İlk 2 ürünü al
        const topFavorites = sortedItems.slice(0, 2);

        if (topFavorites.length > 0) {
            favoritesList.innerHTML = topFavorites.map(fav => `<li>${fav.name}</li>`).join('');
        } else {
            favoritesList.innerHTML = '<li>Daha favoriniz henüz gözükmemektedir.</li>';
        }
    }

    // --- Profil Düzenleme Fonksiyonları ve Olay Dinleyicileri ---
    function validateAgeForEdit() {
        if (!editBirthDateInput || !editBirthDateInput.value) {
            if(editAgeWarning) editAgeWarning.textContent = '';
            return true; 
        }
        const birthDate = new Date(editBirthDateInput.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }

        if (age < 18) {
            if(editAgeWarning) editAgeWarning.textContent = '18 yaşından büyük olmalısınız.';
            return false;
        } else {
            if(editAgeWarning) editAgeWarning.textContent = '';
            return true;
        }
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', (event) => {
            event.preventDefault();
            if (!loggedInUser) return; 
            originalUserEmailForUpdate = loggedInUser.email; 
            editFirstNameInput.value = loggedInUser.firstName || '';
            editLastNameInput.value = loggedInUser.lastName || '';
            editEmailInput.value = loggedInUser.email || '';
            editPhoneInput.value = loggedInUser.phone || '';
            editBirthDateInput.value = loggedInUser.birthDate ? loggedInUser.birthDate.split('T')[0] : '';
            
            const genderValue = loggedInUser.gender;
            const genderRadios = profileEditForm.elements.editGender;
            if (genderRadios) {
                for (const radio of genderRadios) { radio.checked = (radio.value === genderValue); }
                if (!Array.from(genderRadios).some(radio => radio.checked)) {
                    const defaultRadio = profileEditForm.querySelector('input[name="editGender"][value="Belirtmek İstemiyorum"]');
                    if (defaultRadio) defaultRadio.checked = true;
                }
            }
            validateAgeForEdit(); 
            if (profileEditModal) profileEditModal.style.display = 'block';
        });
    }

    if (closeProfileEditModalBtn) closeProfileEditModalBtn.addEventListener('click', () => profileEditModal.style.display = 'none');
    if (cancelProfileEditBtn) cancelProfileEditBtn.addEventListener('click', () => profileEditModal.style.display = 'none');
    if (logoutBtnPanel) logoutBtnPanel.addEventListener('click', () => { if (typeof performLogout === 'function') performLogout(); });

    window.addEventListener('click', (event) => {
        if (profileEditModal && event.target == profileEditModal) profileEditModal.style.display = 'none';
    });
    
    if (editBirthDateInput) editBirthDateInput.addEventListener('input', validateAgeForEdit);

    if (profileEditForm) {
        profileEditForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!validateAgeForEdit()) return alert('Lütfen geçerli bir doğum tarihi giriniz.');
            
            const updatedData = {
                firstName: editFirstNameInput.value.trim(),
                lastName: editLastNameInput.value.trim(),
                email: editEmailInput.value.trim().toLowerCase(),
                phone: editPhoneInput.value.trim(),
                birthDate: editBirthDateInput.value,
                gender: profileEditForm.querySelector('input[name="editGender"]:checked')?.value || loggedInUser.gender,
            };

            if (Object.values(updatedData).some(val => !val)) return alert('Lütfen tüm zorunlu alanları doldurun.');

            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
            if (updatedData.email !== originalUserEmailForUpdate && registeredUsers.some(user => user.email === updatedData.email)) {
                return alert('Bu e-posta adresi zaten başka bir kullanıcı tarafından kullanılıyor.');
            }

            // Hem localStorage'daki ana kullanıcı listesini hem de anlık oturum bilgisini güncelle
            loggedInUser = { ...loggedInUser, ...updatedData };
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            
            const userIndex = registeredUsers.findIndex(user => user.email === originalUserEmailForUpdate);
            if (userIndex !== -1) {
                registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updatedData };
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            }
            
            if(profileEditModal) profileEditModal.style.display = 'none';
            updateDisplayedProfileInfo(); 
            showToast('Profiliniz başarıyla güncellendi!', 'success');
        });
    }
    
    // --- Sayfa Yüklendiğinde Tüm Fonksiyonları Çağır ---
    updateDisplayedProfileInfo(); 
    displayRecentOrders();
    displayTopFavorites(); // YENİ: Favorileri gösterme fonksiyonu çağrılıyor
});