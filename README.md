# VidyaSetu (विद्यासेतू)

VidyaSetu is a modern, premium Marathi AI Visual Learning Platform designed for Classes 1–10. It focuses on a "Visual Learning First, Concept Understanding First" approach, featuring interactive SVG diagrams, AI-driven Career Discovery (Career OS), and a premium Learning OS dashboard.

## System Requirements
- **Node.js**: v18.x or later
- **Package Manager**: [pnpm](https://pnpm.io/installation) is required (this project uses Turborepo with pnpm workspaces).

## Setup Instructions

Follow these steps to run the VidyaSetu platform on a new machine:

### 1. Clone the Repository
Open your terminal and clone the repository:
```bash
git clone https://github.com/Shivm-ops/vidyasetu-SOSM.git
cd vidyasetu-SOSM
```

### 2. Install Dependencies
Since this is a monorepo managed with Turborepo, use `pnpm` to install dependencies across all workspaces:
```bash
pnpm install
```

### 3. Run the Development Server
Start the frontend Next.js application along with any configured backend services:
```bash
pnpm dev
```

### 4. Access the Application
Once the server is running, open your browser and navigate to:
- **Main App:** [http://localhost:3000](http://localhost:3000)
- **Learning OS:** [http://localhost:3000/learning-os](http://localhost:3000/learning-os)
- **Career OS:** [http://localhost:3000/career](http://localhost:3000/career)

---

## Tech Stack Overview
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion for smooth animations
- **Package Manager:** pnpm
- **Build System:** Turborepo
