
document.addEventListener('DOMContentLoaded', () => {
    const customerOrdersList = document.getElementById('customer-orders-list');
    const ordersFilterMessage = document.getElementById('orders-filter-message');

    // Müşteri oturumunu kontrol et
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    function renderCustomerOrders() {
        customerOrdersList.innerHTML = ''; // Listeyi temizle

        let allOrdersInLocalStorage = JSON.parse(localStorage.getItem('customerOrderHistory')) || [];
        let ordersToDisplay = [];

        if (loggedInUser && loggedInUser.email) {
            ordersFilterMessage.style.display = 'none'; // Uyarı mesajını gizle
            // Giriş yapmışsa, sadece kendi e-postasına ait tüm siparişleri göster
            ordersToDisplay = allOrdersInLocalStorage.filter(order => order.customerEmail === loggedInUser.email);
        } else {
            // Giriş yapmamışsa, genel uyarıyı göster ve bu tarayıcıdan verilen tüm sipariş geçmişini göster
            ordersFilterMessage.style.display = 'block';
            ordersToDisplay = allOrdersInLocalStorage; 
        }

        if (ordersToDisplay.length === 0) {
            customerOrdersList.innerHTML = '<p>Henüz siparişiniz bulunmamaktadır.</p>';
            return;
        }

        // Siparişleri en yeniden en eskiye doğru sırala
        ordersToDisplay.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        // Her sipariş için HTML kartını oluştur ve listeye ekle
        ordersToDisplay.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card'); // CSS stilini uygulamak için

            // Siparişin ürünlerini bir liste halinde formatla
            const itemsHtml = order.items.map(item => 
                `<li>${item.name} x ${item.quantity} (${item.price.toFixed(2)} TL/adet)</li>`
            ).join('');

            
            // Barista bilgisi için bir HTML değişkeni oluştur
            let personnelHtml = '';
            // Eğer sipariş self-servis ise ve atanmış bir personel varsa, bu bilgiyi ekle
            if (order.type === 'self-service' && order.assignedPersonnel) {
                personnelHtml = `<p><strong>Sorumlu Barista:</strong> ${order.assignedPersonnel}</p>`;
            }
            

            orderCard.innerHTML = `
                <h3>Sipariş #${order.id} (${order.type === 'online' ? 'Online' : 'Self Servis'})</h3>
                <p class="order-meta">
                    <strong>Verilme Zamanı:</strong> ${order.displayTime} <br>
                    <strong>Toplam Tutar:</strong> ${order.total.toFixed(2)} TL
                </p>
                <p><strong>Durum:</strong> <span class="order-status ${order.status.replace(/\s/g, '')}">${order.status}</span></p>
                ${personnelHtml} <h4>Ürünler:</h4>
                <ul>
                    ${itemsHtml}
                </ul>
            `;
            customerOrdersList.appendChild(orderCard);
        });
    }

    renderCustomerOrders(); // Sayfa yüklendiğinde siparişleri göster
});