# 🐄 **PASHUDHAN LENS**
## **🤖 AI-Powered Cattle & Buffalo Breed Recognition System**

<div align="center">

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Open Source](https://img.shields.io/badge/Open_Source-Love-ff69b4?style=for-the-badge&logo=github)

**🏆 Smart India Hackathon 2025 | 🥇 Team AlphaNova0.2**

</div>

---

## 🚀 **QUICK START (GOD MODE)**

We have automated the entire setup process. You do not need to manually install dependencies or configure environments.

### **1. Run the Magic Script**
Simply run the following command in your terminal:

```bash
python setup.py
```

### **What this script does:**
- 🔍 **Checks Requirements**: Verifies Node.js installation.
- 📦 **Installs Dependencies**: Creates an isolated virtual environment (`node_modules`).
- 🔑 **Configures Secrets**: Asks for your API keys and sets up `.env` automatically.
- 🚀 **Launches App**: Starts the development server and opens your browser.

### **🧹 Reset Project**
To clean the project (remove all dependencies and configs) and start fresh:
```bash
python clean.py
```

---

## 🛠️ **MANUAL SETUP (FALLBACK)**

If the automated script doesn't work for you, here is how to set up the project manually step-by-step.

### **1. Prerequisites**
- **Node.js** (v18 or higher) - [Download Here](https://nodejs.org/)
- **Git** - [Download Here](https://git-scm.com/)

### **2. Install Dependencies**
Open your terminal in the project folder and run:
```bash
npm install
```
*This installs all the required libraries listed in `package.json`.*

### **3. Configure Environment**
1.  Create a new file named `.env` in the root folder.
2.  Copy the contents of `.env.example` into it.
3.  Add your API keys:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_key_here
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
    ```

### **4. Run the Application**
Start the development server:
```bash
npm run dev
```
The app should now be running at `http://localhost:8080` (or similar).

---

## 📦 **DEPENDENCY GUIDE**

Here is a breakdown of the key technologies and libraries used in this project:

### **Core Framework**
- **React 18**: The library for web and native user interfaces.
- **TypeScript**: Adds syntax for types to JavaScript, making the code more robust.
- **Vite**: Next Generation Frontend Tooling for fast build and dev server.

### **AI & Intelligence**
- **Google Gemini 2.5 Flash**: The core AI model used for identifying cattle breeds.
- **@tanstack/react-query**: Handles data fetching and caching for AI responses.

### **Authentication**
- **@clerk/clerk-react**: Complete user management and authentication (Sign In/Up).

### **UI & Styling**
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Radix UI**: Unstyled, accessible components for building high-quality design systems.
- **Framer Motion**: Production-ready motion library for React (animations).
- **Lucide React**: Beautiful & consistent icons.
- **Sonner**: An opinionated toast component for React.

### **Forms & Validation**
- **React Hook Form**: Performant, flexible and extensible forms with easy-to-use validation.
- **Zod**: TypeScript-first schema declaration and validation library.

---

## 📋 **THE PROBLEM (SIH25004)**

The Government of India's **🏛️ Bharat Pashudhan App (BPA)** faces a critical challenge: **Field Level Workers (FLWs) struggle to accurately identify cattle breeds.**

<div align="center">

| ⚠️ **Current Issues** | 📊 **Impact** |
|:---------------------|:-------------|
| 📉 **60-70% accuracy rate** in breed identification | ❌ Inconsistent data quality |
| 🔄 **Poor policy decisions** due to unreliable data | 💰 Economic losses for farmers |
| 🚫 **Unable to access** breed-specific schemes | �� **Genetic improvement** hampered |

</div>

---

## 💡 **OUR SOLUTION**

**Pashudhan Lens** is a progressive web application that uses **Google Gemini 2.5 Flash** to identify cattle and buffalo breeds from photos with **90%+ accuracy**.

<div align="center">

```mermaid
graph LR
    A[📸 Upload Photo] --> B[🔄 Process & Optimize]
    B --> C[🤖 AI Analysis]
    C --> D[📋 Detailed Results]
    
    style A fill:#ff6b6b,stroke:#fff,stroke-width:2px,color:#fff
    style B fill:#4ecdc4,stroke:#fff,stroke-width:2px,color:#fff
    style C fill:#45b7d1,stroke:#fff,stroke-width:2px,color:#fff
    style D fill:#96ceb4,stroke:#fff,stroke-width:2px,color:#fff
```

</div>

### **✨ Key Features**

<div align="center">

| 🤖 **AI-Powered Analysis** | 📚 **Indian Breed Library** | 📸 **Multi-Image Support** |
|:---------------------------:|:-----------------------------:|:---------------------------:|
| Uses Google's Gemini 2.5 Flash | Supports multiple Indian breeds | Analyze multiple animals |
| ![AI](https://img.shields.io/badge/AI-Powered-FF6B6B?style=flat-square) | ![Library](https://img.shields.io/badge/Library-Ready-4ECDC4?style=flat-square) | ![Multi](https://img.shields.io/badge/Multi-Image-45B7D1?style=flat-square) |

</div>

---

## 🛠️ **TECH STACK**

<div align="center">

| Component | Technology | Description |
|:----------|:-----------|:------------|
| **Frontend** | ![React](https://img.shields.io/badge/React_18-20232A?style=flat&logo=react&logoColor=61DAFB) | Component-based UI architecture |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | Type-safe development |
| **Styling** | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Utility-first styling |
| **AI Engine** | ![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat&logo=google&logoColor=white) | Multimodal vision analysis |
| **Build Tool** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Next-gen frontend tooling |

</div>

---

## 🤝 **CONTRIBUTING**

We welcome contributions to make Pashudhan Lens better!

1.  **Fork** the repository.
2.  **Clone** your fork: `git clone https://github.com/your-username/Pashudhan-Lens.git`
3.  **Create a branch**: `git checkout -b feature/amazing-feature`
4.  **Commit your changes**: `git commit -m "Add amazing feature"`
5.  **Push to the branch**: `git push origin feature/amazing-feature`
6.  **Open a Pull Request**.

---

## 📞 **CONTACT**

**Team AlphaNova0.2**
- **Institution**: Parul Institute of Engineering & Technology (PIET)
- **Problem Statement**: SIH25004

---

<div align="center">

Made with ❤️ for 🇮🇳 **Digital India**

</div>

