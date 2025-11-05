# Personal Journal 📔

A full-stack journaling app with mood tracking, todo lists, and customizable themes.

**Live Demo:** [https://journal-three-eta.vercel.app/](https://journal-three-eta.vercel.app/)

## 🛠️ Technologies Used

**Frontend:** Next.js , TypeScript, shadcn/ui, Tailwind CSS , next-themes  
**Backend:** Next.js API Routes, MongoDB, Mongoose  
**Deployment:** Vercel

##  Setup Instructions

1. **Clone and install**
   ```bash
   git clone https://github.com/aastha-0110/Journal.git
   cd Journal
   npm install
   ```

2. **Configure environment variables**
   
   Create `.env.local`:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Features

- **Authentication** - Secure login/signup system
- **Journal Entries** - Create, edit, delete entries with mood tracking
- **Todo Lists** - Task management with priority levels
- **Light/Dark Mode** - Theme switching with localStorage persistence
- **Responsive Design** - Works on all devices
- **SSR** - Server-side rendering with Next.js

# Brief Implementation Description

-Implemented Light and Dark Mode using next-themes and persisted theme preference with localStorage.
-Built with Next.js (MERN stack) — API Routes handle database interactions via Mongoose.
-Supports user authentication, journal entries, mood tracking, and to-do lists.
-Fully responsive and uses shadcn/ui components for a modern, consistent UI.
-Deployed on Vercel with environment configuration for MongoDB Atlas.

##  Usage

1. Create account via "Login / Sign Up"
2. Write journal entries with mood tracking
3. Toggle light/dark mode using the theme button
4. Manage tasks in the todo section

##  Deployment

Deployed on Vercel with automatic deployments from GitHub. MongoDB hosted on MongoDB Atlas.

---

Built with Next.js, TypeScript, and MongoDB by [@aastha-0110](https://github.com/aastha-0110)
