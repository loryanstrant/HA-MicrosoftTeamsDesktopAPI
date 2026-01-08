# Teams2HA User Interface

## Main Application Window

The Teams2HA application features a modern, dark-themed interface with the following key components:

### Header
- **Left**: Application logo and name "Teams2HA"
- **Right**: Real-time status indicators
  - 🟢 Teams: Connected/Disconnected (green dot when connected)
  - 🟢 MQTT: Connected/Disconnected (green dot when connected)

### Navigation Tabs
Four main tabs for easy navigation:
1. **Settings** - Configure MQTT connection
2. **Teams** - Pair with Teams and view meeting status
3. **Entities** - View Home Assistant entities created
4. **About** - Application information and documentation

---

## Settings Tab

### MQTT Configuration Card
A clean form with the following fields:
- **MQTT Broker Host** (text input) - e.g., "192.168.1.100"
- **Port** (number input) - default: 1883
- **Username** (text input) - MQTT username
- **Password** (password input) - Masked input for security
- **Use TLS/SSL** (checkbox) - Enable encrypted connection
- **Use WebSocket** (checkbox) - Use WebSocket protocol
- **Ignore Certificate Errors** (checkbox) - For self-signed certs

**Action Buttons:**
- 🔘 Test Connection (secondary button) - Validates MQTT settings
- 🔵 Save Settings (primary button) - Saves and applies configuration

---

## Teams Tab

### Microsoft Teams Pairing Card
Information box with instructions:
- ℹ️ Before pairing checklist:
  - Make sure Microsoft Teams is running
  - Enable the API in Teams settings
  - Start a test meeting (use "Meet Now" feature)

**Pairing Status**: Shows success/error messages after pairing attempt

**Action Button:**
- 🔵 Pair with Teams - Initiates pairing process

### Current Meeting Status Card
Real-time status grid showing:
- **In Meeting**: Yes/No (green when active)
- **Camera**: On/Off (green when on)
- **Microphone**: Muted/Unmuted (orange when muted)
- **Hand Raised**: Yes/No
- **Background**: Blurred/Normal
- **Recording**: On/Off
- **Screen Share**: On/Off

Each status item displays in a bordered card with label and value.

---

## Entities Tab

### Home Assistant Entities Card
List of all entities created in Home Assistant:
- Each entity shown in a row with monospace font
- Copy button next to each entity
- Clicking copy provides visual feedback ("Copied!")

Entities listed:
```
sensor.teams_availability                    [Copy]
binary_sensor.teams_in_meeting              [Copy]
binary_sensor.teams_camera_on               [Copy]
binary_sensor.teams_microphone_muted        [Copy]
binary_sensor.teams_hand_raised             [Copy]
binary_sensor.teams_background_blurred      [Copy]
binary_sensor.teams_recording               [Copy]
binary_sensor.teams_screen_sharing          [Copy]
```

---

## About Tab

### About Teams2HA Card
- Version information
- Feature list with checkmarks
- Requirements section
- License information
- Links to:
  - GitHub Repository
  - Report Issue

---

## System Tray

Right-click menu in Windows system tray:
- **Show App** - Opens main window
- **Status** - Shows current connection status
- **Pair with Teams** - Quick pairing
- **Reconnect** - Reconnect all services
- **Quit** - Exit application

---

## Design Features

### Color Scheme
- **Primary**: #6264a7 (Microsoft Teams purple)
- **Background**: #1e1e1e to #252525 gradient
- **Cards**: #2d2d2d with subtle borders
- **Text**: White primary, #b3b3b3 secondary
- **Success**: #92c353 (green)
- **Warning**: #ffaa44 (orange)
- **Error**: #d13438 (red)

### Animations
- Smooth tab transitions with fade-in effect
- Pulsing status dots
- Button hover effects with slight elevation
- Notification slide-in from right side

### Typography
- Font: Segoe UI (native Windows font)
- Clean, readable spacing
- Consistent sizing hierarchy

### Responsive Design
- Minimum window size: 800x600
- Cards adapt to window size
- Form inputs use full width
- Grid layouts for status items

---

## User Experience Highlights

✨ **Modern & Clean**: Dark theme reduces eye strain
✨ **Intuitive**: Tab-based navigation is familiar and easy
✨ **Informative**: Real-time status updates keep you informed
✨ **Secure**: Password fields are masked, credentials encrypted
✨ **Helpful**: Tooltips and instructions guide the user
✨ **Responsive**: Immediate visual feedback for all actions
✨ **Professional**: Polished appearance suitable for business use
