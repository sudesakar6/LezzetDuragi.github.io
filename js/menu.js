document.addEventListener('DOMContentLoaded', () => {
    const menuCategoriesContainer = document.getElementById('menu-categories');

    // --- menu.json içeriği buraya gömüldü ---
    const menuData = {
        "categories": {
            "Sıcak İçecekler": [
                { "name": "Filtre Kahve", "image": "filtre-kahve.jpg", "price": 45.00 },
                { "name": "Latte", "image": "latte.jpg", "price": 50.00 },
                { "name": "Cappuccino", "image": "cappuccino.jpg", "price": 50.00 },
                { "name": "Türk Kahvesi", "image": "turk-kahvesi.jpg", "price": 40.00 },
                { "name": "Americano", "image": "americano.jpg", "price": 48.00 },
                { "name": "Çay (Bardak)", "image": "cay.jpg", "price": 20.00 },
                { "name": "Sıcak Çikolata", "image": "sicak-cikolata.jpg", "price": 55.00 }
            ],
            "Soğuk İçecekler": [
                { "name": "Ice Latte", "image": "ice-latte.jpg", "price": 55.00 },
                { "name": "Cold Brew", "image": "cold-brew.jpg", "price": 52.00 },
                { "name": "Limonata (Ev Yapımı)", "image": "limonata.jpg", "price": 35.00 },
                { "name": "Milkshake (Çikolatalı)", "image": "milkshake-cikolatali.jpg", "price": 60.00 },
                { "name": "Meyve Suyu (Portakal)", "image": "meyve-suyu-portakal.jpg", "price": 30.00 }
            ],
            "Atıştırmalıklar": [
                { "name": "Kruvasan", "image": "kruvasan.jpg", "price": 30.00 },
                { "name": "Simit", "image": "simit.jpg", "price": 25.00 },
                { "name": "Poğaça", "image": "pogaca.jpg", "price": 25.00 },
                { "name": "Tost (Kaşarlı)", "image": "tost.jpg", "price": 40.00 },
                { "name": "Sandviç (Ton Balıklı)", "image": "sandvic-ton-balikli.jpg", "price": 65.00 }
            ],
            "Tatlılar": [
                { "name": "Cheesecake (Limonlu)", "image": "cheesecake.jpg", "price": 60.00 },
                { "name": "Brownie", "image": "brownie.jpg", "price": 50.00 },
                { "name": "Cookie (Çikolatalı)", "image": "cookie.jpg", "price": 30.00 },
                { "name": "Tiramisu", "image": "tiramisu.jpg", "price": 65.00 }
            ]
        }
    };
    // --- JSON içeriği sonu ---

    try {
        if (menuCategoriesContainer) {
            if (menuData && menuData.categories) {
                for (const categoryName in menuData.categories) {
                    const categorySection = document.createElement('div');
                    categorySection.classList.add('menu-category');

                    const categoryTitle = document.createElement('h2');
                    categoryTitle.textContent = categoryName;
                    categorySection.appendChild(categoryTitle);

                    const itemsGrid = document.createElement('div');
                    itemsGrid.classList.add('menu-items-grid');

                    menuData.categories[categoryName].forEach(item => {
                        const menuItemCard = document.createElement('div');
                        menuItemCard.classList.add('menu-item-card');
                        menuItemCard.innerHTML = `
                            <img src="../images/${item.image}" alt="${item.name}">
                            <h4>${item.name}</h4>
                            <p class="price">${item.price.toFixed(2)} TL</p>
                            <button class="add-to-cart-btn" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}" data-cart-type="onlineCart">Sepete Ekle</button>
                        `;
                        itemsGrid.appendChild(menuItemCard);
                    });
                    categorySection.appendChild(itemsGrid);
                    menuCategoriesContainer.appendChild(categorySection);
                }

                document.querySelectorAll('#menu-categories .add-to-cart-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const name = event.target.dataset.name;
                        const price = parseFloat(event.target.dataset.price);
                        const image = event.target.dataset.image;
                        const cartType = event.target.dataset.cartType;
                        
                        if (typeof addToCart === 'function') { 
                            addToCart({ name, price, image, quantity: 1 }, cartType);
                            alert(`${name} online sepetine eklendi!`);
                        } else {
                            console.error("addToCart fonksiyonu main.js'de bulunamadı.");
                        }
                    });
                });
            } else {
                menuCategoriesContainer.innerHTML = "<p>Menü içeriği bulunamadı.</p>";
            }
        }
    } catch (error) {
        console.error('Error processing menu items:', error);
        if(menuCategoriesContainer) menuCategoriesContainer.innerHTML = "<p>Menü işlenirken bir hata oluştu.</p>";
    }
});