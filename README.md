# 🪐 DevScope — GitHub Developer Intelligence Analyzer

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**DevScope** is a high-performance, production-grade intelligence platform that transforms raw GitHub data into actionable developer insights. Built for technical recruiters, engineering managers, and developers, it provides deep analysis of coding patterns, repository health, and technical skill sets.

[**Explore the PRD**](./project-docs/PRD.md) | [**Tech Stack**](./project-docs/TechStack.md) | [**UI/UX Design**](./project-docs/UIUX.md)

---

## ✨ Key Features

-   **🚀 Instant Analysis:** Deep-dive into any GitHub profile with real-time data fetching.
-   **📊 Advanced Scoring:** Proprietary algorithms for Overall, Activity, Engagement, and Quality scores.
-   **🛡️ Multi-Tier Caching:** Redis and Database-level caching for sub-second repeat lookups.
-   **📈 Visual Analytics:** Interactive charts using Recharts and Framer Motion for a premium feel.
-   **🤖 Skill Radar:** Automated skill detection based on commit patterns and language distribution.
-   **⚡ Performance First:** Next.js 15 with React Server Components (RSC) and Turbopack.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI:** Tailwind CSS 4.0 + Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js + Express + TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (supports SQLite for local dev)
- **Cache:** Redis

---

## 🏗️ Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm

### 1. Setup Environment
```bash
# Clone the repository
git clone https://github.com/fahamgeer177/DevScope.git
cd devscope

# Install dependencies
npm install
```

### 2. Configuration
Create a `.env` file in `apps/backend` and `apps/frontend`:

**Backend (.env):**
```env
PORT=3002
DATABASE_URL="file:./dev.db" # Local SQLite
GITHUB_TOKEN=your_github_token
JWT_SECRET=your_jwt_secret
```

### 3. Run Development Server
```bash
npm run dev
```
- Frontend: `http://localhost:3000`
- API Reference: `http://localhost:3002/api`

---

## 📁 Project Structure

```text
├── apps/
│   ├── frontend/       # Next.js 15 Application
│   └── backend/        # Express.js API
├── packages/
│   └── shared/         # Shared Types & Constants
├── project-docs/       # PRD, Architecture, and UI/UX docs
└── docker-compose.yml  # Container orchestration
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Built with ❤️ by the DevScope Team</p>
