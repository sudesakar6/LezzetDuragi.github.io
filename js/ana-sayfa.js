document.addEventListener('DOMContentLoaded', () => {
    const popularItemsGrid = document.getElementById('popular-items-grid');
    const openSelfServiceModalBtn = document.getElementById('open-self-service-modal');

    // --- ana-sayfa.json içeriği buraya gömüldü ---
    const anaSayfaData = {
        "popularItems": [
            { "name": "Filtre Kahve", "image": "filtre-kahve.jpg", "price": 45.00 },
            { "name": "Latte", "image": "latte.jpg", "price": 50.00 },
            { "name": "Cheesecake", "image": "cheesecake.jpg", "price": 60.00 },
            { "name": "Kruvasan", "image": "kruvasan.jpg", "price": 30.00 },
            { "name": "Espresso", "image": "espresso.jpg", "price": 40.00 },
            { "name": "Frappe", "image": "frappe.jpg", "price": 55.00 },
            { "name": "Brownie", "image": "brownie.jpg", "price": 50.00 },
            { "name": "Tost", "image": "tost.jpg", "price": 40.00 },
            { "name": "Americano", "image": "americano.jpg", "price": 48.00 },
            { "name": "Cold Brew", "image": "cold-brew.jpg", "price": 52.00 },
            { "name": "Cookie", "image": "cookie.jpg", "price": 25.00 },
            { "name": "Sandviç", "image": "sandvic.jpg", "price": 65.00 }
        ]
    };
    // --- JSON içeriği sonu ---

    const popularItems = anaSayfaData.popularItems;

    try {
        if (popularItemsGrid) {
            if (popularItems && popularItems.length > 0) {
                popularItems.forEach(item => {
                    const itemCard = document.createElement('div');
                    itemCard.classList.add('item-card');
                    itemCard.innerHTML = `
                        <img src="../images/${item.image}" alt="${item.name}">
                        <h4>${item.name}</h4>
                        <button class="add-to-cart-btn" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}" data-cart-type="onlineCart">Sepete Ekle</button>
                    `;
                    popularItemsGrid.appendChild(itemCard);
                });

                document.querySelectorAll('#popular-items-grid .add-to-cart-btn').forEach(button => {
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
                 popularItemsGrid.innerHTML = "<p>Popüler ürün bulunmamaktadır.</p>";
            }
        } else {
            console.warn("Popüler ürünler için '.item-grid' elementi bulunamadı.");
        }
    } catch (error) {
        console.error('Error processing popular items:', error);
        if(popularItemsGrid) popularItemsGrid.innerHTML = "<p>Popüler ürünler işlenirken bir hata oluştu.</p>";
    }

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