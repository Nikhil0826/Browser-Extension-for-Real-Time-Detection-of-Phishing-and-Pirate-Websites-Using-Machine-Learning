// Get toggle switch element
const toggleSwitch = document.getElementById('toggle-switch');

// Load current state and update UI
chrome.storage.local.get(['isEnabled'], function(result) {
  const isEnabled = result.isEnabled !== false; // Default to true if not set
  toggleSwitch.checked = isEnabled;
  updateStatusText(isEnabled);
});

// Handle toggle switch change
toggleSwitch.addEventListener('change', function() {
  const isEnabled = this.checked;
  chrome.storage.local.set({ isEnabled: isEnabled });
  updateStatusText(isEnabled);
});

// Update status text based on current state
function updateStatusText(isEnabled) {
  const statusText = document.getElementById('status-text');
  statusText.textContent = isEnabled ? 'Extension is ACTIVE' : 'Extension is INACTIVE';
  statusText.style.color = isEnabled ? 'green' : 'red';
}

// Initialize
updateStatusText(toggleSwitch.checked);