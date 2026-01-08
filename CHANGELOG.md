# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-08

### Added
- Initial release of Teams2HA application
- Electron-based desktop application for Windows
- Microsoft Teams Desktop API integration via WebSocket
- MQTT client for Home Assistant integration
- Automatic Home Assistant entity discovery
- Modern, dark-themed user interface
- System tray integration with status indicators
- Secure credential storage with encryption
- Real-time meeting status monitoring
- Support for the following Teams states:
  - In Meeting
  - Camera On/Off
  - Microphone Muted/Unmuted
  - Hand Raised
  - Background Blurred
  - Recording Status
  - Screen Sharing Status
- Portable installation option (no admin rights required)
- User-level installer option
- Automated build and release workflow
- CodeQL security scanning
- Comprehensive documentation
- Example Home Assistant automations

### Features
- No admin rights required for installation
- Lightweight Electron-based architecture
- TLS/SSL support for MQTT connections
- WebSocket support for MQTT connections
- Certificate validation options
- Connection testing
- One-click Teams pairing
- Tab-based interface with:
  - Settings configuration
  - Teams pairing and status
  - Home Assistant entities list
  - About information

### Security
- Encrypted credential storage
- Context isolation in Electron
- Secure IPC communication
- No remote code execution
- CodeQL automated scanning

### Documentation
- Comprehensive README
- Contributing guidelines
- Security policy
- Example automations for Home Assistant
- Build and development instructions

[1.0.0]: https://github.com/loryanstrant/HA-MicrosoftTeamsDesktopAPI/releases/tag/v1.0.0
