document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const birthDateInput = document.getElementById('birthDate');
    const ageWarning = document.getElementById('age-warning');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('password-strength');
    const passwordMatchWarning = document.getElementById('password-match-warning');
    const termsCheckbox = document.getElementById('terms');

    // Doğum tarihi kontrolü (18 yaş sınırı)
    birthDateInput.addEventListener('change', () => {
        const birthDate = new Date(birthDateInput.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            // Yaş günü henüz gelmediyse 1 yaş düşür
            age--;
        }

        if (age < 18) {
            ageWarning.textContent = 'Kayıt olmak için 18 yaşından büyük olmalısınız.';
            birthDateInput.setCustomValidity('Yaş sınırı'); // Formun submit olmasını engelle
        } else {
            ageWarning.textContent = '';
            birthDateInput.setCustomValidity(''); // Validasyonu temizle
        }
    });

    // Şifre gücü kontrolü (Basit)
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        let strength = 'Zayıf';
        let color = 'red';

        if (password.length >= 8) {
            strength = 'Orta';
            color = 'orange';
        }
        if (password.length >= 10 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
            strength = 'Güçlü';
            color = 'green';
        }
        if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()]/.test(password)) {
            strength = 'Çok Güçlü';
            color = 'darkgreen';
        }

        passwordStrength.textContent = `Şifre Gücü: ${strength}`;
        passwordStrength.style.color = color;
    });

    // Şifre tekrarı kontrolü
    confirmPasswordInput.addEventListener('input', () => {
        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordMatchWarning.textContent = 'Şifreler uyuşmuyor!';
            confirmPasswordInput.setCustomValidity('Şifreler uyuşmuyor');
        } else {
            passwordMatchWarning.textContent = '';
            confirmPasswordInput.setCustomValidity('');
        }
    });

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Tüm validasyonları tekrar kontrol et
        if (ageWarning.textContent || passwordMatchWarning.textContent || !termsCheckbox.checked) {
            alert('Lütfen tüm alanları doğru ve eksiksiz doldurduğunuzdan emin olun ve kullanım koşullarını kabul edin.');
            return;
        }

        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            birthDate: document.getElementById('birthDate').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            password: document.getElementById('password').value, // Şifre backend'e hashlenerek gönderilmeli!
            registrationDate: new Date().toISOString() // Kayıt tarihi
        };


        try {
            let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

            // E-posta kontrolü - aynı e-posta ile başka bir kullanıcı var mı?
            const existingUser = users.find(user => user.email === formData.email);
            if (existingUser) {
                alert('Bu e-posta adresi zaten kayıtlı. Lütfen başka bir e-posta kullanın veya giriş yapın.');
                return;
            }

            users.push(formData); // Gerçekte şifre hashlenmiş haliyle kaydedilmeli
            localStorage.setItem('registeredUsers', JSON.stringify(users));

            
            registerForm.reset(); // Formu temizle
            ageWarning.textContent = ''; // Uyarıları temizle
            passwordStrength.textContent = '';
            passwordMatchWarning.textContent = '';
            
            // Kayıt başarılı olduktan sonra giriş sayfasına yönlendirme
            window.location.href = 'giris-yap.html'; 

        } catch (error) {
            console.error('Kayıt işlemi sırasında bir hata oluştu:', error);
            alert('Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        }
    });
});