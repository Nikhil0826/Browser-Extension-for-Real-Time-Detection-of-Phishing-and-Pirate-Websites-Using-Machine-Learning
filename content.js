// content.js

// This script runs on every page
console.log('Content script loaded.');

// Function to display a warning message
function displayWarning(url, classification) {
  // Create a warning banner
  const warningBanner = document.createElement('div');
  warningBanner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: red;
    color: white;
    text-align: center;
    padding: 10px;
    font-size: 16px;
    z-index: 10000;
  `;
  warningBanner.textContent = `WARNING: This website (${url}) has been classified as ${classification}. Proceed with caution!`;

  // Add the banner to the page
  document.body.prepend(warningBanner);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "classifyResult") {
      const url = request.url;
      const classification = request.classification;

      if (classification === 'phishing' || classification === 'pirate') {
        displayWarning(url, classification);
      }
    }
  }
);