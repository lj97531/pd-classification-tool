# Quick Start Guide - PTNM Classification Tool

## 🚀 Get Started in 3 Steps

### Step 1: Set Up Environment Variables
Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_BLACKBOX_CUSTOMER_ID=your_customer_id_here
NEXT_PUBLIC_BLACKBOX_API_KEY=your_api_key_here
```

### Step 2: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 3: Test the Application
1. Fill out the patient assessment form
2. Click "Generate PTNM Classification"
3. View results in your chosen display style
4. Export results as JSON or text report

---

## 📦 What's Included

```
pd-classification-tool/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with Tailwind
├── components/
│   ├── PTNMClassifier.tsx # Main classification component
│   └── ui/                # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── label.tsx
│       └── select.tsx
├── lib/
│   └── utils.ts           # Utility functions
├── public/                # Static assets
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
├── README.md             # Full documentation
├── DEPLOYMENT_GUIDE.md   # Deployment instructions
└── vercel.json           # Vercel configuration
```

---

## 🎨 Features

### Patient Assessment Form
- **13 Clinical Fields** - Comprehensive data collection
- **Smart Validation** - Required fields marked with *
- **Conditional Fields** - Pain duration appears only when pain is selected
- **Dropdown Selects** - Easy data entry with predefined options

### AI Classification
- **PTNM System** - Based on Trost et al. (2024) research
- **Real-time Analysis** - Powered by Blackbox AI
- **Detailed Breakdown** - Component-by-component explanation
- **Clinical Guidance** - Implications and recommendations

### Display Styles
1. **Modern** - Visual cards with color-coded components
2. **Clinical** - Professional detailed layout
3. **Compact** - Simple condensed view

### Export Options
- **JSON Format** - For data integration and analysis
- **Text Report** - For documentation and records

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

### Option 2: GitHub + Vercel Dashboard
1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy!

---

## 🐛 Troubleshooting

### Build Errors
**Issue**: TypeScript compilation errors  
**Solution**: Ensure all dependencies are installed
```bash
npm install
```

### API Errors
**Issue**: "Failed to classify case"  
**Solution**: Check environment variables
- Verify `.env.local` exists
- Confirm API credentials are correct
- Restart dev server after changes

### Missing Components
**Issue**: UI components not rendering  
**Solution**: Check import paths
- All imports use `@/` alias
- Verify `tsconfig.json` paths are correct

---

## 📚 Additional Resources

- **Full Documentation**: See [README.md](./README.md)
- **Deployment Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vercel Deployment**: https://vercel.com/docs

---

## 💡 Tips

1. **API Credentials**: Keep your API keys secure - never commit `.env.local` to git
2. **Testing**: Test with various patient scenarios to ensure accurate classification
3. **Customization**: Modify styles in `globals.css` and `tailwind.config.ts`
4. **Performance**: The app uses Next.js 14 with App Router for optimal performance

---

## 🆘 Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment steps
- Open an issue on GitHub for bugs or questions

---

**Version**: 1.0.0  
**Last Updated**: 2025  
**Framework**: Next.js 14 with TypeScript
