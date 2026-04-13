# Portfolio

A modern portfolio website built with [Next.js](https://nextjs.org) featuring dynamic project management, admin dashboard, and Cloudinary image uploads.

## Features

- 🎨 Modern portfolio showcase
- 📱 Responsive design with Tailwind CSS
- 🖼️ Backend-driven project management with image uploads
- 🔐 Admin dashboard with authentication
- 📧 Contact form with message persistence
- 📊 Site analytics and visitor tracking
- ☁️ Cloudinary integration for production-ready image storage

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB database (local or MongoDB Atlas)
- (Optional) Cloudinary account for production image uploads

### Local Development

Copy the environment template and configure your settings:

```bash
cp .env.example .env.local
```

Configure `.env.local` with your values:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
```

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Management

Projects are backend-driven with full CRUD capabilities:

### Admin Dashboard

Access the admin dashboard at `/admin/login`:
- **Email**: Your `ADMIN_EMAIL`
- **Password**: Your `ADMIN_PASSWORD`

From the dashboard, manage:
- **Projects**: Create, edit, and delete projects with featured workscreen and home carousel selection
- **Project Fields**:
  - Name, year, category, summary
  - Technology stack
  - Demo URL
  - Main image
  - Home image (for home carousel)
  - **showHomeScreen**: Toggle to display on home featured projects section

### API Endpoints

- `GET /api/projects` - List all projects
- `GET /api/projects?homeOnly=true` - List featured projects (home carousel)
- `POST /api/projects` - Create project (admin only)
- `PATCH /api/projects/[id]` - Update project (admin only)
- `DELETE /api/projects/[id]` - Delete project (admin only)
- `POST /api/uploads/project-image` - Upload project image (admin only)

## Image Upload Setup

### Development (Local Storage)

By default, images are stored locally in `/public/uploads/projects/`. No configuration needed.

### Production (Cloudinary)

For production deployments, configure Cloudinary to avoid filesystem errors on serverless platforms:

#### Step 1: Create Cloudinary Account

1. Sign up for free at [cloudinary.com](https://cloudinary.com)
2. Go to your [Console Dashboard](https://console.cloudinary.com/console)

#### Step 2: Get Your Credentials

Copy your credentials from the dashboard:
- **Cloud Name** - Displayed at the top of your dashboard
- **API Key** - Found under "API keys"
- **API Secret** - Found under "API keys" (keep this secret!)

#### Step 3: Set Environment Variables

Add to your production environment (Vercel, Netlify, etc.):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Vercel Example:**
1. Go to Project Settings → Environment Variables
2. Add the three Cloudinary variables
3. Redeploy

#### Step 4: Create Unsigned Upload Preset (Optional)

For enhanced security, create an unsigned upload preset:
1. Go to Settings → Upload
2. Create new preset with name `portfolio_projects`
3. Set "Signing Mode" to "Unsigned"

Once configured, image uploads will automatically use Cloudinary in production and local storage in development.

## Project Structure

```
portfolio/
├── app/
│   ├── api/
│   │   ├── admin/          # Admin-specific endpoints
│   │   ├── projects/       # Project CRUD endpoints
│   │   ├── uploads/        # Image upload endpoint
│   │   └── ...
│   ├── admin/              # Admin dashboard pages
│   ├── projects/           # Public projects archive
│   └── ...
├── components/
│   ├── portfolio/          # Portfolio-specific components
│   ├── admin/              # Admin dashboard components
│   └── ...
├── lib/
│   ├── models/             # Mongoose schemas
│   ├── db.ts               # Database connection
│   └── utils.ts            # Utility functions
├── public/
│   └── uploads/            # Local image storage (dev)
└── ...
```

## Technology Stack

- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Images**: Cloudinary (production) / Local storage (development)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [MongoDB Documentation](https://docs.mongodb.com)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set environment variables (including Cloudinary credentials)
4. Deploy

### Other Platforms

Ensure your hosting platform supports:
- Node.js 18+
- MongoDB connectivity
- Environment variables
- (Optional) File uploads to Cloudinary

## License

This project is open source and available under the MIT License.
