// js/menu.js (Sadeleştirilmiş Nihai Hali)

document.addEventListener('DOMContentLoaded', () => {
    const menuCategoriesContainer = document.getElementById('menu-categories');
    const filterButtonsContainer = document.getElementById('menu-filter-buttons');

    function filterMenu(category) {
        const allCategories = menuCategoriesContainer.querySelectorAll('.menu-category');
        allCategories.forEach(cat => {
            if (category === 'Tümü' || cat.querySelector('h2').textContent === category) {
                cat.style.display = 'block';
            } else {
                cat.style.display = 'none';
            }
        });
    }

    // Global fonksiyondan menü verisini al
    const menuDataToRender = getActualGlobalMenuData(); 

    try {
        if (menuCategoriesContainer && filterButtonsContainer) {
            // Filtre Butonlarını Oluştur
            filterButtonsContainer.innerHTML = ''; 
            const allButton = document.createElement('button');
            allButton.className = 'filter-btn active'; 
            allButton.textContent = 'Tümü';
            allButton.dataset.category = 'Tümü';
            filterButtonsContainer.appendChild(allButton);

            const categories = Object.keys(menuDataToRender.categories);
            categories.forEach(category => {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.textContent = category;
                button.dataset.category = category;
                filterButtonsContainer.appendChild(button);
            });

            // Butonlara Olay Dinleyicileri Ekle
            filterButtonsContainer.querySelectorAll('.filter-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    filterButtonsContainer.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');
                    filterMenu(e.target.dataset.category);
                });
            });

            // Menü İçeriğini Oluştur
            menuCategoriesContainer.innerHTML = ''; 
            for (const categoryName in menuDataToRender.categories) {
                const categorySection = document.createElement('div');
                categorySection.classList.add('menu-category');
                categorySection.dataset.category = categoryName;

                const categoryTitle = document.createElement('h2');
                categoryTitle.textContent = categoryName;
                categorySection.appendChild(categoryTitle);

                const itemsGrid = document.createElement('div');
                itemsGrid.classList.add('menu-items-grid');

                menuDataToRender.categories[categoryName].forEach(item => {
                    const menuItemCard = document.createElement('div');
                    menuItemCard.classList.add('menu-item-card');
                    menuItemCard.innerHTML = `
                        <img src="../images/${item.image}" alt="${item.name}">
                        <h4>${item.name}</h4>
                        <p class="price">${item.price.toFixed(2)} TL</p>
                        <div class="item-card-controls" data-name="${item.name}">
                           ${generateCartControlsHTML(item)}
                        </div>
                    `;
                    itemsGrid.appendChild(menuItemCard);
                });
                categorySection.appendChild(itemsGrid);
                menuCategoriesContainer.appendChild(categorySection);
            }
        }
    } catch (error) {
        console.error('Error processing menu items:', error);
        if(menuCategoriesContainer) {
            menuCategoriesContainer.innerHTML = "<p>Menü işlenirken bir hata oluştu.</p>";
        }
    }
});