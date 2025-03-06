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
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
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

# Run end-to-end tests
ng e2e

# Lint the project
ng lint

# Generate new component
ng generate component component-name

# Generate new service
ng generate service service-name
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

Tests will execute via [Protractor](http://www.protractortest.org/).

## Best Practices

- Follow Angular style guide
- Write unit tests for components and services
- Use TypeScript features and strong typing
- Implement lazy loading for modules
- Use Angular Material for UI components

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Further Help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.io/cli).

## License

MIT License 