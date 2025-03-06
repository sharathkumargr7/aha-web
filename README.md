# Aha Web

Frontend application for the Aha Music project built with Angular.

## Prerequisites

- Node.js (latest LTS version)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

## Getting Started

### Installation

```bash
cd aha-web
npm install
```

### Development Server

```bash
ng serve
```

The application will start on `http://localhost:4200`

### Building for Production

```bash
ng build --configuration production
```

## Project Structure

```
aha-web/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   └── shared/
│   ├── assets/
│   ├── environments/
│   └── styles/
├── .eslintrc.json
├── .prettierrc
├── .prettierignore
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Code Quality Tools

### ESLint

The project uses ESLint for TypeScript and HTML files. Configuration can be found in `.eslintrc.json`.

```bash
# Run linting
npm run lint
```

### Prettier

Prettier is configured for code formatting. Configuration is in `.prettierrc`:

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "auto"
}
```

```bash
# Format code
npm run format
```

### Husky and lint-staged

The project uses Husky for Git hooks and lint-staged for running scripts on staged files.

Pre-commit hook will:
- Run Prettier on all staged files
- Run ESLint on TypeScript and HTML files
- Format SCSS/CSS files with Prettier

Configuration in package.json:
```json
{
  "lint-staged": {
    "src/**/*.{ts,html}": [
      "prettier --write",
      "eslint --fix"
    ],
    "src/**/*.{css,scss}": [
      "prettier --write"
    ]
  }
}
```

## Features

- View music data
- Search and filter functionality
- Responsive design

## Integration with API

The web application connects to the Aha API running on `http://localhost:8080`

## Available Scripts

```bash
# Start development server
ng serve

# Build for production
ng build --configuration production

# Run tests
ng test

# Run linting
ng lint

# Format code
npm run format

# Run end-to-end tests
ng e2e
```

## Environment Configuration

Update environment files in `src/environments/`:

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'http://your-production-api-url'
};
```

## Code Scaffolding

Run `ng generate` to generate new components. You can also use:
- `ng generate directive`
- `ng generate pipe`
- `ng generate service`
- `ng generate class`
- `ng generate guard`
- `ng generate interface`
- `ng generate enum`

## Running Unit Tests

```bash
ng test
```

Tests will execute via [Karma](https://karma-runner.github.io) in a browser.

## Running End-to-End Tests

```bash
ng e2e
```

Tests will execute via [Cypress](https://www.cypress.io/).

## Best Practices

- Follow Angular style guide
- Write unit tests for components and services
- Use TypeScript features and strong typing
- Implement lazy loading for modules
- Use Angular Material for UI components
- Follow ESLint rules and Prettier formatting
- Commit code that passes all pre-commit hooks

## Dependencies

### Main Dependencies
- Angular 17.1.0
- AG Grid Angular 31.0.1
- RxJS 7.8.0

### Development Dependencies
- ESLint 8.56.0
- Prettier 3.2.4
- Husky 8.0.3
- lint-staged 15.2.0

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Ensure all tests pass and code is formatted
4. Submit a pull request

## Further Help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.io/cli).

## License

MIT License 