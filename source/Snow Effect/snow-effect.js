document.addEventListener('DOMContentLoaded', () => {
  const snowContainer = document.getElementById('snow-container');
  const snowflakes = [];
  let isSnowing = false;

  const isWinterMonth = () => [12, 1].includes(new Date().getMonth() + 1); // Date

  function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    const size = Math.random() * 5 + 2;
    snowflake.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: -5px;
    `;

    snowflakes.push({
      element: snowflake,
      x: parseFloat(snowflake.style.left),
      y: parseFloat(snowflake.style.top),
      speed: Math.random() * 1 + 0.5,
      horizontalSpeed: Math.random() * 2 - 1,
    });

    snowContainer.appendChild(snowflake);
  }

  function moveSnowflakes() {
    snowflakes.forEach((flake, i) => {
      flake.y += flake.speed;
      flake.x += flake.horizontalSpeed;

      if (flake.y > snowContainer.clientHeight) {
        snowflakes.splice(i, 1);
        flake.element.remove();
      } else {
        flake.element.style.transform = `translate3d(${flake.x}px, ${flake.y}px, 0)`;
      }
    });

    if (isSnowing) requestAnimationFrame(moveSnowflakes);
  }

  function checkSnowfall() {
    if (isWinterMonth()) {
      if (!isSnowing) {
        isSnowing = true;
        setInterval(createSnowflake, 100);
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