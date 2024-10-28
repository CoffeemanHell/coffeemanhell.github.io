document.addEventListener('DOMContentLoaded', () => {
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
    };

    const toggleMedia = () => {
        elements.body.classList.toggle("video-background");
        const isVideoBackground = elements.body.classList.contains("video-background");

        elements.backgroundVideo.style.display = isVideoBackground ? "block" : "none";
        if (isVideoBackground) {
            elements.backgroundVideo.currentTime = 0;
            elements.backgroundVideo.play().catch(error => console.error("Video play failed:", error));
            elements.backgroundMusic.play().catch(error => console.error("Music play failed:", error));
        } else {
            elements.backgroundVideo.pause();
            elements.backgroundMusic.pause();
            elements.backgroundMusic.currentTime = 0;
        }
    };

    const showPage = (page) => {
        document.querySelectorAll(".container").forEach(container => {
            container.style.display = "none";
        });
        document.getElementById(`${page}-page`).style.display = "block";
    };

    const showNotification = (message, confirmCallback) => {
        elements.notificationMessage.textContent = message;
        elements.notificationOverlay.classList.remove("hidden");
        elements.notificationOverlay.classList.add("visible");
        
        elements.notificationConfirm.onclick = () => hideNotification(confirmCallback);
        elements.notificationCancel.onclick = hideNotification;
        elements.notificationOverlay.onclick = hideNotification;
        
        document.getElementById("notification-box").onclick = event => event.stopPropagation();
    };

    const hideNotification = (callback) => {
        elements.notificationOverlay.classList.remove("visible");
        elements.notificationOverlay.classList.add("hidden");
        if (callback) callback();
    };

    const disableContextMenu = () => {
        document.addEventListener('contextmenu', e => e.preventDefault(), false);
    };

    const disableTextSelection = () => {
        elements.body.classList.add('no-select');
        document.addEventListener('selectstart', e => e.preventDefault());
    };

    const handlePageLinkClick = (event) => {
        event.preventDefault();
        const href = event.currentTarget.href;
        showNotification("Warning: You are leaving coffeemanhell.", () => window.open(href, "_blank"));
    };

    const handleCustomButtonClick = () => {
        elements.clickSound.currentTime = 0;
        elements.clickSound.play().catch(error => console.error("Click sound play failed:", error));
    };

    const lazyLoadImages = () => {
        const lazyImages = document.querySelectorAll('img.lazy');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.onload = () => {
                        img.classList.remove('lazy');
                        img.style.opacity = 1;
                    };
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    };

    document.body.addEventListener("click", (event) => {
        const button = event.target.closest(".custom-button[data-page]");
        if (button) {
            event.preventDefault();
            showPage(button.dataset.page);
            handleCustomButtonClick();
        }
    });

    elements.toggleButton.addEventListener("click", toggleMedia);

    disableContextMenu();
    disableTextSelection();

    window.addEventListener("load", () => {
        elements.loadingBarContainer.style.opacity = "0";
        elements.mainContent.style.display = "block";
        setTimeout(() => {
            elements.loadingBarContainer.style.display = "none";
            elements.body.classList.remove("loading");
            elements.body.classList.add("loaded");
        }, 1000);
        lazyLoadImages();
    });
});