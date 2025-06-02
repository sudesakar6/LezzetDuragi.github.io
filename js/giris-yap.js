document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const loginForms = document.querySelectorAll('.login-form-container');
    const customerLoginForm = document.getElementById('customer-login-form');
    const personnelLoginForm = document.getElementById('personnel-login-form');

    // Tab geçişlerini yönet
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Tüm butonlardan active sınıfını kaldır
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Tüm formları gizle
            loginForms.forEach(form => form.classList.remove('active'));

            // Tıklanan butona active sınıfını ekle
            button.classList.add('active');
            // İlgili formu göster
            const targetTab = button.dataset.tab;
            document.getElementById(`${targetTab}-login`).classList.add('active');
        });
    });

    // Müşteri Girişi Formu Gönderimi
    customerLoginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('customerEmail').value;
        const password = document.getElementById('customerPassword').value;

        // localStorage'dan kayıtlı kullanıcıları al
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        // Kullanıcıyı bul
        const userIndex = registeredUsers.findIndex(u => u.email === email && u.password === password); // Gerçek projede şifre karşılaştırma hashlenmiş olmalı!

        if (userIndex !== -1) {
            let user = registeredUsers[userIndex];

            // Örnek kredi kartı bilgisi ekle (SADECE SİMÜLASYON AMAÇLIDIR, GERÇEKTE YAPILMAZ)
            // Eğer yoksa veya daha önce eklenmediyse ekle
            if (!user.creditCard) {
                // Basit bir 16 haneli örnek numara
                user.creditCard = "1234567890123456";
            }
            // Güncellenmiş kullanıcı bilgisini registeredUsers'a geri yaz
            registeredUsers[userIndex] = user;
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));


            alert('Müşteri girişi başarılı! Hoş geldiniz, ' + user.firstName);
            localStorage.setItem('loggedInUser', JSON.stringify(user)); // Kullanıcı bilgisini sakla
            
            // Header'daki butonları güncellemek için main.js'deki fonksiyonu çağır
            // Bu fonksiyon, HTML'deki script etiketlerinin sırasına göre global olarak erişilebilir olmalı
            if (typeof updateAuthButtonsInHeader === 'function') {
                updateAuthButtonsInHeader();
            }

            window.location.href = 'musteri-paneli.html'; // Müşteri panel sayfasına yönlendir
        } else {
            alert('Geçersiz e-posta veya şifre.');
        }
    });

    // Personel Girişi Formu Gönderimi
    personnelLoginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fullName = document.getElementById('personnelFullName').value;
        const password = document.getElementById('personnelPassword').value;

        // Personel bilgilerini JSON'dan veya sabit olarak al (şimdilik basit bir örnek)
        // Gerçek projede personel bilgileri güvenli bir veritabanında saklanmalıdır.
        const personnelData = {
            "admin": { "password": "admin123", "fullName": "Admin Adı Soyadı" },
            "personel1": { "password": "personel123", "fullName": "Personel Bir" },
            "personel2": { "password": "personel456", "fullName": "Personel İki" } // Önceki yanıtlarda eklediğimiz personel
        };

        let loggedIn = false;
        let loggedInPersonnel = null;

        // Basit bir kontrol (gerçek projede bu daha karmaşık ve güvenli olmalı)
        for (const username in personnelData) {
            if (personnelData[username].fullName === fullName && personnelData[username].password === password) {
                loggedIn = true;
                loggedInPersonnel = { username: username, fullName: fullName };
                break;
            }
        }

        if (loggedIn) {
            alert('Personel girişi başarılı! Hoş geldiniz, ' + loggedInPersonnel.fullName);
            localStorage.setItem('loggedInPersonnel', JSON.stringify(loggedInPersonnel)); // Personel bilgisini sakla
            window.location.href = 'personel-paneli.html'; // Personel panel sayfasına yönlendir
        } else {
            alert('Geçersiz Ad Soyad veya şifre.');
        }
    });
});