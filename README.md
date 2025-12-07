# GeoGenesis 🌍🌱

> **Plant a tree. Verify with AI. Win the Lottery.**
> *Making planetary stewardship a rewarding game.*

![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)
![AI](https://img.shields.io/badge/AI-Gemini%202.5-blue)

## 📖 Overview

**GeoGenesis** is a mobile-first web application designed to gamify reforestation. It addresses the critical need for verified, sustained environmental action by combining AI-powered verification with a lottery-based incentive system.

Unlike traditional donation platforms, GeoGenesis requires physical action. Users plant real trees, verify them using **Google's Gemini AI**, track their growth monthly to ensure survival, and earn tickets to a global "Green Lottery". It's not just about planting; it's about stewardship.

## ✨ Key Features

*   **🤖 AI Verification**: Leverages **Google Gemini 2.5 Flash** to analyze uploaded photos in real-time. It validates that the image contains a tree/sapling and automatically identifies the species.
*   **📍 Precision Geo-Tagging**: Captures high-accuracy GPS coordinates at the moment of planting to map the global reforestation effort.
*   **📅 Monthly Growth Monitoring**: To combat "plant and abandon" behavior, users must "check-in" every 30 days. The AI compares the new photo against the original to detect growth and assess health.
*   **🎟️ Green Lottery**: A gamified reward system where every *healthy* tree equals one lottery ticket. If a tree dies or isn't verified, the ticket is lost.
*   **📱 Mobile-First Design**: Built with a responsive, dark-mode UI optimized for outdoor usage and low-light environments.

---

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS (via CDN for portability)
*   **AI/ML**: Google Gemini API (`@google/genai` SDK)
*   **Model**: `gemini-2.5-flash` (Multimodal analysis)
*   **State Management**: React Hooks + Local Storage (Persistence)

---

## 🚀 Getting Started Locally

Follow these steps to get GeoGenesis running on your local machine.

### Prerequisites

*   **Node.js** (v16 or higher)
*   **npm** or **yarn**
*   A **Google Gemini API Key** (Get one here: [Google AI Studio](https://aistudio.google.com/))

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/geogenesis.git
    cd geogenesis
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    *   Create a `.env` file in the root directory.
    *   Add your Gemini API Key:
        ```env
        # If using Vite
        VITE_API_KEY=your_actual_api_key_here
        
        # If using Create React App
        REACT_APP_API_KEY=your_actual_api_key_here
        
        # If using a custom build (like this demo), ensure process.env.API_KEY is replaced during build
        API_KEY=your_actual_api_key_here
        ```

4.  **Run the application**
    ```bash
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

    > **💡 Tip for Mobile Testing**: To test the camera and geolocation features effectively, use Chrome DevTools' "Toggle Device Toolbar" or access your local server via your mobile device on the same WiFi network (e.g., `http://192.168.1.x:3000`). Note that modern browsers usually require **HTTPS** for the Geolocation API to work on non-localhost origins.

---

## ☁️ How to Run on Cloud

This application is a Single Page Application (SPA) and can be deployed easily to static hosting providers like Vercel, Netlify, or Cloudflare Pages.


### ⚠️ Security Note regarding API Keys
In this demo architecture, the API key is used directly in the client-side code (`services/geminiService.ts`).
*   **For Production**: You should **NOT** expose your API Key in the frontend. Instead, build a small serverless function that holds the key and forwards requests to Gemini.
*   **For Hackathons/Demos**: The current setup is sufficient. You can restrict your API key in Google AI Studio to only accept requests from your specific deployment domain to improve security.

---

## 📂 Project Structure

```text
/
├── public/              # Static assets (index.html, manifest)
├── src/
│   ├── components/      # Reusable UI components (TreeCard, Navigation, Icons)
│   ├── services/        # API integrations (geminiService.ts)
│   ├── views/           # Main page views (Dashboard, PlantTree, Lottery)
│   ├── types.ts         # TypeScript interfaces
│   ├── App.tsx          # Main router/layout logic
│   └── index.tsx        # Entry point
├── package.json         # Dependencies
└── README.md            # Project documentation
```

---

## 🎮 How It Works (User Flow)

1.  **Dashboard**: The user sees their "Forest" and impact statistics.
2.  **Planting Phase**:
    *   User clicks the **+** button.
    *   Camera activates to capture the planted sapling.
    *   **AI Analysis**: Gemini verifies the image is a tree and identifies the species.
    *   **GPS**: The app locks in the precise coordinates.
3.  **Monitoring Phase**:
    *   Trees are marked as 'Healthy', 'Verified', or 'Needs Attention'.
    *   Every 30 days, the "Check-in" button unlocks.
    *   User uploads a new photo. AI compares it to ensure the tree is alive.
4.  **Lottery**:
    *   User views the current prize pool.
    *   Tickets are calculated dynamically based on the number of healthy, verified trees.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> *Built with 💚 using Google Gemini API.*# GeoGenesis
