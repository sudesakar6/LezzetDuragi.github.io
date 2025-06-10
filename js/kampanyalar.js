document.addEventListener('DOMContentLoaded', () => {
    const campaignListContainer = document.getElementById('campaign-list');

    // --- kampanyalar.json içeriği buraya gömüldü ---
    const campaignsData = {
        "campaigns": [
            {
                "id": 1, "title": "2 Kahve Al 1 Kurabiye Öde", "image": "2al1ode.jpg",
                "startDate": "01.06.2025", "endDate": "30.07.2025",
                "description": "Seçili kahvelerde 2 alana 1 kurabiye bedava kampanyası! Kahvelerinizin yanında tatlı keyfi sizleri bekliyor.",
                "includes": ["Filtre Kahve", "Latte", "Cappuccino", "Americano", "Çikolatalı Kurabiye", "Yulaflı Kurabiye"]
            },
            {
                "id": 2, "title": "Anneler Günü Özel", "image": "annelergunu.jpg",
                "startDate": "10.05.2025", "endDate": "12.05.2025",
                "description": "Anneler gününde tüm annelere %20 indirim! Annenizle birlikte geldiğinizde geçerlidir. Bu özel günü bizimle kutlayın."
            },
            {
                "id": 3, "title": "Öğrenci İndirimi", "image": "ogrenci.jpg",
                "startDate": "01.09.2025", "endDate": "30.06.2026",
                "description": "Tüm öğrencilere %15 indirim! Geçerli öğrenci kimliği göstermeniz gerekmektedir. Ders çalışırken veya mola verirken yanınızdayız."
            },
            {
                "id": 4, "title": "Sevgililer Gününe Özel Çift Kahvesi", "image": "sevgililergunu.jpg",
                "startDate": "14.02.2026", "endDate": "14.02.2026",
                "description": "Sevgililer gününe özel, çift kahvesi alımlarında ikinci kahve %50 indirimli! Sevdiğinizle kahve keyfinizi ikiye katlayın."
            }
        ]
    };
    // --- JSON içeriği sonu ---

    try {
        if (campaignListContainer) {
            if (campaignsData.campaigns && campaignsData.campaigns.length > 0) {
                campaignsData.campaigns.forEach(campaign => {
                    const campaignCard = document.createElement('div');
                    campaignCard.classList.add('campaign-card');
                    let detailsHtml = `<p>${campaign.description}</p>`;
                    if (campaign.includes && campaign.includes.length > 0) {
                        detailsHtml += `<p>Kampanyaya Dahil Ürünler:</p><ul>${campaign.includes.map(item => `<li>${item}</li>`).join('')}</ul>`;
                    }
                    campaignCard.innerHTML = `
                        <div class="campaign-image">
                            <img src="../images/${campaign.image}" alt="${campaign.title}">
                        </div>
                        <div class="campaign-details">
                            <h2>${campaign.title}</h2>
                            <span class="date-range">${campaign.startDate} - ${campaign.endDate}</span>
                            ${detailsHtml}
                        </div>
                    `;
                    campaignListContainer.appendChild(campaignCard);
                });
            } else {
                 campaignListContainer.innerHTML = "<p>Şu anda aktif bir kampanya bulunmamaktadır.</p>";
            }
        }
    } catch (error) {
        console.error('Error processing campaigns content:', error);
    }
});