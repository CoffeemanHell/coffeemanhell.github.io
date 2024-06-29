document.addEventListener('DOMContentLoaded', function() {
    // Existing elements and functions
    const body = document.body;
    const toggleButton = document.getElementById('toggleButton');
    const music = document.getElementById('backgroundMusic');
    const video = document.getElementById('backgroundVideo');
    const loadingBarContainer = document.getElementById('loading-bar-container');
    const mainContent = document.getElementById('main-content');
    const notificationOverlay = document.getElementById('notification-overlay');
    const notificationMessage = document.getElementById('notification-message');
    const notificationConfirm = document.getElementById('notification-confirm');
    const notificationCancel = document.getElementById('notification-cancel');
    const dontShowCheckbox = document.getElementById('dont-show-checkbox');
    const errorCoffee = document.getElementById('error-coffee');

    // Arka plan müziği ve videoyu açıp kapatan fonksiyon
    function toggleBackgroundAndMusic() {
        body.classList.toggle('video-background');
        
        if (body.classList.contains('video-background')) {
            video.style.display = 'block';
            video.currentTime = 0;
            video.play().catch(error => console.error('Video play failed:', error));
            music.play().catch(error => console.error('Music play failed:', error));
        } else {
            video.style.display = 'none';
            video.pause();
            music.pause();
            music.currentTime = 0;
        }
    }

    // Toggle button'a tıklama olayı
    toggleButton.addEventListener('click', toggleBackgroundAndMusic);

    // Sayfa gösterme fonksiyonu
    function showPage(pageId) {
        document.querySelectorAll('.container').forEach(page => page.style.display = 'none');
        document.getElementById(pageId + '-page').style.display = 'block';
    }

    // Tüm custom-button'lara tıklama olayı ekleme
    document.querySelectorAll('.custom-button[data-page]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(this.dataset.page);
        });
    });

    // Bildirim gösterme fonksiyonu
    function showNotification(message, confirmCallback) {
        if (sessionStorage.getItem('dontShowNotification') === 'true') {
            confirmCallback();
            return;
        }

        notificationMessage.textContent = message;
        notificationOverlay.classList.remove('hidden');

        setTimeout(() => {
            notificationOverlay.classList.add('visible');
            document.getElementById('notification-box').classList.remove('hiding');
        }, 10);

        function handleNotificationResponse(e, callback) {
            e.stopPropagation();
            hideNotification(callback);
            if (dontShowCheckbox.checked) {
                sessionStorage.setItem('dontShowNotification', 'true');
            }
        }
    
        notificationConfirm.onclick = (e) => handleNotificationResponse(e, confirmCallback);
        notificationCancel.onclick = (e) => handleNotificationResponse(e);

        notificationOverlay.onclick = () => hideNotification();
        document.getElementById('notification-box').onclick = (e) => e.stopPropagation();
    }

    // Harici bağlantılar için uyarı gösterme
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.href;
            showNotification("Warning: You are leaving CoffeeMan.Hell.", function() {
                window.open(href, '_blank');
            });
        });
    });

    // Bildirim gizleme fonksiyonu
    function hideNotification(callback) {
        const notificationBox = document.getElementById('notification-box');
        notificationBox.classList.add('hiding');
        notificationOverlay.classList.remove('visible');
        
        setTimeout(() => {
            notificationOverlay.classList.add('hidden');
            notificationBox.classList.remove('hiding');
            if (callback) callback();
        }, 100);
    }

    // Sayfa yükleme işlemi ve hata yönetimi
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingBarContainer.style.opacity = '0';
            mainContent.style.display = 'block';
            
            setTimeout(() => {
                loadingBarContainer.style.display = 'none';
                body.classList.remove('loading');
                body.classList.add('loaded');
            }, 1000);
        }, 100);
    });

    // ErrorCoffee elementi için sallanma efekti
    if (errorCoffee) {
        errorCoffee.addEventListener('click', function() {
            this.classList.add('shake');
            setTimeout(() => this.classList.remove('shake'), 500);
        });
    }

    // URL'leri kontrol eden ve yönlendiren fetch işlemi
    fetch('/urls.json')
        .then(response => response.json())
        .then(urls => {
            const path = window.location.pathname.slice(1); // Başındaki '/' karakterini kaldır
            if (urls[path]) {
                window.location.href = urls[path]; // URL varsa yönlendir
            } else {
                // URL bulunamazsa hata mesajı göster
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('error-content').classList.remove('hidden');
                document.getElementById('error-message').textContent = "The page you're looking for has vanished into the void.";
            }
        })
        .catch(error => {
            // Hata durumunda konsola hata yazdır ve hata mesajı göster
            console.error('Error:', error);
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('error-content').classList.remove('hidden');
            document.getElementById('error-message').textContent = "An error occurred while processing your request.";
        });

    // Uzun URL'leri kısaltan fonksiyon
    function shortenUrl(longUrl) {
        // Basit bir hash fonksiyonu
        function simpleHash(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // 32 bit integer'a çevir
            }
            return Math.abs(hash).toString(36).substr(0, 6);
        }

        const shortCode = simpleHash(longUrl);
        const shortUrl = `https://coffeemanhell.github.io/${shortCode}`;

        // Normalde burada shortCode ve longUrl'yi sunucuya kaydederdik
        // Ancak GitHub Pages statik olduğu için, bunu manuel olarak urls.json dosyasına eklemeniz gerekecek
        console.log(`Short URL created: ${shortUrl}`);
        console.log(`Add this to urls.json: "${shortCode}": "${longUrl}"`);

        return shortUrl;
    }
});
