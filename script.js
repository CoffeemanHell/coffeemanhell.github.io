document.addEventListener('DOMContentLoaded', function() {
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

    sessionStorage.removeItem('dontShowNotification');

    function showNotification(message, confirmCallback, showCancelButton = true) {
        if (sessionStorage.getItem('dontShowNotification') === 'true') {
            if (confirmCallback) confirmCallback();
            return;
        }

        notificationMessage.textContent = message;
        notificationOverlay.classList.remove('hidden');
        
        notificationConfirm.textContent = confirmCallback ? 'Refresh' : 'Yes';
        notificationCancel.style.display = showCancelButton ? 'inline-block' : 'none';

        setTimeout(() => {
            notificationOverlay.classList.add('visible');
            document.getElementById('notification-box').classList.remove('hiding');
        }, 10);

        notificationConfirm.onclick = function(e) {
            e.stopPropagation();
            hideNotification(confirmCallback);
            if (dontShowCheckbox.checked) {
                sessionStorage.setItem('dontShowNotification', 'true');
            }
        };

        notificationCancel.onclick = function(e) {
            e.stopPropagation();
            hideNotification();
            if (dontShowCheckbox.checked) {
                sessionStorage.setItem('dontShowNotification', 'true');
            }
        };

        notificationOverlay.onclick = function() {
            hideNotification();
        };

        document.getElementById('notification-box').onclick = function(e) {
            e.stopPropagation();
        };
    }

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

    function checkForUpdates() {
        console.log("Checking for updates...");
        const lastVisit = localStorage.getItem('lastVisit');
        const currentDate = new Date().toISOString().split('T')[0];
        
        if (lastVisit && lastVisit !== currentDate) {
            const lastModified = document.querySelector('meta[name="last-modified"]').getAttribute('content');
            if (new Date(lastModified) > new Date(lastVisit)) {
                showUpdateNotification();
            }
        }
        
        localStorage.setItem('lastVisit', currentDate);
    }

    function showUpdateNotification() {
        showNotification("The site has been updated since your last visit. Refresh to see the latest changes.", function() {
            location.reload();
        }, false);
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

    // Call checkForUpdates when the page loads
    checkForUpdates();
});