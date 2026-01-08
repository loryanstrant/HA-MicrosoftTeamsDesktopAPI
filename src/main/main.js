const { app, BrowserWindow, Tray, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { machineIdSync } = require('node-machine-id');
const TeamsAPIClient = require('./teamsapi');
const MqttClient = require('./mqtt');

// Enable better error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Generate encryption key based on machine ID for better security
const deviceId = machineIdSync();
const encryptionKey = `teams2ha-${deviceId.substring(0, 32)}`;
const store = new Store({ encryptionKey });

let mainWindow = null;
let tray = null;
let teamsClient = null;
let mqttClient = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../../assets/icon.ico'),
    show: false,
    backgroundColor: '#1e1e1e'
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        } else {
          createWindow();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Status',
      sublabel: 'Not Connected',
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Pair with Teams',
      click: () => {
        if (teamsClient) {
          teamsClient.requestPairing();
        }
      }
    },
    {
      label: 'Reconnect',
      click: () => {
        reconnectServices();
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Teams2HA - Not Connected');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
}

function initializeServices() {
  const settings = store.get('settings', {});
  
  if (settings.mqttHost) {
    mqttClient = new MqttClient(settings);
    mqttClient.on('connected', () => {
      updateTrayStatus('MQTT Connected');
      if (mainWindow) {
        mainWindow.webContents.send('mqtt-status', { connected: true });
      }
    });
    mqttClient.on('error', (error) => {
      console.error('MQTT Error:', error);
      if (mainWindow) {
        mainWindow.webContents.send('mqtt-status', { connected: false, error: error.message });
      }
    });
    mqttClient.connect();
  }

  teamsClient = new TeamsAPIClient();
  teamsClient.on('connected', () => {
    updateTrayStatus('Teams Connected');
    if (mainWindow) {
      mainWindow.webContents.send('teams-status', { connected: true });
    }
  });
  teamsClient.on('meeting-update', (state) => {
    console.log('Meeting update:', state);
    if (mqttClient && mqttClient.isConnected()) {
      mqttClient.publishMeetingState(state);
    }
    if (mainWindow) {
      mainWindow.webContents.send('meeting-update', state);
    }
  });
  teamsClient.on('error', (error) => {
    console.error('Teams API Error:', error);
    if (mainWindow) {
      mainWindow.webContents.send('teams-status', { connected: false, error: error.message });
    }
  });
  
  const token = store.get('teamsToken');
  if (token) {
    teamsClient.connect(token);
  }
}

function reconnectServices() {
  if (teamsClient) {
    teamsClient.disconnect();
  }
  if (mqttClient) {
    mqttClient.disconnect();
  }
  setTimeout(() => {
    initializeServices();
  }, 1000);
}

function updateTrayStatus(status) {
  if (tray) {
    tray.setToolTip(`Teams2HA - ${status}`);
    const contextMenu = tray.getContextMenu();
    if (contextMenu) {
      contextMenu.items[2].sublabel = status;
      tray.setContextMenu(contextMenu);
    }
  }
}

// IPC Handlers
ipcMain.handle('get-settings', () => {
  return store.get('settings', {});
});

ipcMain.handle('save-settings', (event, settings) => {
  store.set('settings', settings);
  reconnectServices();
  return { success: true };
});

ipcMain.handle('pair-teams', async () => {
  if (!teamsClient) {
    teamsClient = new TeamsAPIClient();
  }
  
  try {
    const token = await teamsClient.requestPairing();
    store.set('teamsToken', token);
    return { success: true, token };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('test-mqtt', async (event, settings) => {
  try {
    const testClient = new MqttClient(settings);
    await testClient.testConnection();
    testClient.disconnect();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-entities', () => {
  return [
    'sensor.teams_availability',
    'binary_sensor.teams_in_meeting',
    'binary_sensor.teams_camera_on',
    'binary_sensor.teams_microphone_muted',
    'binary_sensor.teams_hand_raised',
    'binary_sensor.teams_background_blurred',
    'binary_sensor.teams_recording',
    'binary_sensor.teams_screen_sharing'
  ];
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  createTray();
  initializeServices();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Don't quit on window close, keep running in tray
});

app.on('before-quit', () => {
  app.isQuitting = true;
  if (teamsClient) {
    teamsClient.disconnect();
  }
  if (mqttClient) {
    mqttClient.disconnect();
  }
});
