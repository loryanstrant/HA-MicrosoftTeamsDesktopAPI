# Contributing to Teams2HA

Thank you for your interest in contributing to Teams2HA! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/HA-MicrosoftTeamsDesktopAPI.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit: `git commit -m "Add your feature"`
7. Push: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

### Prerequisites

- Node.js 20 or later
- npm
- Git

### Installation

```bash
npm install
```

### Running in Development

```bash
npm start
```

### Building

```bash
npm run build
```

## Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Follow existing code style
- Add comments for complex logic

## Commit Messages

- Use clear, descriptive commit messages
- Start with a verb in present tense (Add, Fix, Update, etc.)
- Keep the first line under 72 characters
- Add detailed description if needed

Examples:
- `Add support for custom MQTT topics`
- `Fix connection timeout issue`
- `Update documentation for installation`

## Testing

Before submitting a pull request:

1. Test the application manually
2. Ensure no console errors
3. Test on Windows (primary platform)
4. Verify MQTT connection works
5. Verify Teams API integration works

## Pull Request Process

1. Update README.md with details of changes if applicable
2. Update version number following [Semantic Versioning](https://semver.org/)
3. Ensure your code follows the style guidelines
4. The PR will be merged once approved by maintainers

## Reporting Bugs

When reporting bugs, please include:

- Operating system and version
- Node.js version
- Electron version
- Teams version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Error messages or logs

## Feature Requests

Feature requests are welcome! Please:

- Check if the feature already exists
- Provide a clear description of the feature
- Explain the use case
- Describe the expected behavior

## Questions?

If you have questions, please:

1. Check existing issues
2. Check the README
3. Create a new issue with the "question" label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
