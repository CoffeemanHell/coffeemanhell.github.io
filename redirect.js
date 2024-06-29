fetch('urls.json')
  .then(response => response.json())
  .then(urls => {
    const path = window.location.pathname.substring(1); // Remove leading slash
    if (path in urls) {
      window.location.href = urls[path];
    } else {
      // Redirect to 404 page if path not found
      window.location.href = '/404.html';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    window.location.href = '/404.html';
  });