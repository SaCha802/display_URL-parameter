document.addEventListener('DOMContentLoaded', function() {
  // Parse URL parameters
  const params = new URLSearchParams(window.location.search);
  const message = params.get('message');

  // Display message in output div
  if (message) {
    document.getElementById('output').innerText = message;
  } else {
    document.getElementById('output').innerText = 'No message found in URL parameters.';
  }
});
