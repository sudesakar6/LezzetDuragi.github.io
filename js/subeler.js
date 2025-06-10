document.addEventListener('DOMContentLoaded', () => {
    const branchListContainer = document.getElementById('branch-list');

    // --- subeler.json içeriği buraya gömüldü ---
    const branchesData = {
        "branches": [
            {
                "id": 1, "name": "Beşiktaş Şubesi",
                "address": "Lezzet Mahallesi, Lezziz Caddesi No: 42, Beşiktaş, İstanbul",
                "workingHours": { "weekdays": "08:00 - 23:00", "weekends": "09:00 - 24:00" },
                "phone": "+90 333 333 33 33"
            },
            {
                "id": 2, "name": "Kadıköy Şubesi",
                "address": "Lezzet Mahallesi, Lezziz Caddesi No: 77, Kadıköy, İstanbul",
                "workingHours": { "weekdays": "08:00 - 23:00", "weekends": "09:00 - 24:00" },
                "phone": "+90 555 555 55 55"
            },
            {
                "id": 3, "name": "Şişli Şubesi",
                "address": "Lezzet Mahallesi, Lezziz Caddesi No: 15, Şişli, İstanbul",
                "workingHours": { "weekdays": "08:00 - 23:00", "weekends": "09:00 - 24:00" },
                "phone": "+90 777 777 77 77"
            }
        ]
    };
    // --- JSON içeriği sonu ---

    try {
        if (branchListContainer) {
            if (branchesData.branches && branchesData.branches.length > 0) {
                branchesData.branches.forEach(branch => {
                    const branchCard = document.createElement('div');
                    branchCard.classList.add('branch-card');
                    branchCard.innerHTML = `
                        <h2>${branch.name}</h2>
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div><p>${branch.address.replace(/\n/g, '<br>')}</p></div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <p><strong>Pazartesi - Cuma:</strong> ${branch.workingHours.weekdays}</p>
                                <p><strong>Cumartesi - Pazar:</strong> ${branch.workingHours.weekends}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-phone"></i>
                            <div><p>${branch.phone}</p></div>
                        </div>
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}" target="_blank" class="map-link">Haritada Göster</a>
                    `;
                    branchListContainer.appendChild(branchCard);
                });
            } else {
                branchListContainer.innerHTML = "<p>Şube bilgisi bulunamadı.</p>";
            }
        }
    } catch (error) {
        console.error('Error processing branches content:', error);
    }
});