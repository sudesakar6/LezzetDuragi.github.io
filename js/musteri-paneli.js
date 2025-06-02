document.addEventListener('DOMContentLoaded', () => {
    const customerWelcomeMessage = document.getElementById('customer-welcome-message');
    
    // Hesap Bilgileri Gösterim Alanları
    const displayFullname = document.getElementById('display-fullname');
    const displayEmail = document.getElementById('display-email');
    const displayPhone = document.getElementById('display-phone');
    const displayBirthdate = document.getElementById('display-birthdate');
    const displayGender = document.getElementById('display-gender');

    const openOrderHistoryBtn = document.getElementById('open-order-history'); 
    // const openMenuModalBtnCustomerPanel2 = document.getElementById('open-menu-modal-customer-panel-2'); // Bu değişken ve ilgili listener kaldırıldı

    // Profil Düzenleme Modal Elementleri
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

    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let originalUserEmailForUpdate = ''; 

    function updateDisplayedProfileInfo() {
        if (loggedInUser) {
            if (customerWelcomeMessage) {
                customerWelcomeMessage.textContent = `Hoş geldiniz, ${loggedInUser.firstName} ${loggedInUser.lastName}!`;
            }
            if (displayFullname) displayFullname.textContent = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
            if (displayEmail) displayEmail.textContent = loggedInUser.email;
            if (displayPhone) displayPhone.textContent = loggedInUser.phone;
            if (displayBirthdate) displayBirthdate.textContent = loggedInUser.birthDate ? new Date(loggedInUser.birthDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş';
            if (displayGender) displayGender.textContent = loggedInUser.gender || 'Belirtilmemiş';

            if (typeof updateAuthButtonsInHeader === 'function') {
                updateAuthButtonsInHeader();
            }
        }
    }

    if (typeof updateAuthButtonsInHeader === 'function') {
        updateAuthButtonsInHeader();
    }
    
    if (!loggedInUser) {
        const currentPage = window.location.pathname.split("/").pop();
        if (currentPage === 'musteri-paneli.html') {
            alert('Bu sayfayı görüntülemek için müşteri girişi yapmalısınız!');
            window.location.href = 'giris-yap.html';
        }
        return; 
    }
    
    updateDisplayedProfileInfo(); 

    const lastOrdersList = document.getElementById('last-orders-list');
    const customerOrderHistory = JSON.parse(localStorage.getItem('customerOrderHistory')) || [];
    if (lastOrdersList && customerOrderHistory) {
        let ordersToDisplay = [];
        // Filtreleme "Son Siparişleriniz" için güncellenmişti (sadece kullanıcının siparişleri)
        if (loggedInUser && loggedInUser.email) {
            ordersToDisplay = customerOrderHistory.filter(order => order.customerEmail === loggedInUser.email);
        }

        if (ordersToDisplay.length > 0) {
            const recentOrders = ordersToDisplay.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);
            lastOrdersList.innerHTML = recentOrders.map(order => `
                <li>
                    <strong>Sipariş ${order.id.split('-')[0]}</strong> (${order.displayTime.split(' ')[1].substring(0, 5)}) - ${order.total.toFixed(2)} TL
                    <br>Durum: <span class="order-status ${order.status.replace(/\s/g, '')}">${order.status}</span>
                </li>
            `).join('');
        } else {
            lastOrdersList.innerHTML = '<li>Henüz siparişiniz bulunmamaktadır.</li>';
        }
    } else if (lastOrdersList) { 
         lastOrdersList.innerHTML = '<li>Henüz siparişiniz bulunmamaktadır.</li>';
    }
    
    const favoritesList = document.getElementById('favorites-list');
    if (favoritesList) {
        const sampleFavorites = [ { name: "Cheesecake" }, { name: "Espresso" } ]; 
        if (sampleFavorites.length > 0) {
            favoritesList.innerHTML = sampleFavorites.map(fav => `<li>${fav.name}</li>`).join('');
        } else {
            favoritesList.innerHTML = '<li>Henüz favori ürününüz bulunmamaktadır.</li>';
        }
    }
    
    if (editProfileBtn && profileEditModal) {
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
                for (const radio of genderRadios) {
                    radio.checked = (radio.value === genderValue);
                }
                const isAnyChecked = Array.from(genderRadios).some(radio => radio.checked);
                if (!isAnyChecked && genderRadios.length > 0) {
                     const preferNotToSayRadio = profileEditForm.querySelector('input[name="editGender"][value="Belirtmek İstemiyorum"]');
                     if (preferNotToSayRadio) preferNotToSayRadio.checked = true;
                }
            }
            validateAgeForEdit(); 
            profileEditModal.style.display = 'block';
        });
    }

    if (closeProfileEditModalBtn && profileEditModal) {
        closeProfileEditModalBtn.addEventListener('click', () => {
            profileEditModal.style.display = 'none';
        });
    }
    if (cancelProfileEditBtn && profileEditModal) {
        cancelProfileEditBtn.addEventListener('click', () => {
            profileEditModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (profileEditModal && event.target == profileEditModal) {
            profileEditModal.style.display = 'none';
        }
        const menuModal = document.getElementById('menu-modal'); 
        if (menuModal && event.target == menuModal) {
            if (typeof closeMenuModal === 'function') closeMenuModal();
        }
    });
    
    if (editBirthDateInput) {
        editBirthDateInput.addEventListener('input', validateAgeForEdit);
    }

    function validateAgeForEdit() {
        if (!editBirthDateInput || !editBirthDateInput.value) {
            if(editAgeWarning) editAgeWarning.textContent = '';
            return true; 
        }
        const birthDate = new Date(editBirthDateInput.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            if(editAgeWarning) editAgeWarning.textContent = '18 yaşından küçük olmalısınız.';
            return false;
        } else {
            if(editAgeWarning) editAgeWarning.textContent = '';
            return true;
        }
    }

    if (profileEditForm) {
        profileEditForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!validateAgeForEdit()) {
                alert('Lütfen geçerli bir doğum tarihi giriniz (18 yaşından büyük olmalısınız).');
                if (editBirthDateInput) editBirthDateInput.focus();
                return;
            }
            const updatedFirstName = editFirstNameInput.value.trim();
            const updatedLastName = editLastNameInput.value.trim();
            const updatedEmail = editEmailInput.value.trim().toLowerCase();
            const updatedPhone = editPhoneInput.value.trim();
            const updatedBirthDate = editBirthDateInput.value;
            const selectedGenderRadio = profileEditForm.querySelector('input[name="editGender"]:checked');
            const updatedGender = selectedGenderRadio ? selectedGenderRadio.value : loggedInUser.gender;
            if (!updatedFirstName || !updatedLastName || !updatedEmail || !updatedPhone || !updatedBirthDate) {
                alert('Lütfen tüm zorunlu alanları (*) doldurun.');
                return;
            }
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
            if (updatedEmail !== originalUserEmailForUpdate && registeredUsers.some(user => user.email === updatedEmail)) {
                alert('Bu e-posta adresi zaten başka bir kullanıcı tarafından kullanılıyor.');
                if (editEmailInput) editEmailInput.focus();
                return;
            }
            loggedInUser.firstName = updatedFirstName;
            loggedInUser.lastName = updatedLastName;
            loggedInUser.email = updatedEmail; 
            loggedInUser.phone = updatedPhone;
            loggedInUser.birthDate = updatedBirthDate;
            loggedInUser.gender = updatedGender;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            const userIndexInRegisteredUsers = registeredUsers.findIndex(user => user.email === originalUserEmailForUpdate);
            if (userIndexInRegisteredUsers !== -1) {
                registeredUsers[userIndexInRegisteredUsers] = { 
                    ...registeredUsers[userIndexInRegisteredUsers], 
                    firstName: updatedFirstName,
                    lastName: updatedLastName,
                    email: updatedEmail, 
                    phone: updatedPhone,
                    birthDate: updatedBirthDate,
                    gender: updatedGender
                };
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            }
            alert('Profil bilgileriniz başarıyla güncellendi!');
            if(profileEditModal) profileEditModal.style.display = 'none';
            updateDisplayedProfileInfo(); 
        });
    }
    
    if (openOrderHistoryBtn) {
        openOrderHistoryBtn.addEventListener('click', (event) => {
            event.preventDefault(); 
            window.location.href = 'siparislerim.html'; 
        });
    }

    
});