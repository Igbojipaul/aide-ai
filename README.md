# 📝 Aide AI — AI-Powered Blog & Content Generator

Aide AI is a **Next.js 14 (App Router)** project that helps you generate platform-optimized blog posts and social content with AI.  
It uses **Clerk** for authentication, **MongoDB Atlas** for storage, and **Gemini (Google AI)** for text generation.

---

## ✨ Features

- 🔐 **Authentication** — Secure sign-in / sign-up with Clerk  
- 🤖 **AI-Powered Writing** — Generate platform-specific posts (LinkedIn, Twitter, Medium, Instagram, etc.)  
- 🗂️ **Conversation Memory** — Continue chats with full context  
- 📑 **Markdown Support** — AI content is rendered beautifully with markdown & Tailwind Typography  
- 💾 **Database Integration** — Store users, conversations, and AI responses in MongoDB  
- 🎨 **Modern UI** — Styled with TailwindCSS + ShadCN/UI + Lucide Icons  

---

## 🛠️ Tech Stack

- [Next.js 14 (App Router)](https://nextjs.org/)  
- [Clerk](https://clerk.com/) — Authentication & user management  
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud database  
- [Mongoose](https://mongoosejs.com/) — ODM for MongoDB  
- [Gemini API](https://ai.google.dev/) — AI content generation  
- [TailwindCSS](https://tailwindcss.com/) + [ShadCN/UI](https://ui.shadcn.com/) — UI components  
- [Lucide Icons](https://lucide.dev/) — Modern SVG icons  

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/aide-ai.git
cd aide-ai

2. Install Dependencies
npm install

3. Environment Variables

Create a .env.local file and add:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key


4. Run Development Server
npm run dev

Visit http://localhost:3000
 🚀

 📂 Project Structure

├── .next/               
├── app/               # Next.js App Router pages
│   ├── sign-in/       # Clerk sign-in
│   ├── sign-up/       # Clerk sign-up
│   ├── chat/     # Protected user dashboard
│   └── api/           # API routes (AI, conversations, users)
│
├── components/        # UI components (chat, forms, cards, etc.)
├── lib/               # Database & utilities
├── models/            # Mongoose models (User, Blog, Conversation)
├── node_modules/          # AI service layer (Gemini / OpenAI)
└── public/            # public files and folders
└── .env                # Environment variables
└── .gitignore           # Files that should not be pushed to your repo - e.g .env
└── .components.json            # components configuration
└── .eslint.config.mjs           
└── .middleware.ts           # Middleware for authenticating requests 
└── .next-env.d.ts         # Global styles
└── .next.config.ts        
└── .package-lock.json         
└── .package.json         # installed packages
└── .README.md         
└── .tsconfig.json        


🔄 How It Works
Flow Overview
flowchart TD
    U[👤 User] -->|Sign In / Sign Up| C[Clerk Auth]
    C -->|Auth Token| N[Next.js App]
    N -->|Ensure Synced| DB[(MongoDB Atlas)]
    U -->|Enter Prompt| N
    N -->|Send Request| G[Gemini API]
    G -->|Generated Content| N
    N -->|Save Response| DB
    DB -->|Conversation History| N
    N -->|Render Markdown| UI[🖥️ Frontend UI]

Step-by-Step

Authentication — Users sign up or log in using Clerk.

User Sync — On first login, the app ensures the user exists in MongoDB.

Prompt Submission — User enters a blog prompt via the chat interface.

AI Generation — The prompt + history are sent to Gemini, which returns AI-generated content.

Persistence — The conversation and generated content are saved in MongoDB.

Rendering — The frontend displays the markdown-formatted blog post, with suggested image placeholders.



🖼️ Screenshots

(Add screenshots here once deployed!)


🌍 Deployment
Deploy on Vercel

Push repo to GitHub

Import into Vercel

Add environment variables in Vercel Dashboard

Deploy 🚀


🤝 Contributing

Contributions are welcome! Please fork the repo and create a pull request.

📜 License

MIT License © 2025 Igboji Paul Chidiebube


🙌 Acknowledgements

Next.js

Clerk

MongoDB

Google Gemini AI

TailwindCSS

ShadCN UI
