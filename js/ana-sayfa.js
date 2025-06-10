// js/ana-sayfa.js (Sadeleştirilmiş Nihai Hali)

document.addEventListener('DOMContentLoaded', () => {
    const popularItemsGrid = document.getElementById('popular-items-grid');
    const openSelfServiceModalBtn = document.getElementById('open-self-service-modal');

    // "Çok Sevilenler" olarak gösterilecek ürünlerin adları
    const popularItemNames = [
        "Filtre Kahve",
        "Latte",
        "Cheesecake (Limonlu)",
        "Kruvasan",
        "Brownie",
        "Türk Kahvesi"
    ];

    function displayPopularItems() {
        if (!popularItemsGrid) {
            console.warn("Popüler ürünler için '.item-grid' elementi bulunamadı.");
            return;
        }
        
        popularItemsGrid.innerHTML = ''; 
        const currentMenu = getActualGlobalMenuData();
        const itemsToDisplay = [];

        if (currentMenu && currentMenu.categories) {
            popularItemNames.forEach(nameToFind => {
                let itemFound = false;
                for (const categoryKey in currentMenu.categories) {
                    const foundItem = currentMenu.categories[categoryKey].find(item => item.name === nameToFind);
                    if (foundItem) {
                        itemsToDisplay.push(foundItem);
                        itemFound = true;
                        break; 
                    }
                }
                if (!itemFound) {
                    console.warn(`Popüler ürün listesindeki "${nameToFind}" menüde bulunamadı.`);
                }
            });
        }

        if (itemsToDisplay.length > 0) {
            itemsToDisplay.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.classList.add('item-card'); 
                itemCard.innerHTML = `
                    <img src="../images/${item.image}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <p class="price">${item.price.toFixed(2)} TL</p>
                    <div class="item-card-controls" data-name="${item.name}">
                        ${generateCartControlsHTML(item)} 
                    </div>
                `;
                popularItemsGrid.appendChild(itemCard);
            });
        } else {
            popularItemsGrid.innerHTML = "<p>Gösterilecek popüler ürün bulunmamaktadır.</p>";
        }
    }

    displayPopularItems();

    if (openSelfServiceModalBtn) {
        openSelfServiceModalBtn.addEventListener('click', (event) => {
            event.preventDefault();
            if (typeof openSelfServiceModal === 'function') {
                openSelfServiceModal();
            } else {
                console.error("openSelfServiceModal fonksiyonu main.js'de bulunamadı.");
            }
        });
    }
});