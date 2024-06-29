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

    toggleButton.addEventListener('click', toggleBackgroundAndMusic);

    function showPage(pageId) {
        document.querySelectorAll('.container').forEach(page => page.style.display = 'none');
        document.getElementById(pageId + '-page').style.display = 'block';
    }

    document.querySelectorAll('.custom-button[data-page]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(this.dataset.page);
        });
    });

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

    window.addEventListener('load', function() {
        setTimeout(function() {
            loadingBarContainer.style.opacity = '0';
            mainContent.style.display = 'block';
            
            setTimeout(function() {
                loadingBarContainer.style.display = 'none';
                body.classList.remove('loading');
                body.classList.add('loaded');
            }, 1000);
        }, 100);
    });

    // New functionality for errorCoffee and URL redirection
    const errorCoffee = document.getElementById('error-coffee');
    if (errorCoffee) {
        errorCoffee.addEventListener('click', function() {
            this.classList.add('shake');
            setTimeout(() => this.classList.remove('shake'), 500);
        });
    }

    fetch('/urls.json')
        .then(response => response.json())
        .then(urls => {
            const path = window.location.pathname.slice(1); // Remove leading slash
            if (urls[path]) {
                window.location.href = urls[path];
            } else {
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('error-content').classList.remove('hidden');
                document.getElementById('error-message').textContent = "The page you're looking for has vanished into the void.";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('error-content').classList.remove('hidden');
            document.getElementById('error-message').textContent = "An error occurred while processing your request.";
        });
});