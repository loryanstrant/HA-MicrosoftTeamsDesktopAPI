# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to the repository owner or create a private security advisory on GitHub.

**Please do not report security vulnerabilities through public GitHub issues.**

Include the following information:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability

## Security Measures

This application implements the following security measures:

1. **Encrypted Storage**: Credentials are encrypted before being stored locally
2. **Context Isolation**: Renderer processes are isolated from Node.js/Electron APIs
3. **Secure IPC**: Communication between main and renderer processes uses secure IPC channels
4. **No Remote Code Execution**: Application does not execute remote code
5. **TLS Support**: MQTT connections support TLS/SSL encryption
6. **CodeQL Scanning**: Automated security scanning on every commit

## Best Practices

When using this application:

1. Always use TLS/SSL for MQTT connections when possible
2. Use strong passwords for MQTT credentials
3. Keep the application updated to the latest version
4. Do not share your Teams API token
5. Review MQTT broker security settings
6. Use certificate validation (avoid ignoring certificate errors)

## Update Process

Security updates are released as soon as possible after a vulnerability is confirmed. Updates are distributed through:

1. GitHub Releases
2. Automatic update notifications (if enabled)

## Disclosure Policy

We follow a coordinated disclosure policy:

1. Security issue is reported privately
2. Issue is confirmed and a fix is developed
3. Fix is released
4. Public disclosure is made after users have had time to update
