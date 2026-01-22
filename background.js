// background.js

// Load the model
let model;

async function loadModel() {
  // Load the model from model.json
  try {
    const response = await fetch('model.json');
    model = await response.json();
    console.log('Model loaded successfully.');
  } catch (error) {
    console.error('Error loading model:', error);
  }
}

loadModel();

// Function to classify a URL
async function classifyURL(url) {
  if (!model) {
    console.warn('Model not loaded yet.');
    return 'unknown';
  }

  // Implement feature extraction from the URL
  const features = extractFeatures(url);

  // Implement prediction using the model
  let prediction = predict(features, model);

  console.log(`URL: ${url}, Prediction: ${prediction}`);
  return prediction;
}

// Function to extract features from a URL
function extractFeatures(url) {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;
    return {
      length_url: url.length,
      length_hostname: hostname.length,
      nb_dots: hostname.split('.').length - 1,
      nb_hyphens: hostname.split('-').length - 1,
      nb_at: url.split('@').length - 1,
      nb_qm: url.split('?').length - 1,
      nb_and: url.split('&').length - 1,
      nb_eq: url.split('=').length - 1,
      nb_underscore: url.split('_').length - 1,
      nb_slash: url.split('/').length - 1,
      nb_colon: url.split(':').length - 1,
      nb_www: hostname.startsWith('www.') ? 1 : 0,
      nb_com: hostname.endsWith('.com') ? 1 : 0,
      http_in_path: url.includes('http://') ? 1 : 0,
      https_token: url.startsWith('https') ? 1 : 0,
      ratio_digits_url: (url.match(/\d/g) || []).length / url.length,
      ratio_digits_host: (hostname.match(/\d/g) || []).length / hostname.length,
      punycode: hostname.startsWith('xn--') ? 1 : 0,
      port: parsedURL.port ? 1 : 0,
      nb_subdomains: hostname.split('.').length - 2,
      prefix_suffix: hostname.includes('-') ? 1 : 0,
      shortening_service: 0
    };
  } catch (e) {
    console.error("Error extracting features:", e);
    return null;
  }
}

function isIPAddress(hostname) {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(hostname);
}


function predict(features, model) {
  if (!features || !model) return 'unknown';

  let z = model.intercept;

  // Loop through each feature in the same order as model.features
  for (let i = 0; i < model.features.length; i++) {
    const featureName = model.features[i];
    const coefficient = model.coefficients[i];
    const value = features[featureName] || 0;
    z += coefficient * value;
  }

  // Sigmoid activation
  const probability = 1 / (1 + Math.exp(-z));

  return probability >= 0.7 ? 'phishing' : 'safe';
}


// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url && tab.url.startsWith('http')) {
    // Check if extension is enabled
    const result = await chrome.storage.local.get(['isEnabled']);
    const isEnabled = result.isEnabled !== false; // Default to true if not set

    if (isEnabled) {
      const url = tab.url;
      const classification = await classifyURL(url);

      if (classification === 'phishing') {
        console.warn(`Detected phishing URL: ${url}, classified as ${classification}. Redirecting...`);
        chrome.tabs.update(tabId, { url: chrome.runtime.getURL("warning.html?url=" + encodeURIComponent(url) + "&classification=" + encodeURIComponent(classification)) });
      }
    }
  }
});

console.log('Background script loaded.');