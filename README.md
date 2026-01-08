# HA-MicrosoftTeamsDesktopAPI

A lightweight desktop application that integrates between the Microsoft Teams desktop API and Home Assistant via MQTT.

[![Build and Release](https://github.com/loryanstrant/HA-MicrosoftTeamsDesktopAPI/actions/workflows/build.yml/badge.svg)](https://github.com/loryanstrant/HA-MicrosoftTeamsDesktopAPI/actions/workflows/build.yml)
[![GitHub release](https://img.shields.io/github/v/release/loryanstrant/HA-MicrosoftTeamsDesktopAPI)](https://github.com/loryanstrant/HA-MicrosoftTeamsDesktopAPI/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- 🚀 **No Admin Rights Required** - Portable and user-level installation options
- 🎨 **Modern UI** - Clean, dark-themed interface with real-time status updates
- 🔒 **Secure** - Encrypted credential storage
- 📡 **MQTT Integration** - Automatic Home Assistant discovery
- 🔄 **Real-time Updates** - Live meeting status monitoring
- 💾 **Lightweight** - Built with Electron for minimal resource usage
- 📦 **Easy Installation** - Download and run, no dependencies to install

## Download

Download the latest release from the [Releases page](https://github.com/loryanstrant/HA-MicrosoftTeamsDesktopAPI/releases).

Two installation options are available:
- **Portable** (.exe) - No installation required, run from anywhere (no admin rights needed)
- **Installer** (.exe) - Traditional installer with optional desktop shortcut (can install per-user)

## Prerequisites

1. **Microsoft Teams Desktop Application** - Must be installed and running
2. **Teams API Enabled** - Settings → Privacy → Manage API → Enable
3. **Home Assistant** - With MQTT broker configured
4. **MQTT Broker** - Running and accessible from your computer

## Quick Start

### 1. Enable Teams API

1. Open Microsoft Teams
2. Go to Settings (⚙️)
3. Navigate to Privacy
4. Scroll to the bottom
5. Click "Manage API"
6. Enable the API

### 2. Configure MQTT

1. Launch Teams2HA
2. Go to the **Settings** tab
3. Enter your MQTT broker details:
   - Host: Your MQTT broker IP address (e.g., 192.168.1.100)
   - Port: Usually 1883 (or 8883 for TLS)
   - Username: Your MQTT username
   - Password: Your MQTT password
4. Configure optional settings:
   - Use TLS/SSL for encrypted connections
   - Use WebSocket if your broker requires it
5. Click **Test Connection** to verify
6. Click **Save Settings**

### 3. Pair with Teams

1. Start a Teams meeting (use "Meet Now" for testing)
2. Go to the **Teams** tab
3. Click **Pair with Teams**
4. Accept the pairing request in Microsoft Teams
5. Wait for confirmation

### 4. Verify Home Assistant Integration

The application will automatically create the following entities in Home Assistant:

- `sensor.teams_availability` - Current availability status
- `binary_sensor.teams_in_meeting` - Whether you're in a meeting
- `binary_sensor.teams_camera_on` - Camera status
- `binary_sensor.teams_microphone_muted` - Microphone status
- `binary_sensor.teams_hand_raised` - Hand raised status
- `binary_sensor.teams_background_blurred` - Background blur status
- `binary_sensor.teams_recording` - Recording status
- `binary_sensor.teams_screen_sharing` - Screen sharing status

## System Tray

The application minimizes to the system tray. Right-click the tray icon for options:

- **Show App** - Open the main window
- **Pair with Teams** - Initiate pairing
- **Reconnect** - Reconnect services
- **Quit** - Exit the application

## Building from Source

### Requirements

- Node.js 20 or later
- npm

### Build Instructions

```bash
# Clone the repository
git clone https://github.com/loryanstrant/HA-MicrosoftTeamsDesktopAPI.git
cd HA-MicrosoftTeamsDesktopAPI

# Install dependencies
npm install

# Run in development mode
npm start

# Build for Windows
npm run dist
```

Built applications will be in the `dist/` directory.

## Technology Stack

- **Electron** - Cross-platform desktop application framework
- **Node.js** - JavaScript runtime
- **MQTT.js** - MQTT client library
- **WebSocket** - For Teams API communication
- **Electron Store** - Secure settings storage

## Troubleshooting

### Teams API not connecting

1. Ensure Teams is running
2. Verify API is enabled in Teams settings
3. Try restarting Teams
4. Re-pair the application with Teams

### MQTT connection failed

1. Verify MQTT broker is running
2. Check firewall settings
3. Verify credentials are correct
4. Test connection using MQTT Explorer or similar tool

### Application not starting

1. Check that no other instance is running
2. Delete settings: `%APPDATA%/teams2ha/config.json`
3. Try running as portable version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [TEAMS2HA](https://github.com/jimmyeao/TEAMS2HA)
- Uses the Microsoft Teams Local API
- Built for the Home Assistant community

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/loryanstrant/HA-MicrosoftTeamsDesktopAPI/issues) page
2. Create a new issue with:
   - Your operating system
   - Teams version
   - Error messages or logs
   - Steps to reproduce

