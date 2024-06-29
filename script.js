// DOM elementlerini seçme
const selectors = {
    body: 'body',
    toggleButton: '#toggleButton',
    music: '#backgroundMusic',
    video: '#backgroundVideo',
    loadingBarContainer: '#loading-bar-container',
    mainContent: '#main-content',
    notificationOverlay: '#notification-overlay',
    notificationMessage: '#notification-message',
    notificationConfirm: '#notification-confirm',
    notificationCancel: '#notification-cancel',
    dontShowCheckbox: '#dont-show-checkbox',
    errorCoffee: '#error-coffee',
    notificationBox: '#notification-box',
    loading: '#loading',
    errorContent: '#error-content',
    errorMessage: '#error-message'
};

// DOM elementlerini seçme fonksiyonu
function selectElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Arka plan ve müziği açıp kapatan fonksiyon
function toggleBackgroundAndMusic() {
    const body = selectElement(selectors.body);
    const video = selectElement(selectors.video);
    const music = selectElement(selectors.music);

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

// Sayfa gösterme fonksiyonu
function showPage(pageId) {
    document.querySelectorAll('.container').forEach(page => page.style.display = 'none');
    const pageToShow = document.getElementById(pageId + '-page');
    if (pageToShow) {
        pageToShow.style.display = 'block';
    }
}

// Bildirim gösterme fonksiyonu
function showNotification(message, confirmCallback) {
    if (sessionStorage.getItem('dontShowNotification') === 'true') {
        if (confirmCallback) confirmCallback();
        return;
    }

    const notificationOverlay = selectElement(selectors.notificationOverlay);
    const notificationMessage = selectElement(selectors.notificationMessage);
    const notificationBox = selectElement(selectors.notificationBox);
    const notificationConfirm = selectElement(selectors.notificationConfirm);
    const notificationCancel = selectElement(selectors.notificationCancel);
    const dontShowCheckbox = selectElement(selectors.dontShowCheckbox);

    notificationMessage.textContent = message;
    notificationOverlay.classList.remove('hidden');

    setTimeout(() => {
        notificationOverlay.classList.add('visible');
        notificationBox.classList.remove('hiding');
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
    notificationBox.onclick = (e) => e.stopPropagation();
}

// Bildirim gizleme fonksiyonu
function hideNotification(callback) {
    const notificationOverlay = selectElement(selectors.notificationOverlay);
    const notificationBox = selectElement(selectors.notificationBox);

    notificationBox.classList.add('hiding');
    notificationOverlay.classList.remove('visible');
    
    setTimeout(() => {
        notificationOverlay.classList.add('hidden');
        notificationBox.classList.remove('hiding');
        if (callback) callback();
    }, 100);
}

// GitHub Pages için URL yönlendirme fonksiyonu
function handleGitHubPagesRouting() {
    // Sabit URL yönlendirmeleri
    const routes = {
        'git': 'https://github.com/CoffeemanHell',
        'dc': 'https://discord.gg/SxWKF4HsSY',
        'wp': 'https://steamcommunity.com/sharedfiles/filedetails/?id=2489782244',
        '21st': 'https://discord.com/users/980928434748424263',
        'steam': 'https://steamcommunity.com/id/coffeeman_hell',
        // Diğer sayfalarınızı buraya ekleyin
    };

    const path = window.location.pathname.replace(/^\//, '').split('.')[0];
    console.log('Current path:', path);

    if (path === '' || path === 'index') {
        console.log('On main page, no redirection needed');
        return; // Ana sayfadaysa yönlendirme yapma
    }

    if (routes[path]) {
        console.log(`Redirecting to: ${routes[path]}`);
        window.location.href = routes[path];
    } else if (!document.getElementById('error-content')) {
        // Eğer 404 sayfasında değilsek ve geçerli bir rota yoksa
        console.log('Invalid route, redirecting to 404 page');
        window.location.href = '404.html';
    } else {
        console.log('On 404 page, showing error content');
        showErrorContent("The page you're looking for has vanished into the void.");
    }
}

// Hata içeriğini gösteren fonksiyon
function showErrorContent(message) {
    console.log('Showing error content:', message);
    const loading = selectElement(selectors.loading);
    const errorContent = selectElement(selectors.errorContent);
    const errorMessage = selectElement(selectors.errorMessage);

    if (loading) loading.classList.add('hidden');
    if (errorContent) errorContent.classList.remove('hidden');
    if (errorMessage) errorMessage.textContent = message;
}

// Sayfa yükleme işlemi
function handlePageLoad() {
    console.log('Page load handler started');
    const loadingBarContainer = selectElement(selectors.loadingBarContainer);
    const mainContent = selectElement(selectors.mainContent);
    const body = selectElement(selectors.body);

    if (loadingBarContainer) loadingBarContainer.style.opacity = '0';
    if (mainContent) mainContent.style.display = 'block';
    
    setTimeout(() => {
        if (loadingBarContainer) loadingBarContainer.style.display = 'none';
        if (body) {
            body.classList.remove('loading');
            body.classList.add('loaded');
        }
        console.log('Page load complete');
    }, 1000);
}

// Event listener'ları ekleyen fonksiyon
function addEventListeners() {
    const toggleButton = selectElement(selectors.toggleButton);
    const errorCoffee = selectElement(selectors.errorCoffee);

    if (toggleButton) {
        toggleButton.addEventListener('click', toggleBackgroundAndMusic);
    }

    document.querySelectorAll('.custom-button[data-page]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(this.dataset.page);
        });
    });

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

    if (errorCoffee) {
        errorCoffee.addEventListener('click', function() {
            this.classList.add('shake');
            setTimeout(() => this.classList.remove('shake'), 500);
        });
    }
}

// Ana fonksiyon
function init() {
    console.log('Initializing...');
    addEventListeners();
    handleGitHubPagesRouting();
}

// Sayfa yüklendiğinde init fonksiyonunu çağır
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', handlePageLoad);