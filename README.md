# Actin Health PWA

## Overview

Actin Health PWA is a progressive web application (PWA) developed using **Nuxt.js**, **TypeScript**, **Pinia**, **Tailwind CSS**, and **Sass**.

## Project Structure

The project follows a standard Nuxt.js project structure, with additional configurations for TypeScript, Pinia, and styling.

- **assets**: Contains static assets like images, fonts, etc.
- **components**: Reusable Vue components.
- **layouts**: Layout components defining the overall structure of pages.
- **middleware**: Custom middleware for handling requests before rendering pages.
- **pages**: Vue pages representing different routes of the application.
- **plugins**: Nuxt.js plugins for third-party libraries and custom configurations.
- **static**: Static files that will be served as-is.
- **store**: Pinia store for state management.
- **styles**: Global styles and Sass files.
- **types**: TypeScript types and interfaces.

## Tech Stack

- **Nuxt.js**: The framework for building universal Vue.js applications.
- **TypeScript**: A superset of JavaScript with static typing for improved code quality.
- **Pinia**: A state management library for Vue.js applications.
- **Tailwind CSS**: A utility-first CSS framework for building modern and responsive designs.
- **Sass**: A powerful CSS preprocessor for styling.

## Installation

1. Clone the repository:

   ```bash
   # For http
   git clone https://git.actinhealth.ir/pwa/actin_pwa_webapp.git
   # For ssh
   git clone ssh://git@git.actinhealth.ir:2222/pwa/actin_pwa_webapp.git
   ```

2. Install dependencies:

   ```bash
   cd actin-health-pwa
   pnpm install
   ```

## Usage

### Development

Run the development server:

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production

Generate a static production site:

```bash
pnpm run generate
```

Serve the generated site:

```bash
pnpm run start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

- Nuxt.js configuration: `nuxt.config.js`
- TypeScript configuration: `tsconfig.json`
- Pinia auth store configuration: `store/auth.ts`
- Pinia survey store configuration: `store/survey.ts`
- Tailwind CSS configuration: `tailwind.config.js`

## Contributing

If you'd like to contribute to this project, please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to customize this README file based on your specific project details.