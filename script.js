// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the necessary elements
    const body = document.body;
    const toggleButton = document.getElementById('toggleButton');
    const music = document.getElementById('backgroundMusic');
    const video = document.getElementById('backgroundVideo');

    // Function to toggle background and music
    function toggleBackgroundAndMusic() {
        // Toggle the class for video background
        body.classList.toggle('video-background');
        
        // Check if the class was added
        if (body.classList.contains('video-background')) {
            // Show and play the video and music
            video.style.display = 'block';
            video.currentTime = 0; // Reset video time to start
            video.play();
            music.play();
        } else {
            // Hide and pause the video and music
            video.style.display = 'none';
            video.pause();
            music.pause();
            music.currentTime = 0; // Reset music time to start
        }
    }

    // Add click event listener to the toggle button
    toggleButton.addEventListener('click', toggleBackgroundAndMusic);
});

// Function to change pages
function showPage(pageId) {
    // Hide all pages
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('about-page').style.display = 'none';

    // Show the requested page
    document.getElementById(pageId + '-page').style.display = 'block';
}
