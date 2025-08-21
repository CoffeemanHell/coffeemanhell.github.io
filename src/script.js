document.addEventListener("DOMContentLoaded", () => {
  const el = {
    body: document.body,
    toggleBtn: document.getElementById("toggleButton"),
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

  el.body.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".custom-button[data-page]");
    if (btn) {
      ev.preventDefault();
      showPage(btn.dataset.page);
      handleBtnClick();
    }
  });

  el.toggleBtn.addEventListener("click", toggleMedia);
  disableCtxMenu();
  disableTxtSel();

  window.addEventListener(
    "load",
    () => {
      el.loadBar.style.opacity = "0";
      el.mainCont.style.display = "block";
      setTimeout(() => {
        el.loadBar.style.display = "none";
        el.body.classList.remove("loading");
        el.body.classList.add("loaded");
      }, 1000);
    },
    1000,
  );
  lazyLoad();
});
