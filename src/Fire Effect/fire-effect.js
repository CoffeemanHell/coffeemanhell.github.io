document.addEventListener("DOMContentLoaded", () => {
  const fC =
    document.getElementById("fire-container") ||
    (() => {
      const cont = document.createElement("div");
      cont.id = "fire-container";
      document.body.appendChild(cont);
      return cont;
    })();

  const fPs = [];
  let isB = false;
  const fID = 50;
  const sMs = [6, 7, 8];

  const isSM = () => sMs.includes(new Date().getMonth() + 1);

  const crFP = () => {
    if (!document.hasFocus()) return;

    const p = document.createElement("div");
    p.className = "fire-particle";

    const size = Math.random() * 5 + 3;
    const opacity = Math.random() * 0.5 + 0.4;
    const hue = Math.random() * 60 + 10;
    const sat = Math.random() * 20 + 80;
    const light = Math.random() * 20 + 50;
    const animDur = Math.random() * 1.1 + 1.5;
    const animType = Math.floor(Math.random() * 4);

    Object.assign(p.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      bottom: "0",
      opacity: `${opacity}`,
      backgroundColor: `hsl(${hue}, ${sat}%, ${light}%)`,
      boxShadow: `0 0 ${size * 2}px hsl(${hue}, ${sat}%, ${light}%)`,
      animation: `rise-${animType} ${animDur}s ease-out forwards, flicker ${Math.random() * 0.5 + 0.5}s infinite alternate`,
    });

    p.addEventListener("animationend", () => {
      p.remove();
      const index = fPs.indexOf(p);
      if (index > -1) fPs.splice(index, 1);
    });

    fPs.push(p);
    fC.appendChild(p);
  };

  const startFE = () => {
    if (!isB) {
      isB = true;
      fireInterval = setInterval(crFP, fID);
    }
  };

  const stopFE = () => {
    if (isB) {
      isB = false;
      clearInterval(fireInterval);
      fPs.forEach((p) => p.remove());
      fPs.length = 0;
    }
  };

  const chkS = () => (isSM() ? startFE() : stopFE());

  setInterval(chkS, 3600000);
  chkS();
});
