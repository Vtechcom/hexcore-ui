# HexCore UI

A modern web application built with Nuxt 3, TypeScript, and Element Plus, featuring Cardano blockchain integration.

## 🚀 Features

- **Modern Tech Stack**
  - Nuxt 3 with TypeScript
  - Vue 3 Composition API
  - Element Plus UI Framework
  - UnoCSS for utility-first CSS
  - Pinia for state management
  - VueUse for composables

- **Blockchain Integration**
  - Cardano SDK integration
  - Wallet connection
  - Transaction handling
  - Cryptographic operations

- **Developer Experience**
  - TypeScript support
  - ESLint + Prettier configuration
  - Hot Module Replacement
  - Component auto-imports
  - SVG optimization with SVGO

## 📋 Prerequisites

- Node.js (v16 or higher)
- pnpm (v9.15.4 or higher)
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hexcore-ui
```

2. Install dependencies:
```bash
pnpm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
BASE_API_URL=your_api_url_here
```

## 🚀 Development

Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Building for Production

Build the application:
```bash
pnpm build
```

Preview the production build:
```bash
pnpm preview
```

## 📁 Project Structure

```
hexcore-ui/
├── assets/          # Static assets
├── components/      # Vue components
│   ├── base/       # Base components
│   ├── layouts/    # Layout components
│   └── shared/     # Shared components
├── composables/    # Vue composables
├── constants/      # Constants and enums
├── interfaces/     # TypeScript interfaces
├── layouts/        # Page layouts
├── pages/          # Application pages
├── public/         # Public static files
├── server/         # Server-side code
├── stores/         # Pinia stores
└── utils/          # Utility functions
```

## 🧪 Testing

The project includes Nuxt Test Utils for testing. Run tests with:
```bash
pnpm test
```

## 📝 Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## 🔒 Security

- Environment variables for sensitive data
- Secure API communication
- Input validation
- XSS protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Nuxt.js](https://nuxt.com/)
- [Element Plus](https://element-plus.org/)
- [Cardano SDK](https://github.com/input-output-hk/cardano-js-sdk)
- [UnoCSS](https://unocss.dev/)
