document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const toggleButton = document.getElementById('toggleButton');
    const music = document.getElementById('backgroundMusic');
    const video = document.getElementById('backgroundVideo');

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
});

// Sayfa değiştirme fonksiyonu
function showPage(pageId) {
    // Tüm sayfaları gizle
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('about-page').style.display = 'none';

    // İstenen sayfayı göster
    document.getElementById(pageId + '-page').style.display = 'block';
}