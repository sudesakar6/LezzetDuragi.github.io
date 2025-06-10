document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const loginForms = document.querySelectorAll('.login-form-container');
    const customerLoginForm = document.getElementById('customer-login-form');
    const personnelLoginForm = document.getElementById('personnel-login-form');

    // Tab geçişlerini yönet
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            loginForms.forEach(form => form.classList.remove('active'));
            button.classList.add('active');
            const targetTab = button.dataset.tab;
            document.getElementById(`${targetTab}-login`).classList.add('active');
        });
    });

    // Müşteri Girişi Formu Gönderimi
    customerLoginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('customerEmail').value;
        const password = document.getElementById('customerPassword').value;

        // --- MÜŞTERİ GİRİŞ MANTIĞI ---
        // Önce e-postanın varlığını kontrol et, sonra şifreyi doğrula.
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const user = registeredUsers.find(u => u.email === email);

        if (!user) {
            // E-posta sistemde hiç yoksa (veya silinmişse)...
            alert('Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı. Lütfen kaydolun.');
        } else if (user.password === password) {
            // E-posta var ve şifre doğruysa (Başarılı Giriş)
            // Örnek kredi kartı bilgisi ekle (SADECE SİMÜLASYON AMAÇLIDIR)
            if (!user.creditCard) {
                user.creditCard = "1234567890123456";
                // Güncellenmiş kullanıcı bilgisini registeredUsers'a geri yaz
                const userIndex = registeredUsers.findIndex(u => u.email === email);
                if (userIndex !== -1) {
                    registeredUsers[userIndex] = user;
                    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                }
            }

            alert('Müşteri girişi başarılı! Hoş geldiniz, ' + user.firstName);
            localStorage.setItem('loggedInUser', JSON.stringify(user)); 

            if (typeof updateAuthButtonsInHeader === 'function') {
                updateAuthButtonsInHeader();
            }

            window.location.href = 'musteri-paneli.html';
        } else {
            // E-posta var ama şifre yanlışsa...
            alert('Şifre hatalı. Lütfen tekrar deneyin.');
        }
    });

    // Personel Girişi Formu Gönderimi
    personnelLoginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fullName = document.getElementById('personnelFullName').value;
        const password = document.getElementById('personnelPassword').value;

        const personnelData = {
            "ahmet": { "password": "ahmet123", "fullName": "Ahmet Yılmaz" },
            "ayse": { "password": "ayse123", "fullName": "Ayşe Demir" }
        };

        let loggedIn = false;
        let loggedInPersonnel = null;

        for (const username in personnelData) {
            if (personnelData[username].fullName === fullName && personnelData[username].password === password) {
                loggedIn = true;
                loggedInPersonnel = { username: username, fullName: fullName };
                break;
            }
        }

        if (loggedIn) {
            alert('Personel girişi başarılı! Hoş geldiniz, ' + loggedInPersonnel.fullName);
            localStorage.setItem('loggedInPersonnel', JSON.stringify(loggedInPersonnel));
            window.location.href = 'personel-paneli.html';
        } else {
            alert('Geçersiz Ad Soyad veya şifre.');
        }
    });
});