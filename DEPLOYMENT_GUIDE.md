# Deployment Guide - PTNM Classification Tool

## Quick Start

### 1. Install Dependencies
```bash
cd pd-classification-tool
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_BLACKBOX_CUSTOMER_ID=your_customer_id
NEXT_PUBLIC_BLACKBOX_API_KEY=your_api_key
```

### 3. Run Locally
```bash
npm run dev
```
Visit http://localhost:3000

### 4. Build for Production
```bash
npm run build
npm start
```

## Deploy to Vercel

### Option 1: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

### Option 2: Using Vercel Dashboard
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_BLACKBOX_CUSTOMER_ID`
   - `NEXT_PUBLIC_BLACKBOX_API_KEY`
6. Click "Deploy"

## Deploy to GitHub

### Initialize Git Repository
```bash
cd pd-classification-tool
git init
git add .
git commit -m "Initial commit: PTNM Classification Tool"
```

### Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository named "pd-classification-tool"
3. Don't initialize with README (we already have one)

### Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/pd-classification-tool.git
git branch -M main
git push -u origin main
```

## Project Structure
```
pd-classification-tool/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── PTNMClassifier.tsx # Main component
│   └── ui/                # UI components
├── lib/                   # Utilities
├── public/                # Static files
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
├── README.md             # Documentation
└── tailwind.config.ts    # Tailwind config
```

## Environment Variables

Required for API functionality:
- `NEXT_PUBLIC_BLACKBOX_CUSTOMER_ID` - Your Blackbox AI customer ID
- `NEXT_PUBLIC_BLACKBOX_API_KEY` - Your Blackbox AI API key

## Troubleshooting

### TypeScript Errors
These will resolve after `npm install` completes. If they persist:
```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

### Build Errors
Ensure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Errors
- Verify environment variables are set correctly
- Check API credentials are valid
- Ensure `.env.local` file exists (not tracked in git)

## Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Set up environment variables
3. ✅ Test locally (`npm run dev`)
4. ✅ Push to GitHub
5. ✅ Deploy to Vercel
6. ✅ Configure custom domain (optional)

## Support

For issues or questions:
- Check README.md for detailed documentation
- Review Next.js documentation: https://nextjs.org/docs
- Vercel deployment docs: https://vercel.com/docs

---

**Note**: The component file may show TypeScript errors until dependencies are fully installed. This is normal and will resolve automatically.
