// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const targetTab = button.dataset.tab;
    
    // Update active button
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${targetTab}-tab`).classList.add('active');
  });
});

// Load settings on startup
async function loadSettings() {
  const settings = await window.api.getSettings();
  
  if (settings.mqttHost) document.getElementById('mqttHost').value = settings.mqttHost;
  if (settings.mqttPort) document.getElementById('mqttPort').value = settings.mqttPort;
  if (settings.mqttUsername) document.getElementById('mqttUsername').value = settings.mqttUsername;
  if (settings.mqttPassword) document.getElementById('mqttPassword').value = settings.mqttPassword;
  if (settings.mqttUseTls) document.getElementById('mqttUseTls').checked = settings.mqttUseTls;
  if (settings.mqttUseWebSocket) document.getElementById('mqttUseWebSocket').checked = settings.mqttUseWebSocket;
  if (settings.mqttIgnoreCertErrors) document.getElementById('mqttIgnoreCertErrors').checked = settings.mqttIgnoreCertErrors;
}

// Save settings
document.getElementById('mqttForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const settings = {
    mqttHost: document.getElementById('mqttHost').value,
    mqttPort: parseInt(document.getElementById('mqttPort').value),
    mqttUsername: document.getElementById('mqttUsername').value,
    mqttPassword: document.getElementById('mqttPassword').value,
    mqttUseTls: document.getElementById('mqttUseTls').checked,
    mqttUseWebSocket: document.getElementById('mqttUseWebSocket').checked,
    mqttIgnoreCertErrors: document.getElementById('mqttIgnoreCertErrors').checked
  };
  
  const result = await window.api.saveSettings(settings);
  
  if (result.success) {
    showNotification('Settings saved successfully!', 'success');
  } else {
    showNotification('Failed to save settings: ' + result.error, 'error');
  }
});

// Test MQTT connection
document.getElementById('testMqttBtn').addEventListener('click', async () => {
  const testBtn = document.getElementById('testMqttBtn');
  testBtn.disabled = true;
  testBtn.textContent = 'Testing...';
  
  const settings = {
    mqttHost: document.getElementById('mqttHost').value,
    mqttPort: parseInt(document.getElementById('mqttPort').value),
    mqttUsername: document.getElementById('mqttUsername').value,
    mqttPassword: document.getElementById('mqttPassword').value,
    mqttUseTls: document.getElementById('mqttUseTls').checked,
    mqttUseWebSocket: document.getElementById('mqttUseWebSocket').checked,
    mqttIgnoreCertErrors: document.getElementById('mqttIgnoreCertErrors').checked
  };
  
  const result = await window.api.testMqtt(settings);
  
  testBtn.disabled = false;
  testBtn.textContent = 'Test Connection';
  
  if (result.success) {
    showNotification('MQTT connection successful!', 'success');
  } else {
    showNotification('MQTT connection failed: ' + result.error, 'error');
  }
});

// Pair with Teams
document.getElementById('pairTeamsBtn').addEventListener('click', async () => {
  const pairBtn = document.getElementById('pairTeamsBtn');
  const statusDiv = document.getElementById('pairingStatus');
  
  pairBtn.disabled = true;
  pairBtn.textContent = 'Pairing...';
  statusDiv.className = 'status-message info';
  statusDiv.textContent = 'Please accept the pairing request in Microsoft Teams...';
  
  const result = await window.api.pairTeams();
  
  pairBtn.disabled = false;
  pairBtn.textContent = 'Pair with Teams';
  
  if (result.success) {
    statusDiv.className = 'status-message success';
    statusDiv.textContent = 'Successfully paired with Microsoft Teams!';
  } else {
    statusDiv.className = 'status-message error';
    statusDiv.textContent = 'Pairing failed: ' + result.error;
  }
});

// Load entities
async function loadEntities() {
  const entities = await window.api.getEntities();
  const entitiesList = document.getElementById('entitiesList');
  
  entitiesList.innerHTML = entities.map(entity => `
    <div class="entity-item">
      <code>${entity}</code>
      <button class="btn-copy" data-entity="${entity}">Copy</button>
    </div>
  `).join('');
  
  // Add copy functionality
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const entity = btn.dataset.entity;
      navigator.clipboard.writeText(entity);
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
}

// Status listeners
window.api.onMqttStatus((status) => {
  const mqttStatus = document.getElementById('mqttStatus');
  const statusText = mqttStatus.querySelector('.status-text');
  
  if (status.connected) {
    mqttStatus.classList.add('connected');
    statusText.textContent = 'MQTT: Connected';
  } else {
    mqttStatus.classList.remove('connected');
    statusText.textContent = 'MQTT: Disconnected';
  }
});

window.api.onTeamsStatus((status) => {
  const teamsStatus = document.getElementById('teamsStatus');
  const statusText = teamsStatus.querySelector('.status-text');
  
  if (status.connected) {
    teamsStatus.classList.add('connected');
    statusText.textContent = 'Teams: Connected';
  } else {
    teamsStatus.classList.remove('connected');
    statusText.textContent = 'Teams: Disconnected';
  }
});

window.api.onMeetingUpdate((state) => {
  document.getElementById('inMeeting').textContent = state.isInMeeting ? 'Yes' : 'No';
  document.getElementById('cameraOn').textContent = state.isCameraOn ? 'On' : 'Off';
  document.getElementById('micMuted').textContent = state.isMuted ? 'Muted' : 'Unmuted';
  document.getElementById('handRaised').textContent = state.isHandRaised ? 'Yes' : 'No';
  document.getElementById('bgBlurred').textContent = state.isBackgroundBlurred ? 'Blurred' : 'Normal';
  document.getElementById('recording').textContent = state.isRecordingOn ? 'On' : 'Off';
  document.getElementById('screenShare').textContent = state.isSharing ? 'On' : 'Off';
  
  // Update colors based on state
  updateStatusColors(state);
});

function updateStatusColors(state) {
  const items = document.querySelectorAll('.status-item');
  items.forEach(item => {
    const value = item.querySelector('.status-value');
    const text = value.textContent;
    
    // Reset colors
    value.style.color = 'var(--text-primary)';
    
    // Apply colors based on status
    if (text === 'Yes' || text === 'On' || text === 'Unmuted') {
      value.style.color = 'var(--success-color)';
    } else if (text === 'Muted' || text === 'Blurred') {
      value.style.color = 'var(--warning-color)';
    }
  });
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `status-message ${type}`;
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.zIndex = '9999';
  notification.style.minWidth = '300px';
  notification.style.animation = 'slideIn 0.3s ease';
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Initialize
loadSettings();
loadEntities();
