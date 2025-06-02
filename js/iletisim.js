document.addEventListener('DOMContentLoaded', () => {
    const contactInfoContainer = document.getElementById('contact-info');
    const contactForm = document.getElementById('contact-form');

    // --- iletisim.json içeriği buraya gömüldü ---
    const contactData = {
        "address": "Örnek Mahallesi, Lezzet Sokak No: 123\nBeşiktaş / İstanbul",
        "phone": "+90 555 555 55 56",
        "email": "info@lezzetduragi.com",
        "workingHours": {
            "weekdays": "08:00 - 23:00",
            "weekends": "09:00 - 24:00"
        },
        "socialMedia": [
            { "platform": "Instagram", "url": "https://www.instagram.com", "icon": "fab fa-instagram" },
            { "platform": "X (Twitter)", "url": "https://twitter.com", "icon": "fab fa-twitter" },
            { "platform": "Facebook", "url": "https://www.facebook.com", "icon": "fab fa-facebook-f" }
        ]
    };
    // --- JSON içeriği sonu ---

    try {
        if (contactInfoContainer) {
            const addressItem = document.createElement('div');
            addressItem.classList.add('info-item');
            addressItem.innerHTML = `<i class="fas fa-map-marker-alt"></i><div><h3>Adres</h3><p>${contactData.address.replace(/\n/g, '<br>')}</p></div>`;
            contactInfoContainer.appendChild(addressItem);

            const phoneItem = document.createElement('div');
            phoneItem.classList.add('info-item');
            phoneItem.innerHTML = `<i class="fas fa-phone"></i><div><h3>Telefon</h3><p>${contactData.phone}</p></div>`;
            contactInfoContainer.appendChild(phoneItem);

            const emailItem = document.createElement('div');
            emailItem.classList.add('info-item');
            emailItem.innerHTML = `<i class="fas fa-envelope"></i><div><h3>E-posta</h3><p>${contactData.email}</p></div>`;
            contactInfoContainer.appendChild(emailItem);

            const hoursItem = document.createElement('div');
            hoursItem.classList.add('info-item');
            hoursItem.innerHTML = `<i class="fas fa-clock"></i><div><h3>Çalışma Saatleri</h3><p><strong>Pazartesi - Cuma:</strong> ${contactData.workingHours.weekdays}</p><p><strong>Cumartesi - Pazar:</strong> ${contactData.workingHours.weekends}</p></div>`;
            contactInfoContainer.appendChild(hoursItem);

            const socialMediaDiv = document.createElement('div');
            socialMediaDiv.classList.add('social-media');
            contactData.socialMedia.forEach(social => {
                const socialLink = document.createElement('a');
                socialLink.href = social.url;
                socialLink.target = "_blank";
                socialLink.setAttribute('aria-label', social.platform);
                socialLink.innerHTML = `<i class="${social.icon}"></i>`;
                socialMediaDiv.appendChild(socialLink);
            });
            contactInfoContainer.appendChild(socialMediaDiv);
        }
    } catch (error) {
        console.error('Error processing contact info:', error);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => { 
            event.preventDefault(); 
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toLocaleString() 
            };
            try {
                let reports = JSON.parse(localStorage.getItem('personnelReports')) || [];
                reports.push(formData);
                localStorage.setItem('personnelReports', JSON.stringify(reports));
                alert('Mesajınız başarıyla gönderildi! Teşekkür ederiz.');
                contactForm.reset();
            } catch (error) {
                console.error('Mesaj gönderilirken bir hata oluştu:', error);
                alert('Mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
            }
        });
    }
});