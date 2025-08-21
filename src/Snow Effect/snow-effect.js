document.addEventListener("DOMContentLoaded", () => {
  const sC = document.getElementById("snow-container");
  const sFs = [];
  let isS = false;

  const isW = () => [12, 1].includes(new Date().getMonth() + 1);

  function crSF() {
    if (!document.hasFocus()) return;

    const sF = document.createElement("div");
    sF.className = "snowflake";
    const size = Math.random() * 5 + 2;
    const opacity = Math.random() * 0.5 + 0.4;
    sF.style.cssText = `width: ${size}px; height: ${size}px; left: ${Math.random() * 100}%; top: -5px; opacity: ${opacity}; transform: rotate(${Math.random() * 360}deg);`;

    sFs.push({
      el: sF,
      x: parseFloat(sF.style.left),
      y: parseFloat(sF.style.top),
      sp: Math.random() * 1.5 + 0.5,
      hSp: Math.random() * 2 - 1,
      rSp: Math.random() * 1 + 0.5,
    });

    sC.appendChild(sF);
  }

  function mvSFs() {
    sFs.forEach((sF, i) => {
      sF.y += sF.sp;
      sF.x += sF.hSp;

      const rot = parseFloat(
        sF.el.style.transform.match(/rotate\((.*?)deg\)/)?.[1] || 0,
      );
      sF.el.style.transform = `rotate(${rot + sF.rSp}deg)`;

      if (sF.y > sC.clientHeight) {
        sFs.splice(i, 1);
        sF.el.remove();
      } else {
        sF.el.style.transform = `translate3d(${sF.x}px, ${sF.y}px, 0) rotate(${rot + sF.rSp}deg)`;
      }
    });

    if (isS) requestAnimationFrame(mvSFs);
  }

  function chkSF() {
    if (isW()) {
      if (!isS) {
        isS = true;
        setInterval(crSF, 150);
        mvSFs();
      }
    } else if (isS) {
      isS = false;
      sFs.forEach((sF) => sF.el.remove());
      sFs.length = 0;
    }
  }

  setInterval(chkSF, 3600000);
  chkSF();
});
