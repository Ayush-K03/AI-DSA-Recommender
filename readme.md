# 🏔️ LeetApex: AI-Powered DSA Recommender & Spaced Repetition

**LeetApex** is a smart Chrome extension designed for LeetCode that tracks your submissions, provides AI-driven hints, runs code optimality checks, recommends targeted practice problems, and manages a spaced-repetition review system based on your past mistakes.

---

## ✨ Features

- **🧠 AI-Driven Hints**: Stuck on a problem? LeetApex analyzes your code and gives you a conceptual hint about the core flaw, without giving away the exact solution.
- **📊 Big-O Optimality Analysis**: Automatically evaluates your submitted code's time and space complexity, and provides suggestions if your solution is suboptimal.
- **🎯 Smart Recommendations**: Uses **MongoDB Atlas Vector Search** and **Google Gemini** embeddings to recommend problems similar to the ones you struggle with, categorizing them into difficulty tiers (Breathe, Keep Going, Challenge).
- **🔁 Spaced Repetition System (SRS)**: Prompts you to rate the difficulty of a problem after submission and schedules it for review using an optimized spaced-repetition algorithm.
- **📈 Stats & Streaks Tracker**: A sleek popup interface to view your problem-solving streaks, upcoming reviews, and performance analytics.

---

## 🛠️ Tech Stack

### **Frontend (Chrome Extension)**
- **HTML, CSS, Vanilla JavaScript** (Manifest V3)
- **Glassmorphism UI** with smooth CSS animations
- Content Scripts & Background Service Workers for DOM manipulation and state management

### **Backend (Node.js REST API)**
- **Node.js & Express.js**
- **MongoDB Atlas** (with Vector Search) & **Mongoose**
- **Google Gemini API** & **LangChain** for structured AI outputs and embeddings

---

## 🏗️ System Architecture

1. **Content Scripts**: Injected into the LeetCode environment, these scripts intercept native `window.fetch` calls to monitor your code submissions and results.
2. **Background Service Worker**: Acts as the API gateway, caching your review schedules locally and proxying requests to the local backend.
3. **Backend API**: 
   - Uses **LangChain** and **Google Gemini** to analyze code for hints and optimality.
   - Generates text embeddings of your code's core algorithmic concepts.
   - Performs **Cosine Similarity Vector Search** on a pre-embedded dataset of LeetCode problems stored in MongoDB to fetch tailored recommendations.

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "AI DSA Recommender"
```

### 2. Backend Setup
1. Navigate to the root directory where `package.json` is located.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables: The project root already contains a `.env` file. Be sure to configure it with your active credentials:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   GOOGLE_API_KEY=your_gemini_api_key
   PORT=3300
   LANGCHAIN_API_KEY=your_langchain_api_key
   LANGCHAIN_TRACING_V2=true
   LANGCHAIN_PROJECT=leetcode-ai-extension
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup (Chrome Extension)
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right corner).
3. Click on **Load unpacked**.
4. Select the `frontend` folder from this project directory.
5. The **LeetApex** icon should now appear in your browser toolbar!

---

## 📂 Project Structure

```text
📁 AI DSA Recommender
├── 📁 backend
│   ├── 📁 scripts        # Data cleanup scripts (Python)
│   ├── 📁 src
│   │   ├── 📁 controllers # Route logic (Hints, Recommendations, Reviews)
│   │   ├── 📁 models      # Mongoose schemas (MistakeLogs, Problems)
│   │   ├── 📁 routes      # Express routers (AI APIs, Review schedules)
│   │   ├── 📁 utils       # MongoDB connection, Vector Embedding generation
│   │   └── server.js      # Backend entry point
│   ├── leetcode_dataset.csv # Raw dataset for vector embeddings
├── 📁 frontend
│   ├── 📁 components      # UI Modules (Big-O Report, Hint Button, Question Box)
│   ├── background.js      # Service Worker / API Gateway
│   ├── content.js         # DOM Manipulator & Event Orchestrator
│   ├── injected.js        # window.fetch interceptor for LeetCode submissions
│   ├── manifest.json      # Extension V3 configurations
│   ├── popup.html/js/css  # Extension Action Popup UI
│   └── content.css        # Centralized styling & Glassmorphism theme
├── package.json
└── .env
```

---

## 💡 How It Works

1. **Intercepting Submissions**: `injected.js` intercepts LeetCode's API requests to capture your code and execution results.
2. **AI Analysis**: Upon submission, the extension sends your code to the Node.js backend.
3. **Structured AI Response**: The backend uses Google Gemini via LangChain to parse the code and return structured JSON (Hints or Optimality feedback).
4. **Vector Search**: If you struggle with a problem, Gemini extracts the core flaw, converts it into a high-dimensional vector, and queries MongoDB Atlas to find similar problems.
5. **UI Rendering**: The result is sent back to the content scripts which dynamically inject sleek, glassmorphic UI components directly into the LeetCode page.
