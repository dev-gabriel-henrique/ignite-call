# Ignite Call

## 📌 Description
Ignite Call is a meeting scheduler with Google Calendar integration, developed during classes at Rocketseat. This project is educational in nature, aiming to explore technologies such as Next.js and gain experience with Google Services integration.

## 🚀 Technologies Used
- [x] Next.js
- [x] @ignite-ui
- [x] Google Services
- [x] Axios

## ⚙️ Instalação
```bash
# Clone the repository
git clone https://github.com/dev-gabriel-henrique/ignite-call

# Navigate into the project directory
cd ignite-call

# Install dependencies
npm install # or yarn install
```

▶️ Running the Project
```bash
# Start the development server
npm run dev # or yarn dev

```

🛠 Configuration
Crie um arquivo `.env` na raiz do projeto e defina as variáveis necessárias:
```env
DATABASE_URL="Your local database connection string"
DATABASE_DIRECT_URL="Your local direct database connection string"

GOOGLE_CLIENT_ID=Your Google Client ID
GOOGLE_CLIENT_SECRET=Your Google Client Secret
NEXT_AUTH_SECRET=Your NextAuth secret

```

## 📝 Estrutura do Projeto
```plaintext
/src
  |-- @types/        # TypeScript custom type definitions
  |-- assets/        # Static assets such as images
  |-- components/    # Reusable UI components
  |-- lib/           # External libraries and configurations (e.g., API, Auth)
  |-- pages/         # Application routes and page components
  |-- styles/        # Global and component-specific styles
  |-- utils/         # Utility functions and helpers

```
