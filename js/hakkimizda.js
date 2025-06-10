document.addEventListener('DOMContentLoaded', () => {
    const aboutContentContainer = document.getElementById('about-content');
    const policyCardsContainer = document.getElementById('policy-cards');

    // --- hakkimizda.json içeriği buraya gömüldü ---
    const hakkimizdaData = {
        "sections": {
            "Biz Kimiz?": "Lezzet Durağı Kafe, 2010 yılında küçük bir aile işletmesi olarak kuruldu. Amacımız, geleneksel kafe lezzetlerini modern sunumlarla birleştirerek misafirlerimize unutulmaz bir deneyim yaşatmaktır. Her kahvemizi özenle hazırlıyor, her tatlımızı sevgiyle pişiriyoruz.",
            "Misyonumuz": "Yerel üreticilerden tedarik ettiğimiz en kaliteli malzemelerle, geleneksel tariflerimizi modern dokunuşlarla sunarak müşterilerimizin damak tadına hitap eden lezzetler yaratmak ve samimi bir kafe ortamı sunmaktır.",
            "Vizyonumuz": "Şehrin en sevilen kafesi olmak ve her ziyaretinizde sizi memnun etmek için sürekli kendimizi geliştirmek, yenilikçi ürünler sunmak ve toplulukla güçlü bağlar kurmaktır."
        },
        "qualityPolicy": [
            {
                "title": "Taze Malzemeler",
                "description": "Günlük taze malzemelerle hazırlanan, mevsiminde ve en kaliteli ürünleri kullanırız.",
                "icon": "fas fa-leaf"
            },
            {
                "title": "Sağlıklı Beslenme",
                "description": "Katkı maddesi içermeyen doğal ürünler tercih eder, sağlıklı beslenme prensiplerine uyarız.",
                "icon": "fas fa-heart"
            },
            {
                "title": "Usta Eller",
                "description": "Alanında uzman şeflerimizin ve baristalarımızın elinden çıkan özenli lezzetler sunarız.",
                "icon": "fas fa-medal"
            }
        ]
    };
    // --- JSON içeriği sonu ---

    try {
        if (aboutContentContainer) {
            const aboutSections = ['Biz Kimiz?', 'Misyonumuz', 'Vizyonumuz'];
            aboutSections.forEach(sectionTitle => {
                if (hakkimizdaData.sections[sectionTitle]) {
                    const sectionHtml = document.createElement('div');
                    sectionHtml.innerHTML = `
                        <h2>${sectionTitle}</h2>
                        <p>${hakkimizdaData.sections[sectionTitle]}</p>
                    `;
                    aboutContentContainer.appendChild(sectionHtml);
                }
            });
        }

        if (policyCardsContainer) {
            if (hakkimizdaData.qualityPolicy) {
                hakkimizdaData.qualityPolicy.forEach(policy => {
                    const policyCard = document.createElement('div');
                    policyCard.classList.add('policy-card');
                    policyCard.innerHTML = `
                        <i class="${policy.icon}"></i>
                        <h3>${policy.title}</h3>
                        <p>${policy.description}</p>
                    `;
                    policyCardsContainer.appendChild(policyCard);
                });
            }
        }
    } catch (error) {
        console.error('Error processing hakkimizda content:', error);
    }
});