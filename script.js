document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        body: document.body,
        toggleButton: document.getElementById("toggleButton"),
        backgroundMusic: document.getElementById("backgroundMusic"),
        backgroundVideo: document.getElementById("backgroundVideo"),
        loadingBarContainer: document.getElementById("loading-bar-container"),
        mainContent: document.getElementById("main-content"),
        notificationOverlay: document.getElementById("notification-overlay"),
        notificationMessage: document.getElementById("notification-message"),
        notificationConfirm: document.getElementById("notification-confirm"),
        notificationCancel: document.getElementById("notification-cancel"),
        clickSound: document.getElementById("clickSound"),
        document: document
    };

    function toggleMedia() {
        elements.body.classList.toggle("video-background");
        if (elements.body.classList.contains("video-background")) {
            elements.backgroundVideo.style.display = "block";
            elements.backgroundVideo.currentTime = 0;
            Promise.all([
                elements.backgroundVideo.play().catch(error => console.error("Video play failed:", error)),
                elements.backgroundMusic.play().catch(error => console.error("Music play failed:", error))
            ]);
        } else {
            elements.backgroundVideo.style.display = "none";
            elements.backgroundVideo.pause();
            elements.backgroundMusic.pause();
            elements.backgroundMusic.currentTime = 0;
        }
    }

    function showPage(page) {
        document.querySelectorAll(".container").forEach(container => {
            container.style.display = "none";
        });
        document.getElementById(page + "-page").style.display = "block";
    }

    function showNotification(message, confirmCallback) {
        elements.notificationMessage.textContent = message;
        elements.notificationOverlay.classList.remove("hidden");
        elements.notificationOverlay.classList.add("visible");
        elements.notificationConfirm.onclick = () => hideNotification(confirmCallback);
        elements.notificationCancel.onclick = hideNotification;
        elements.notificationOverlay.onclick = hideNotification;
        document.getElementById("notification-box").onclick = event => event.stopPropagation();
    }

    function hideNotification(callback) {
        elements.notificationOverlay.classList.remove("visible");
        elements.notificationOverlay.classList.add("hidden");
        if (callback) callback();
    }

    function disableContextMenu() {
        elements.document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        }, false);
    }

    function disableTextSelection() {
        elements.body.classList.add('no-select');
        
        elements.document.addEventListener('selectstart', function(e) {
            e.preventDefault();
        });
    }

    elements.toggleButton.addEventListener("click", toggleMedia);

    document.querySelectorAll(".custom-button[data-page]").forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            showPage(this.dataset.page);
        });
    });

    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const href = this.href;
            showNotification("Warning: You are leaving coffeemanhell.", () => window.open(href, "_blank"));
        });
    });

    document.querySelectorAll(".custom-button").forEach(button => {
        button.addEventListener("click", () => {
            elements.clickSound.currentTime = 0;
            elements.clickSound.play().catch(error => console.error("Click sound play failed:", error));
        });
    });

    disableContextMenu();
    disableTextSelection();

    // Page loading animation
    window.addEventListener("load", function() {
        setTimeout(() => {
            elements.loadingBarContainer.style.opacity = "0";
            elements.mainContent.style.display = "block";
            setTimeout(() => {
                elements.loadingBarContainer.style.display = "none";
                elements.body.classList.remove("loading");
                elements.body.classList.add("loaded");
            }, 1000);
        }, 100);
    });
});