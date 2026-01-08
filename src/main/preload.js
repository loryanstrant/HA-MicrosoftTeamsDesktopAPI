const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  pairTeams: () => ipcRenderer.invoke('pair-teams'),
  testMqtt: (settings) => ipcRenderer.invoke('test-mqtt', settings),
  getEntities: () => ipcRenderer.invoke('get-entities'),
  
  // Event listeners
  onMqttStatus: (callback) => {
    ipcRenderer.on('mqtt-status', (event, data) => callback(data));
  },
  onTeamsStatus: (callback) => {
    ipcRenderer.on('teams-status', (event, data) => callback(data));
  },
  onMeetingUpdate: (callback) => {
    ipcRenderer.on('meeting-update', (event, data) => callback(data));
  }
});
