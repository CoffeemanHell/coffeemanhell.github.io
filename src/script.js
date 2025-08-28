document.addEventListener("DOMContentLoaded", () => {
  const el = {
    body: document.body,
    bgMusic: document.getElementById("backgroundMusic"),
    bgVideo: document.getElementById("backgroundVideo"),
    loadBar: document.getElementById("loading-bar-container"),
    mainCont: document.getElementById("main-content"),
    notifOverlay: document.getElementById("notification-overlay"),
    notifMsg: document.getElementById("notification-message"),
    notifConf: document.getElementById("notification-confirm"),
    notifCancel: document.getElementById("notification-cancel"),
    clickSnd: document.getElementById("clickSound"),
  };

  // Responsive utilities
  const getViewportWidth = () =>
    window.innerWidth || document.documentElement.clientWidth;
  const isMobile = () => getViewportWidth() <= 768;
  const isSmallMobile = () => getViewportWidth() <= 480;

  // Debounce function for performance
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const play = (e, t) =>
    e.play().catch((err) => console.error(`${t} play failed:`, err));
  const pause = (e, t) => {
    e.pause();
    if (t === "music") e.currentTime = 0;
  };

  const toggleMedia = () => {
    el.body.classList.toggle("video-background");
    const isVidBg = el.body.classList.contains("video-background");
    el.bgVideo.style.display = isVidBg ? "block" : "none";
    isVidBg
      ? ((el.bgVideo.currentTime = 0),
        play(el.bgVideo, "Video"),
        play(el.bgMusic, "Music"))
      : (pause(el.bgVideo, "Video"), pause(el.bgMusic, "Music"));
  };

  const showPage = (p) => {
    document
      .querySelectorAll(".container")
      .forEach((c) => (c.style.display = "none"));
    document.getElementById(`${p}-page`).style.display = "block";
  };

  const notif = el.notifOverlay;
  const showNotif = (msg, confCB) => {
    el.notifMsg.textContent = msg;
    notif.classList.replace("hidden", "visible");
    const hide = () => hideNotif(confCB);
    el.notifConf.onclick = hide;
    el.notifCancel.onclick = hide;
    notif.onclick = hide;
    document.getElementById("notification-box").onclick = (ev) =>
      ev.stopPropagation();
  };

  const hideNotif = (cb) => {
    notif.classList.replace("visible", "hidden");
    cb?.();
  };

  const disableCtxMenu = () =>
    document.addEventListener("contextmenu", (e) => e.preventDefault(), false);
  const disableTxtSel = () => {
    el.body.classList.add("no-select");
    document.addEventListener("selectstart", (e) => e.preventDefault());
  };

  const handlePageLink = (e) => {
    e.preventDefault();
    showNotif("Warning: You are leaving coffeemanhell.", () =>
      window.open(e.currentTarget.href, "_blank"),
    );
  };

  const handleBtnClick = () => {
    el.clickSnd.currentTime = 0;
    play(el.clickSnd, "Click Sound");
  };

  const lazyLoad = () => {
    const lazyImgs = document.querySelectorAll("img.lazy");
    const imgObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => {
            img.classList.remove("lazy");
            img.style.opacity = 1;
          };
          imgObs.unobserve(img);
        }
      });
    });
    lazyImgs.forEach((img) => imgObs.observe(img));
  };

  // Responsive behavior adjustments
  const adjustForViewport = () => {
    if (isMobile()) {
      el.body.classList.add("mobile-device");
      // Disable video backgrounds on mobile for performance
      if (el.bgVideo && el.body.classList.contains("video-background")) {
        el.bgVideo.style.display = "none";
        el.body.classList.remove("video-background");
      }
    } else {
      el.body.classList.remove("mobile-device");
    }

    if (isSmallMobile()) {
      el.body.classList.add("small-mobile");
    } else {
      el.body.classList.remove("small-mobile");
    }
  };

  // Touch event handling for better mobile experience
  const handleTouchEvents = () => {
    if ("ontouchstart" in window) {
      el.body.classList.add("touch-device");

      // Add touch feedback for buttons
      const buttons = document.querySelectorAll(".custom-button");
      buttons.forEach((button) => {
        button.addEventListener("touchstart", () => {
          button.classList.add("touch-active");
        });

        button.addEventListener("touchend", () => {
          setTimeout(() => {
            button.classList.remove("touch-active");
          }, 150);
        });
      });
    }
  };

  el.body.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".custom-button[data-page]");
    if (btn) {
      ev.preventDefault();
      showPage(btn.dataset.page);
      handleBtnClick();
    }
  });

  disableCtxMenu();
  disableTxtSel();

  // Initialize responsive features
  adjustForViewport();
  handleTouchEvents();

  // Handle window resize with debouncing
  window.addEventListener(
    "resize",
    debounce(() => {
      adjustForViewport();
    }, 250),
  );

  // Handle orientation change on mobile devices
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      adjustForViewport();
    }, 100);
  });

  window.addEventListener(
    "load",
    () => {
      el.loadBar.style.opacity = "0";
      el.mainCont.style.display = "block";
      setTimeout(() => {
        el.loadBar.style.display = "none";
        el.body.classList.remove("loading");
        el.body.classList.add("loaded");
        adjustForViewport(); // Final adjustment after load
      }, 1000);
    },
    1000,
  );
  lazyLoad();

  // ↑ ↑ ↓ ↓ ← → ← →
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
  ];
  let konamiIndex = 0;
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    const expected = konamiCode[konamiIndex].toLowerCase();
    if (key === expected) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        // Only enable video background on non-mobile devices
        if (!isMobile()) {
          el.body.classList.add("video-background");
          el.bgVideo.style.display = "block";
          el.bgVideo.currentTime = 0;
          el.bgVideo.load();
          el.bgVideo.play();
        }
      }
    } else {
      konamiIndex = 0;
    }
  });

  // Prevent zoom on double tap for iOS
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    (e) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    false,
  );

  // Handle viewport height changes on mobile (address bar hide/show)
  const handleViewportChange = () => {
    if (isMobile()) {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
  };

  handleViewportChange();
  window.addEventListener("resize", debounce(handleViewportChange, 100));
});
