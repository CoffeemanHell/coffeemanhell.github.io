document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const toggleButton = document.getElementById('toggleButton');
    const music = document.getElementById('backgroundMusic');
    const video = document.getElementById('backgroundVideo');
    const loadingBarContainer = document.getElementById('loading-bar-container');
    const mainContent = document.getElementById('main-content');

    function toggleBackgroundAndMusic() {
        body.classList.toggle('video-background');
        
        if (body.classList.contains('video-background')) {
            video.style.display = 'block';
            video.currentTime = 0;
            video.play();
            music.play();
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

    const notificationOverlay = document.getElementById('notification-overlay');
    const notificationMessage = document.getElementById('notification-message');
    const notificationConfirm = document.getElementById('notification-confirm');
    const notificationCancel = document.getElementById('notification-cancel');
    const dontShowCheckbox = document.getElementById('dont-show-checkbox');

    sessionStorage.removeItem('dontShowNotification');

    function showNotification(message, confirmCallback) {
        if (sessionStorage.getItem('dontShowNotification') === 'true') {
            confirmCallback();
            return;
        }

        notificationMessage.textContent = message;
        notificationOverlay.classList.remove('hidden');

        notificationConfirm.onclick = function(e) {
            e.stopPropagation();
            notificationOverlay.classList.add('hidden');
            if (dontShowCheckbox.checked) {
                sessionStorage.setItem('dontShowNotification', 'true');
            }
            confirmCallback();
        };

        notificationCancel.onclick = function(e) {
            e.stopPropagation();
            notificationOverlay.classList.add('hidden');
            if (dontShowCheckbox.checked) {
                sessionStorage.setItem('dontShowNotification', 'true');
            }
        };

        notificationOverlay.onclick = function() {
            notificationOverlay.classList.add('hidden');
        };

        document.getElementById('notification-box').onclick = function(e) {
            e.stopPropagation();
        };
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
});