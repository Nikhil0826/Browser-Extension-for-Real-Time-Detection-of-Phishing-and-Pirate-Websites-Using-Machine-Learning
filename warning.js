document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const unsafeUrl = urlParams.get('url');
  const classification = urlParams.get('classification');

  document.getElementById('unsafeUrl').textContent = unsafeUrl || 'Unknown';
  document.getElementById('classification').textContent = classification || 'unsafe';

  if (unsafeUrl) {
    const searchLink = `https://www.google.com/search?q=${encodeURIComponent(unsafeUrl)}`;
    const searchGoogleBtn = document.createElement('a');
    searchGoogleBtn.href = searchLink;
    searchGoogleBtn.target = '_blank';
    searchGoogleBtn.className = 'btn';
    searchGoogleBtn.textContent = 'Search on Google';
    document.querySelector('.btn-group').appendChild(searchGoogleBtn);
  }
});