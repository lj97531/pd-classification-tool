# PTNM Classification System

AI-powered Peyronie's Disease classification tool using the PTNM system based on evidence-based criteria.

## About

This application provides an interactive interface for classifying Peyronie's Disease cases using the PTNM (Peyronie's Disease, Trauma, Non-PD, Mode) classification system as described by Trost et al. (2024).

### Reference
Trost et al. (2024) - Creation of a Novel Classification System (PTNM) for Peyronie's Disease. J Urol. 212(3):470-482

## Features

- 📋 **Comprehensive Patient Assessment Form** - Collect all necessary clinical data
- 🤖 **AI-Powered Classification** - Uses advanced AI to analyze cases and provide PTNM classification
- 🎨 **Multiple Display Styles** - Choose between Modern, Clinical, or Compact views
- 📊 **Detailed Breakdown** - Get component-by-component explanation of the classification
- 💾 **Export Options** - Download results as JSON or text report
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🌙 **Dark Mode Support** - Automatic dark mode based on system preferences

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Blackbox AI API credentials:
```env
NEXT_PUBLIC_BLACKBOX_CUSTOMER_ID=your_customer_id_here
NEXT_PUBLIC_BLACKBOX_API_KEY=your_api_key_here
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build for production:

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_BLACKBOX_CUSTOMER_ID`
   - `NEXT_PUBLIC_BLACKBOX_API_KEY`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/pd-classification-tool)

### Other Deployment Options

This is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Google Cloud Platform
- Any Node.js hosting service

## Usage

1. **Fill out the Patient Assessment Form**
   - Complete all required fields marked with *
   - Provide optional information for more accurate classification

2. **Choose Display Style**
   - Modern: Visual cards with color coding
   - Clinical: Detailed professional layout
   - Compact: Simple condensed view

3. **Generate Classification**
   - Click "Generate PTNM Classification"
   - Wait for AI analysis (typically 5-10 seconds)

4. **Review Results**
   - View the PTNM code and detailed breakdown
   - Read clinical implications and recommendations

5. **Export if Needed**
   - Download as JSON for data integration
   - Download as text report for documentation

## PTNM Classification System

### Components

- **P (PD Component)**
  - 0 = none
  - Cl = classical
  - Ca = calcifying
  - P = progressive
  - R = relapsing/remitting
  - U = undifferentiated

- **T (Trauma)**
  - 0 = absent
  - 1 = present

- **N (Non-PD)**
  - 0 = none
  - C = congenital
  - M = maturational
  - U = undifferentiated

- **M (Mode)**
  - 0 = stable
  - 1 = active
  - x = not applicable

### Example Classifications

- `PClT1N0M0` - Classical PD with trauma, stable phase
- `PCaT0N0M1` - Calcifying PD without trauma, active phase
- `PPT0N0M1` - Progressive PD without trauma, active phase

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui patterns
- **Icons**: Lucide React
- **AI**: Blackbox AI API

## Project Structure

```
pd-classification-tool/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── PTNMClassifier.tsx  # Main classification component
│   └── ui/                 # UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── label.tsx
│       └── select.tsx
├── lib/
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
├── .env.example            # Environment variables template
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## Important Notes

### Medical Disclaimer

⚠️ **This tool is for educational and research purposes only.**

- Results should be reviewed by qualified healthcare professionals
- Not intended to replace clinical judgment
- Should not be used as the sole basis for medical decisions
- Always consult with a urologist or appropriate specialist

### API Usage

This application requires a Blackbox AI API key. The API is used to:
- Analyze patient data
- Generate PTNM classifications
- Provide clinical recommendations

Ensure you have appropriate API access and understand the usage limits and costs.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is provided as-is for educational purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Acknowledgments

- Based on research by Trost, Mulhall, and Hellstrom (2024)
- Built with Next.js and modern web technologies
- UI components inspired by shadcn/ui

---

**Version**: 1.0.0  
**Last Updated**: 2025
