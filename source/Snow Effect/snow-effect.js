document.addEventListener('DOMContentLoaded', () => {
  const snowContainer = document.getElementById('snow-container');
  const snowflakes = [];
  let isSnowing = false;

  const isWinterMonth = () => [12, 1].includes(new Date().getMonth() + 1); // Date

  function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    const size = Math.random() * 5 + 2;
    const opacity = Math.random() * 0.5 + 0.4; // Random opacities of snowflakes
    snowflake.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: -5px;
      opacity: ${opacity};
      transform: rotate(${Math.random() * 360}deg); /* Random rotation */
    `;

    snowflakes.push({
      element: snowflake,
      x: parseFloat(snowflake.style.left),
      y: parseFloat(snowflake.style.top),
      speed: Math.random() * 1.5 + 0.5, //  Speed variability
      horizontalSpeed: Math.random() * 2 - 1,
      rotationSpeed: Math.random() * 1 + 0.5, // Cyclic rotation
    });

    snowContainer.appendChild(snowflake);
  }

  function moveSnowflakes() {
    snowflakes.forEach((flake, i) => {
      flake.y += flake.speed;
      flake.x += flake.horizontalSpeed;

      // Return of snowflakes
      const rotation = parseFloat(flake.element.style.transform.match(/rotate\((.*?)deg\)/)?.[1] || 0);
      flake.element.style.transform = `rotate(${rotation + flake.rotationSpeed}deg)`; // Cyclic movement of snowflakes

      if (flake.y > snowContainer.clientHeight) {
        snowflakes.splice(i, 1);
        flake.element.remove();
      } else {
        flake.element.style.transform = `translate3d(${flake.x}px, ${flake.y}px, 0) rotate(${rotation + flake.rotationSpeed}deg)`;
      }
    });

    if (isSnowing) requestAnimationFrame(moveSnowflakes);
  }

  function checkSnowfall() {
    if (isWinterMonth()) {
      if (!isSnowing) {
        isSnowing = true;
        setInterval(createSnowflake, 150); // Production range of snowflakes
        moveSnowflakes();
      }
    } else if (isSnowing) {
      isSnowing = false;
      snowflakes.forEach(flake => flake.element.remove());
      snowflakes.length = 0;
    }
  }

  setInterval(checkSnowfall, 3600000); // 1 hour
  checkSnowfall();
});