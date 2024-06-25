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

    window.addEventListener('load', function() {
        setTimeout(function() {
            loadingBarContainer.style.opacity = '0';
            mainContent.style.display = 'block';
            
            setTimeout(function() {
                loadingBarContainer.style.display = 'none';
                body.classList.remove('loading');
                body.classList.add('loaded');
            }, 200); // Bu süre, CSS'deki geçiş süresiyle eşleşmeli
        }, 1000);
    });
});