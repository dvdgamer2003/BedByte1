# Contributing to GetBeds-Clone

Thank you for your interest in contributing to GetBeds-Clone! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow project guidelines

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Create a detailed issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Check if the feature has been requested
2. Create an issue describing:
   - The problem you're trying to solve
   - Your proposed solution
   - Any alternatives considered
   - Mockups or examples if applicable

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

**Code Style:**
- Follow existing code style
- Use TypeScript types properly
- Add comments for complex logic
- Keep functions small and focused

**Naming Conventions:**
- Use camelCase for variables and functions
- Use PascalCase for components and classes
- Use UPPER_SNAKE_CASE for constants
- Be descriptive with names

**Testing:**
- Test your changes locally
- Ensure existing features still work
- Add tests for new features (when applicable)

**Documentation:**
- Update README if needed
- Add JSDoc comments for functions
- Update API documentation
- Include usage examples

### Commit Message Format

```
type(scope): brief description

Detailed explanation if needed

Fixes #123
```

**Types:**
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting)
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

### Project Structure

```
getbeds-clone/
├── server/           # Backend Express API
│   ├── src/
│   │   ├── config/   # Database, Redis config
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── sockets/
│   │   └── index.ts
├── client/           # Frontend React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── utils/
│   │   └── App.tsx
└── docker/           # Docker configs
```

### Areas for Contribution

**High Priority:**
- [ ] Unit tests for controllers
- [ ] Integration tests
- [ ] Load testing scripts
- [ ] Better error handling
- [ ] Input validation improvements
- [ ] Accessibility improvements
- [ ] Mobile responsive design enhancements

**Features:**
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Payment integration
- [ ] Medical records management
- [ ] Prescription management
- [ ] Appointment scheduling
- [ ] Multi-language support
- [ ] Analytics dashboard

**Technical Improvements:**
- [ ] Database query optimization
- [ ] Caching strategy improvements
- [ ] Socket.io Redis adapter
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Logging improvements
- [ ] Monitoring setup

### Setting Up Development Environment

See [SETUP.md](SETUP.md) for detailed setup instructions.

### Questions?

- Open an issue for questions
- Join discussions
- Check existing documentation
- Contact: [divyeshravane21543@gmail.com](mailto:divyeshravane21543@gmail.com)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to GetBeds-Clone! 🎉
