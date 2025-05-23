# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm start` - Run development server
- `npm build` - Create production build
- `npm test` - Run all tests in watch mode
- `npm test -- --watchAll=false` - Run all tests once
- `npm test -- -t "test name"` - Run specific test
- `npm run eject` - Eject from Create React App (one-way operation)

## Code Style Guidelines

- React functional components with hooks preferred over class components
- Import order: React, libraries, components, styles
- Use destructuring for props
- Prefer const over let, avoid var
- Use camelCase for variables and functions, PascalCase for components
- Components in separate files, named same as their file
- Meaningful component and variable names
- Use async/await for asynchronous code
- Prefer early returns for conditionals
- Handle errors with try/catch and provide meaningful error messages
- Add PropTypes or TypeScript types for all component props
