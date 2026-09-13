# Pashudhan Lens

## AI-Powered Cattle & Buffalo Breed Recognition System

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live_Demo-pashudhanlens.vercel.app-00C7B7?style=for-the-badge&logo=vercel)](https://pashudhanlens.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**🏆 Smart India Hackathon 2025 | Problem Statement SIH25004 | Team AlphaNova0.2**

</div>

A progressive web application that uses Google Gemini 2.5 Flash AI to identify Indian cattle and buffalo breeds with 90%+ accuracy. Built for the Bharat Pashudhan App (BPA) to support field workers in accurate breed identification.

> 🚧 **Update:** Multiple newer and improved versions of this project have already been developed internally, but are not yet published.  
> These updated versions will be released publicly soon. Stay tuned.

## Table of Contents

1. [Overview](#overview)
2. [The Problem](#the-problem)
3. [Our Solution](#our-solution)
4. [Key Features](#key-features)
5. [Tech Stack](#tech-stack)
6. [Getting Started](#getting-started)
7. [Deployment](#deployment)
8. [Project Structure](#project-structure)
9. [Configuration](#configuration)
10. [Usage](#usage)
11. [Contributing](#contributing)
12. [License](#license)

---

## Overview

Pashudhan Lens is a modern web application designed to solve the critical problem of accurate cattle and buffalo breed identification in India. The app leverages cutting-edge AI technology to provide instant, reliable breed recognition from photos, helping field workers, farmers, and veterinarians make better decisions.

### Why This Matters

India has over 300 million cattle and buffalo across 53+ recognized breeds. Accurate breed identification is essential for:

- Government scheme eligibility
- Genetic improvement programs
- Insurance and proper valuation
- Breed-specific health management
- Fair market pricing

---

## The Problem

The Bharat Pashudhan App (BPA) currently faces significant challenges:

- **60-70% accuracy** in manual breed identification by field workers
- **Inconsistent data quality** leading to poor policy decisions
- **Economic losses** for farmers unable to access breed-specific schemes
- **Time-consuming** manual verification processes
- **Lack of standardization** across different regions

These issues result in:
- Farmers missing out on government benefits
- Ineffective breeding programs
- Poor genetic improvement efforts
- Reduced agricultural productivity

---

## Our Solution

Pashudhan Lens provides an AI-powered solution that:

1. **Instant Analysis** - Upload a photo and get results in seconds
2. **High Accuracy** - 90%+ breed identification accuracy
3. **Detailed Information** - Comprehensive breed characteristics and data
4. **Multi-Image Support** - Analyze multiple animals simultaneously
5. **Offline Capability** - Progressive Web App works with limited connectivity
6. **User-Friendly** - Simple interface designed for field use

### How It Works

1. User uploads cattle/buffalo photo(s)
2. Image is optimized and validated
3. Gemini AI analyzes the image
4. System returns breed identification with confidence score
5. Detailed breed information is displayed
6. Results can be saved or exported

---

## Key Features

### AI-Powered Breed Recognition
- Uses Google Gemini 2.5 Flash model
- Identifies 53+ Indian cattle and buffalo breeds
- Provides confidence scores for each identification
- Suggests alternative matches when confidence is lower

### Comprehensive Breed Information
- Physical characteristics (color, size, horn shape)
- Origin and geographic distribution
- Productivity data (milk yield, meat quality)
- Adaptability (climate resistance, disease resistance)
- Conservation status
- Economic value and market information

### Multi-Image Processing
- Upload multiple images at once
- Parallel processing for faster results
- Individual analysis for each image
- Batch export functionality

### Progressive Web App
- Install on any device
- Works offline (view previous results)
- Fast loading with service workers
- Responsive design for mobile and desktop

### User Authentication
- Secure Clerk-based authentication
- Email/password and social login
- User profile management
- Protected routes

### Performance Optimized
- Code splitting for faster loads
- Image optimization
- Lazy loading
- Efficient caching strategies

---

## Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript 5.8.3** - Type safety
- **Vite 7.2.4** - Build tool
- **Tailwind CSS 3.4.17** - Styling
- **React Router 6.30.1** - Routing

### AI & API
- **Google Gemini 2.5 Flash** - AI model for breed identification
- **Clerk 5.45.0** - Authentication

### State Management
- **React Query 5.83.0** - Server state
- **React Context** - Client state

### UI Components
- **Radix UI** - Accessible components
- **shadcn/ui** - Component library
- **Framer Motion 12.23.12** - Animations
- **Lucide React** - Icons

### Forms & Validation
- **React Hook Form 7.61.1** - Form management
- **Zod 3.25.76** - Schema validation

### Testing
- **Vitest** - Unit testing
- **Testing Library** - Component testing

### Deployment
- **Vercel** - Hosting platform

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Automated Setup

We provide a Python script that automates the entire setup process:

```bash
# Clone the repository
git clone https://github.com/srinivasjangiti/Pashudhan.git
cd Pashudhan

# Run the setup script (or run directly from Pashudhan-Lens-main)
python setup.py
```

The script will:
- Check for Node.js installation
- Install dependencies
- Configure environment variables
- Start the development server

### Manual Setup

If you prefer manual setup:

**1. Clone the repository and enter the web app directory**

```bash
git clone https://github.com/srinivasjangiti/Pashudhan.git
cd Pashudhan/Pashudhan-Lens-main
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

**4. Start development server**

```bash
npm run dev
```

The app will run at `http://localhost:8080`

**5. Build for production**

```bash
npm run build
```

### Getting API Keys

**Google Gemini API Key:**
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Get API Key"
4. Copy the generated key

**Clerk Publishable Key:**
1. Visit https://dashboard.clerk.com
2. Create or select your application
3. Go to API Keys section
4. Copy the Publishable Key

---

## Deployment

### Deploy to Vercel

**Method 1: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

**Method 2: GitHub Integration**

1. Push code to GitHub
2. Go to https://vercel.com/dashboard
3. Click "Import Project"
4. Select your repository
5. Add environment variables
6. Deploy

**Environment Variables in Vercel:**

Add these in your Vercel project settings:
- `VITE_GEMINI_API_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY`

### Custom Domain

After deployment, add a custom domain:
1. Go to project settings in Vercel
2. Navigate to Domains
3. Add your domain
4. Configure DNS records as shown

---

## Project Structure

```
Pashudhan-Lens/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sw.js
│   └── sw-advanced.js
│
├── src/
│   ├── assets/
│   │   ├── hero-wildlife.png
│   │   ├── upload_bg.png
│   │   └── library_bg.jpeg
│   │
│   ├── components/
│   │   ├── ui/                  # Base UI components
│   │   ├── CritterTypewriter.tsx
│   │   ├── EnhancedSkeleton.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── MultiImageResults.tsx
│   │   ├── PageBackground.tsx
│   │   ├── RouterWrappers.tsx
│   │   ├── SharedLayout.tsx
│   │   └── SpeciesResults.tsx
│   │
│   ├── contexts/
│   │   ├── AppContext.tsx
│   │   └── PerformanceContext.tsx
│   │
│   ├── hooks/
│   │   ├── use-content-loading.ts
│   │   ├── use-performance-optimizations.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/
│   │   ├── material.ts
│   │   ├── performance.ts
│   │   ├── serviceWorker.ts
│   │   ├── utils.ts
│   │   └── validation.ts
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Upload.tsx
│   │   ├── Results.tsx
│   │   ├── Library.tsx
│   │   └── NotFound.tsx
│   │
│   ├── services/
│   │   ├── geminiApi.ts
│   │   └── multiImageGeminiApi.ts
│   │
│   ├── types/
│   │   └── breedIdentification.ts
│   │
│   ├── utils/
│   │   └── breedCharacteristicsExtractor.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── vercel.json
└── README.md
```

---

## Configuration

### Environment Variables

The application requires two API keys to function:

```env
# Required for AI breed identification
VITE_GEMINI_API_KEY=your_gemini_api_key

# Required for user authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

### Vite Configuration

The `vite.config.ts` includes optimizations for:
- Fast refresh
- Code splitting
- Build optimizations
- Development server settings

### Tailwind Configuration

Custom theme configuration in `tailwind.config.ts`:
- Custom colors
- Custom animations
- Plugin configurations
- Responsive breakpoints

### Vercel Configuration

The `vercel.json` configures:
- Build commands
- Output directory
- Rewrites for SPA routing
- Cache headers for assets

---

## Usage

### Basic Workflow

**1. Home Page**
- Introduction to Pashudhan Lens
- Quick start guide
- Feature highlights

**2. Upload Image**
- Click "Upload" or drag and drop
- Select one or multiple images
- Supported formats: JPEG, PNG, WebP, HEIC, HEIF
- Maximum size: 20MB per image

**3. AI Analysis**
- Automatic image optimization
- AI processing via Gemini API
- Real-time progress feedback

**4. View Results**
- Breed identification with confidence score
- Detailed breed information
- Physical characteristics
- Productivity data
- Conservation status
- Economic information

**5. Breed Library**
- Browse all supported breeds
- Search and filter options
- Detailed breed profiles
- Comparison features

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Fix linting issues
npm run lint:check       # Check linting
npm run type-check       # TypeScript check

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Maintenance
npm run clean            # Remove build artifacts
npm run optimize         # Clean and build
npm run security:audit   # Security check
npm run deps:update      # Update dependencies
```

---

## Contributing

We welcome contributions! Here's how to get started:

### Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run tests and linting: `npm run validate`
5. Commit changes: `git commit -m "Add new feature"`
6. Push to branch: `git push origin feature/new-feature`
7. Open a Pull Request

### Guidelines

**Code Style**
- Follow existing patterns
- Use TypeScript
- Write meaningful commit messages
- Comment complex logic

**Before Submitting**
- Run `npm run lint`
- Run `npm run type-check`
- Run `npm run test`
- Update documentation

**Pull Request Checklist**
- Code follows project structure
- Tests pass
- Documentation updated
- One feature per PR

### Areas for Contribution

- Bug fixes
- Documentation improvements
- UI/UX enhancements
- Test coverage
- Performance optimizations
- New features
- Accessibility improvements

---

## License

This project is licensed under the MIT License.

**Permissions:**
- Commercial use
- Modification
- Distribution
- Private use

**Limitations:**
- Liability
- Warranty

**Conditions:**
- License and copyright notice required

---

## Contact

**Team AlphaNova0.2**

- Institution: Parul Institute of Engineering & Technology (PIET)
- Problem Statement: SIH25004
- GitHub: [https://github.com/srinivasjangiti/Pashudhan](https://github.com/srinivasjangiti/Pashudhan)

**Support:**
- Report issues: GitHub Issues
- Email: support@pashudhan-lens.com

---

## Acknowledgments

Special thanks to:
- Google AI for Gemini API
- Clerk for authentication infrastructure
- Vercel for hosting platform
- Open source community for dependencies
- Government of India's Digital India Initiative
- Bharat Pashudhan App team

---

## Roadmap

**Current Version: v1.0.0**
- AI-powered breed identification
- Multi-image support
- User authentication
- Breed library
- PWA capabilities

**Upcoming Features (v1.1.0)**
- Regional language support
- BPA API integration
- PDF export
- Voice search

**Future Plans (v2.0.0)**
- Mobile native apps
- Disease detection
- Health monitoring
- Marketplace integration

---

Made with ❤️ for Digital India | Empowering India's Dairy Farmers Through AI

© 2025 Team AlphaNova0.2
