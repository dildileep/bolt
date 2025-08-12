# 📥 How to Download Your Skill Matrix Portal Code

## Method 1: Download from Bolt (Recommended)

### Option A: Using Browser Developer Tools
1. **Open Browser Developer Tools** (F12 or right-click → Inspect)
2. **Go to Console tab**
3. **Run this JavaScript code:**
```javascript
// Create a function to download all files
function downloadProjectFiles() {
    const files = {
        // Package.json and config files
        'package.json': document.querySelector('script[type="application/json"]')?.textContent || '',
        
        // Main files
        'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Skill Matrix Portal - Comprehensive Employee Skills Management</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
        
        // Add all your source files here...
        // (This would be quite long, so see Method 2 below)
    };
    
    // Create and download zip
    // Note: This requires a zip library
}
```

### Option B: Copy Files Manually
1. **Create a new folder** on your computer called `skill-matrix-portal`
2. **Copy each file** from the Bolt interface to your local files
3. **Maintain the folder structure** as shown in the project

## Method 2: Complete File Structure (Copy & Paste)

Create these folders and files on your computer:

```
skill-matrix-portal/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── LoginForm.tsx
│   │   ├── Dashboard/
│   │   │   └── DashboardStats.tsx
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── NotificationDropdown.tsx
│   │   ├── Skills/
│   │   │   └── SkillCard.tsx
│   │   └── SkillMatrix/
│   │       └── SkillMatrix.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── DataContext.tsx
│   │   └── NotificationContext.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Skills.tsx
│   │   ├── Employees.tsx
│   │   ├── Training.tsx
│   │   ├── Certifications.tsx
│   │   └── Notifications.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── index.html
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── deploy.sh
├── .env.example
├── .gitignore
├── README.md
└── EC2_DEPLOYMENT_GUIDE.md
```

## Method 3: Using Git (If you have a repository)

```bash
# Clone the repository
git clone https://github.com/yourusername/skill-matrix-portal.git
cd skill-matrix-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

## Method 4: Download as ZIP from Bolt

1. **Look for a download button** in the Bolt interface
2. **Click "Download Project"** or similar option
3. **Extract the ZIP file** to your desired location

## 🚀 Quick Setup After Download

Once you have the files:

### 1. Install Dependencies
```bash
cd skill-matrix-portal
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

## 📁 Essential Files You Need

Make sure you have these critical files:

### Root Files:
- `package.json` - Dependencies and scripts
- `index.html` - Main HTML file
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS config
- `tsconfig.json` - TypeScript configuration

### Source Files:
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main App component
- `src/index.css` - Global styles

### Context Files:
- `src/contexts/AuthContext.tsx` - Authentication
- `src/contexts/DataContext.tsx` - Data management
- `src/contexts/NotificationContext.tsx` - Notifications

### Component Files:
All files in `src/components/` and `src/pages/`

## 🔧 File Contents

### package.json
```json
{
  "name": "skill-matrix-portal",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@headlessui/react": "^2.2.7",
    "clsx": "^2.1.1",
    "lucide-react": "^0.536.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.7.1",
    "recharts": "^3.1.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

### .env.example
```env
# Application Configuration
VITE_APP_NAME="Skill Matrix Portal"
VITE_APP_VERSION="1.0.0"

# Environment
NODE_ENV=production

# API Configuration (for future backend integration)
# VITE_API_URL=http://localhost:3001/api
# VITE_API_KEY=your-api-key-here

# Database Configuration (for future use)
# DATABASE_URL=postgresql://username:password@localhost:5432/skillmatrix
# JWT_SECRET=your-jwt-secret-here

# Email Configuration (for future notifications)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
```

## ✅ Verification Steps

After downloading and setting up:

1. **Check file structure** matches the layout above
2. **Run `npm install`** to install dependencies
3. **Run `npm run dev`** to start development server
4. **Open `http://localhost:5173`** in your browser
5. **Test login** with demo accounts:
   - Admin: `admin@company.com`
   - Employee: `john@company.com`
   - Password: any non-empty value

## 🐛 Common Issues

### Missing Dependencies
```bash
# If you get dependency errors
npm install --legacy-peer-deps
```

### TypeScript Errors
```bash
# If TypeScript compilation fails
npm run build --verbose
```

### Port Conflicts
```bash
# If port 5173 is busy
npm run dev -- --port 3000
```

## 📞 Need Help?

If you encounter issues downloading or setting up:

1. **Check the console** for error messages
2. **Verify all files** are present and correctly named
3. **Ensure Node.js** version 16+ is installed
4. **Try clearing npm cache**: `npm cache clean --force`

## 🎉 Success!

Once downloaded and set up, you'll have a fully functional Skill Matrix Portal ready for development or deployment to EC2!