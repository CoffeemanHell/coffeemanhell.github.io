document.addEventListener('DOMContentLoaded', () => {
  const snowContainer = document.getElementById('snow-container');
  const snowflakes = [];
  let isSnowing = false;

  function isWinterMonth() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    return (month === 12) ||              // Whole December
           (month === 1);                 // Whole January
  }  

  function createSnowflake() {
    if (!isWinterMonth()) return;

    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    const size = Math.random() * 5 + 2;
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    snowflake.style.left = `${Math.random() * 100}%`;
    snowflake.style.top = '-5px';
    
    const speed = Math.random() * 1 + 0.5;
    const horizontalSpeed = Math.random() * 2 - 1;
    
    snowContainer.appendChild(snowflake);
    
    snowflakes.push({
      element: snowflake,
      x: parseFloat(snowflake.style.left),
      y: parseFloat(snowflake.style.top),
      speed: speed,
      horizontalSpeed: horizontalSpeed
    });
  }

  function moveSnowflakes() {
    if (!isWinterMonth()) {
      if (isSnowing) {
        isSnowing = false;
        snowflakes.forEach(flake => flake.element.remove());
        snowflakes.length = 0;
      }
      return;
    }

    if (!isSnowing) {
      isSnowing = true;
    }

    const containerHeight = snowContainer.clientHeight;
    const containerWidth = snowContainer.clientWidth;

    snowflakes.forEach((flake, index) => {
      flake.y += flake.speed;
      flake.x += flake.horizontalSpeed;

      if (flake.y > containerHeight) {
        snowflakes.splice(index, 1);
        flake.element.remove();
      } else {
        flake.element.style.transform = `translate3d(${flake.x}px, ${flake.y}px, 0)`;
      }
    });

    requestAnimationFrame(moveSnowflakes);
  }

  // Snowfall control loop
  function checkSnowfall() {
    if (isWinterMonth()) {
      if (!isSnowing) {
        // Start snowfall
        isSnowing = true;
        setInterval(createSnowflake, 100);
        moveSnowflakes();
      }
    } else {
      isSnowing = false;
    }
  }

  // Check every hour
  setInterval(checkSnowfall, 3600000); // 3600000 ms = 1 saat

  // Do the first check when the page loads
  checkSnowfall();
});