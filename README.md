# Hydra Manager - HexCore UI

A modern web application built with Nuxt 3, TypeScript, and Element Plus for managing Hydra nodes and interacting with the Cardano blockchain.

## 🌊 About Hydra Protocol

Hydra is a layer 2 scaling solution for the Cardano blockchain that enables high-throughput, low-latency transactions with minimal fees. This UI provides tools for:

- Setting up and managing Hydra nodes
- Monitoring Hydra Head state
- Initiating and participating in Hydra Heads
- Managing transactions within Hydra Heads
- Interacting with the Cardano blockchain

## 🚀 Features

- **Modern Tech Stack**
  - Nuxt 3 with TypeScript
  - Vue 3 Composition API
  - Element Plus UI Framework
  - UnoCSS for utility-first CSS
  - Pinia for state management
  - VueUse for composables

- **Hydra & Blockchain Integration**
  - Cardano SDK integration (@cardano-sdk/core)
  - Hydra node management
  - Wallet connection and management
  - Transaction handling
  - Cryptographic operations (using @cardano-sdk/crypto)

- **Developer Experience**
  - TypeScript support
  - ESLint + Prettier configuration
  - Hot Module Replacement
  - Component auto-imports
  - SVG optimization with SVGO

## 📋 Prerequisites

- Node.js (v20 or higher)
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
NUXT_PUBLIC_BASE_URL=your_base_url_here
NUXT_PUBLIC_HYDRA_NODE_PROXY_PATTERN=your_hydra_node_proxy_pattern
NUXT_PUBLIC_HYDRA_NODE_PROXY_SSL=true
```

## 🚀 Development

Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### IDE Setup

For the best development experience, we recommend:
- [VSCode](https://code.visualstudio.com/) with the following extensions:
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)
  - [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 🏗️ Building for Production

Build the application:
```bash
pnpm build
```

Preview the production build:
```bash
pnpm preview
```

## 🚢 Deployment

The project includes a deployment script that can be used to deploy the application:

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

This script will:
1. Check for and use the correct Node.js version
2. Install dependencies
3. Build the application
4. Set up PM2 to serve the application on port 3000

## 📁 Project Structure

```
hexcore-ui/
├── assets/          # Static assets
│   ├── icons/      # SVG icons
│   └── scss/       # SCSS styles
├── components/      # Vue components
│   ├── base/       # Base components
│   ├── consumer/   # Consumer-specific components
│   ├── layouts/    # Layout components
│   └── shared/     # Shared components
├── composables/    # Vue composables
├── configs/        # Configuration files
├── constants/      # Constants and enums
├── interfaces/     # TypeScript interfaces
│   ├── api/        # API interfaces
│   ├── cardano/    # Cardano-related interfaces
│   └── hydra/      # Hydra-related interfaces
├── layouts/        # Page layouts
├── middleware/     # Nuxt middleware
├── pages/          # Application pages
├── plugins/        # Nuxt plugins
├── public/         # Public static files
│   └── images/     # Public images
├── server/         # Server-side code
│   ├── api/        # API endpoints
│   ├── data/       # Server data
│   └── utils/      # Server utilities
├── stores/         # Pinia stores
└── utils/          # Utility functions
    └── cardano/    # Cardano-specific utilities
```

## 🧪 Testing

The project includes Nuxt Test Utils for testing:
```bash
# Run unit tests
pnpm test:unit

# Run end-to-end tests
pnpm test:e2e
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
- Cryptographic operations using Cardano SDK
- Secure wallet management

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
- [Hydra Protocol](https://hydra.family/)
- [VueUse](https://vueuse.org/)
