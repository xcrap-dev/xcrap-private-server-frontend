# 🕷️ Xcrap Private Server - Frontend

The official web dashboard and management interface for **Xcrap Cloud** private server instances. Built with Next.js 16, React 19, Tailwind CSS v4, and Radix UI.

---

## ✨ Features

- **🎯 Visual Parsing Model Builder**: Construct web scrapers with nested selectors, extraction attributes, regex cleaners, default values, and collapsible tree sections for high performance.
- **🔮 Real-Time Inferred Output Preview**: Dynamically estimates and visualizes the JSON output structure that the configured scraper model will produce.
- **⚡ In-Browser Scraper Execution**: Execute scrapers on demand, inspect HTTP metadata, latency/duration, and browse syntax-highlighted JSON results.
- **📦 SDK Code Generator**: Automatically produces ready-to-run TypeScript and Node.js code snippets using `@xcrap/api`, automatically injecting your logged-in user's API Key.
- **🌐 Client Management**: Group scrapers under clients, view direct REST API endpoints, and copy SDK integration snippets.
- **👥 Administrative User Management**: Manage users, assign roles (`ADMIN` / `USER`), copy IDs and API keys, and quickly create users via a modal from any screen.
- **🔍 Debounced Search & Pagination**: Real-time server-side search by name across scrapers, clients, and users with synchronized URL query parameters.
- **🌓 Dark / Light Themes**: Fully responsive, high-contrast dark theme powered by Tailwind CSS v4 and Radix UI.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **State & Data Fetching**: [TanStack Query v5](https://tanstack.com/query) & [Axios](https://axios-http.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Class-Validator](https://github.com/typestack/class-validator)
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/)
- **Code Highlighting**: [PrismJS](https://prismjs.com/)
- **Icons & Feedback**: [React Icons](https://react-icons.github.io/react-icons/), [Lucide](https://lucide.dev/), and [Sonner](https://sonner.emilkowal.ski/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `20.x` or higher
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- An active instance of the **Xcrap Backend API** (default: `http://localhost:3000/api`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/xcrap-private-server-frontend.git
   cd xcrap-private-server-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # API Backend Base URL
   NEXT_PUBLIC_API_URL=http://localhost:3000/api

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3001
   NEXTAUTH_SECRET=your-super-secret-random-jwt-key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) (or the port indicated in your terminal).

---

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router (pages, layouts, auth handlers)
│   ├── (auth)/           # Authentication pages (sign-in)
│   ├── (dashboard)/      # Protected dashboard routes (clients, scrapers, admin)
│   └── api/auth/         # NextAuth route handler
├── components/           # React components
│   ├── features/         # Feature-specific widgets (code generators, dialogs)
│   ├── layout/           # Page sections and tab layouts
│   └── ui/               # Reusable UI primitives (buttons, tables, modals)
├── dto/                  # Data Transfer Objects with validation decorators
├── enums/                # Enumerations (UserRole, SelectorType, etc.)
├── helpers/              # Config, regex, and QueryClient helpers
├── hooks/                # Custom React hooks (debounce, API key, forms)
├── services/api/         # Axios API clients for backend communication
└── utils/                # Output inference, date formatting, token utilities
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with hot-reload |
| `npm run build` | Compiles the production-ready build |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint to check for code quality issues |
| `npm run format` | Formats all code using Prettier |

---

## 🔒 Authentication Flow

1. The frontend authenticates users against the backend's `/auth/sign-in` endpoint using email and password.
2. NextAuth handles the session and signs a secure JWT cookie containing the `accessToken`.
3. To obtain the user's permanent **API Key**, the frontend decodes the session token payload to retrieve the user ID and queries `/users/:id`.
4. API keys are automatically populated in SDK code generation panels for seamless developer experience.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
