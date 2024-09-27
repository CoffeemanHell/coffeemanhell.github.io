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
        const { body, backgroundVideo, backgroundMusic } = elements;
        body.classList.toggle("video-background");

        if (body.classList.contains("video-background")) {
            backgroundVideo.style.display = "block";
            backgroundVideo.currentTime = 0;
            backgroundVideo.play().catch(error => console.error("Video play failed:", error));
            backgroundMusic.play().catch(error => console.error("Music play failed:", error));
        } else {
            backgroundVideo.style.display = "none";
            backgroundVideo.pause();
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
    };

    const showPage = (page) => {
        document.querySelectorAll(".container").forEach(container => {
            container.style.display = "none";
        });
        document.getElementById(`${page}-page`).style.display = "block";
    };

    const showNotification = (message, confirmCallback) => {
        const { notificationMessage, notificationOverlay, notificationConfirm, notificationCancel } = elements;
        notificationMessage.textContent = message;
        notificationOverlay.classList.remove("hidden");
        notificationOverlay.classList.add("visible");
        notificationConfirm.onclick = () => hideNotification(confirmCallback);
        notificationCancel.onclick = hideNotification;
        notificationOverlay.onclick = hideNotification;
        document.getElementById("notification-box").onclick = event => event.stopPropagation();
    };

    const hideNotification = (callback) => {
        const { notificationOverlay } = elements;
        notificationOverlay.classList.remove("visible");
        notificationOverlay.classList.add("hidden");
        if (callback) callback();
    };

    const disableContextMenu = () => {
        document.addEventListener('contextmenu', e => e.preventDefault(), false);
    };

    const disableTextSelection = () => {
        const { body } = elements;
        body.classList.add('no-select');
        document.addEventListener('selectstart', e => e.preventDefault());
    };

    const handlePageLinkClick = (event) => {
        event.preventDefault();
        const href = event.currentTarget.href;
        showNotification("Warning: You are leaving coffeemanhell.", () => window.open(href, "_blank"));
    };

    const handleCustomButtonClick = () => {
        const { clickSound } = elements;
        clickSound.currentTime = 0;
        clickSound.play().catch(error => console.error("Click sound play failed:", error));
    };

    // Event delegation for buttons with data-page attribute
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

    // Page loading animation with CSS transitions
    window.addEventListener("load", () => {
        elements.loadingBarContainer.style.opacity = "0";
        elements.mainContent.style.display = "block";
        setTimeout(() => {
            elements.loadingBarContainer.style.display = "none";
            elements.body.classList.remove("loading");
            elements.body.classList.add("loaded");
        }, 1000);
    });
});