# CalcConnect 🔢

CalcConnect is a platform where users can initiate discussions with an initial number, and other users can respond with mathematical operations (+, -, ×, ÷) to create a discussion tree similar to Twitter's comment system.

![Number Discussion App](/images/image.png)

## ✨ Main Features

- **Authentication System** - Sign up, login, and logout with email/password
- **Public View** - Everyone can view discussions without logging in (read-only)
- **Start Discussion** - Registered users can start discussions with an initial number
- **Mathematical Operations** - Add operations (+, -, ×, ÷) to existing numbers
- **Tree Structure** - Nested replies like Twitter comments
- **Real-time Calculation** - Operation results are calculated automatically
- **Responsive Design** - Optimal display on all devices
- **Row Level Security** - Database security with Supabase RLS

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

Before starting, make sure you have:

- Node.js 20+ installed
- npm or yarn
- Docker & Docker Compose (for running with Docker)
- Supabase account (for database and authentication)

## 🚀 Quick Start

### Option 1: Running with Docker (Recommended)

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd number-discussion-app
   ```

2. **Setup environment variables**

   Create `.env.local` file:

   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


   ```

3. **Setup database schema**

   Run SQL scripts in Supabase SQL Editor or from terminal:

   ```bash
   # If local, copy contents of scripts/001_create_tables.sql
   # and run in Supabase SQL Editor
   ```

4. **Build and run with Docker**

   ```bash
   docker-compose up --build
   ```

5. **Access application**

   Open browser and access: `http://localhost:3000`

### Option 2: Running Without Docker

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd number-discussion-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   Create `.env.local` file with the same variables as above.

4. **Setup database schema**

   Run SQL scripts in `scripts/001_create_tables.sql` in Supabase SQL Editor.

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Access application**

   Open browser and access: `http://localhost:3000`

## 📁 Project Structure

```
number-discussion-app/
├── app/
│ ├── actions/ # Server actions for auth and discussions
│ ├── api/ # API routes (if any)
│ ├── auth/ # Authentication pages (login, sign-up)
│ ├── discussions/ # Discussion pages
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ └── globals.css # Global styles
├── components/
│ ├── discussion-card.tsx # Card for displaying discussion
│ ├── operation-node.tsx # Node for mathematical operations
│ ├── operation-form.tsx # Form for adding operations
│ └── ui/ # shadcn/ui components
├── lib/
│ ├── supabase/ # Supabase client configs
│ │ ├── client.ts # Browser client
│ │ ├── server.ts # Server client
│ │ └── middleware.ts # Middleware helper
│ └── types.ts # TypeScript types
├── scripts/
│ └── 001_create_tables.sql # Database schema
├── Dockerfile # Docker configuration
├── docker-compose.yml # Docker Compose configuration
├── middleware.ts # Next.js middleware for auth
└── README.md # Documentation
```

## 🗄️ Database Schema

### Table: `profiles`

Stores registered user information.

| Column     | Type        | Description                         |
| ---------- | ----------- | ----------------------------------- |
| id         | uuid        | Primary key (references auth.users) |
| username   | text        | Username (unique)                   |
| avatar_url | text        | User avatar URL (optional)          |
| created_at | timestamptz | Creation timestamp                  |

### Table: `discussions`

Stores starting numbers for each discussion.

| Column          | Type        | Description                 |
| --------------- | ----------- | --------------------------- |
| id              | uuid        | Primary key                 |
| user_id         | uuid        | Foreign key to profiles     |
| starting_number | numeric     | Initial discussion number   |
| title           | text        | Discussion title (optional) |
| created_at      | timestamptz | Creation timestamp          |

### Table: `operations`

Stores mathematical operations in a tree structure.

| Column        | Type        | Description                                   |
| ------------- | ----------- | --------------------------------------------- |
| id            | uuid        | Primary key                                   |
| discussion_id | uuid        | Foreign key to discussions                    |
| parent_id     | uuid        | Foreign key to operations (nullable for root) |
| user_id       | uuid        | Foreign key to profiles                       |
| operator      | text        | Operator: '+', '-', '×', '÷'                  |
| operand       | numeric     | Operand number                                |
| result        | numeric     | Calculation result                            |
| created_at    | timestamptz | Creation timestamp                            |

## 🔐 Row Level Security (RLS)

Database uses RLS policies for security:

- **Public Read**: Everyone can read discussions and operations
- **Authenticated Write**: Only authenticated users can create discussions and operations
- **Owner Only**: Users can only update/delete their own data

## 🎨 Design System

- **Colors**: Semantic design tokens (background, foreground, primary, accent, muted)
- **Typography**: Geist Sans for heading and body text
- **Layout**: Flexbox with responsive grid
- **Components**: shadcn/ui components (Button, Card, Input, Avatar, etc.)

## 📝 How to Use

1. **Sign Up / Login**

   - Click "Sign Up" to create a new account
   - Or "Login" if you already have an account

2. **Start Discussion**

   - After logging in, enter initial number on home page
   - Add title (optional)
   - Click "Start Discussion"

3. **Add Operation**

   - Click "Reply" on the number you want to operate on
   - Choose operator (+, -, ×, ÷)
   - Enter operand (number)
   - Result will be calculated automatically
   - Click "Submit"

4. **View Discussion Tree**
   - View tree structure with nested operations
   - Each node displays: user, timestamp, operation, and result
   - Tree can grow with unlimited depth

## 🐛 Troubleshooting

### Docker cannot connect to database

- Ensure environment variables are set correctly
- Check internet connection for Supabase access
- Restart container: `docker-compose restart`

### "User already registered" error

- Email already registered, use another email or login

### Operations not appearing

- Ensure RLS policies are enabled
- Check browser console for error messages
- Refresh page

### Build error in Docker

- Remove node_modules and rebuild:
  ```bash
  docker-compose down
  docker-compose up --build
  ```

## 🔄 Development

### Run tests (coming soon)

```bash
npm run test
```

### Build for production

```bash
npm run build
npm start
```

### Format code

```bash
npm run format
```

## 📦 Docker Commands

```bash
# Build and start
docker-compose up --build

# Start (without build)
docker-compose up

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build app
```

## 🤝 Contributing

Contributions are welcome! Please create a pull request or open an issue.

## 📄 License

MIT License - feel free to use this project for learning or production.

## 👨‍💻 Author

Built with ❤️ by Ryan

---

**Need help?** Open an issue or contact the support team.
