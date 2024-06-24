document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const changeBackgroundButton = document.getElementById('changeBackgroundButton');
    const music = document.getElementById('backgroundMusic');
    const video = document.getElementById('backgroundVideo');

    // Sayfa yüklendiğinde varsayılan arka planı ayarla
    body.classList.add('background-1');

    // Müziği döngüye al
    music.loop = true;

    function toggleBackground() {
        if (body.classList.contains('background-1')) {
            body.classList.remove('background-1');
            video.style.display = 'block';
            video.currentTime = 0; // Videoyu başa sar
            video.play();
        } else {
            body.classList.add('background-1');
            video.style.display = 'none';
            video.pause();
        }
    }

    changeBackgroundButton.addEventListener('click', function() {
        toggleBackground();

        // Müzik çalma/durdurma
        if (music.paused) {
            music.play();
        } else {
            music.pause();
            music.currentTime = 0; // Müziği başa sar
        }
    });
});