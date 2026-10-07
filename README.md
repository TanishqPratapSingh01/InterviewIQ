# InterviewIQ.AI 🤖🎙️

> **Next-Generation AI-Powered Mock Interview Platform**  
> Prepare, practice, and excel in technical and HR interviews with real-time AI avatars, voice analysis, adaptive questioning, and comprehensive performance analytics.

---

## 🌟 Key Features

- **🎙️ Real-Time Voice & Video Avatars**
  - Interactive male and female interviewer avatars with human-like pacing and natural speech synthesis (`window.speechSynthesis`).
  - Integrated speech-to-text recognition (`webkitSpeechRecognition`) for hands-free, realistic vocal interview practice.

- **📄 AI Resume Parsing**
  - Upload PDF resumes to extract structured data: roles, years of experience, projects, and key technical skills via `pdfjs-dist` and Google Gemini.

- **🧠 Adaptive AI Question Generation**
  - Automatically produces 5 tailored questions progressing from **Easy** ➔ **Medium** ➔ **Hard** based on candidate role, interview mode (*Technical* or *HR*), and parsed resume.

- **⏱️ Timed Simulation & Pressure Testing**
  - Visual circular timer for each question to replicate real-world interview constraints.

- **📈 Granular Multidimensional Evaluation**
  - Evaluates each answer across 3 core pillars (scored 0–10):
    1. **Confidence**: Delivery, tone, and conviction.
    2. **Communication**: Simplicity, structure, and articulation.
    3. **Technical Correctness**: Precision, relevance, and depth.
  - Returns concise, constructive human-like feedback after every response.

- **📊 Analytics Dashboard & Downloadable PDF Reports**
  - Performance trend charts powered by `recharts`.
  - Comprehensive question-by-question breakdown.
  - Instant one-click PDF report export generated with `jspdf` and `jspdf-autotable`.

- **🔐 Robust Authentication & Session Management**
  - Google Sign-In powered by Firebase Authentication.
  - Secure HTTP-Only JWT session cookies.
  - Quick 1-click Demo Sign-in for immediate sandbox testing.

- **💳 Credit System & Payment Gateway**
  - Starter and Pro credit packages powered by Razorpay.
  - Built-in test sandbox mode for seamless local verification.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + React-Redux
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Charts & Visualizations**: [Recharts](https://recharts.org/), [React Circular Progressbar](https://www.npmjs.com/package/react-circular-progressbar)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **Authentication**: [Firebase Web SDK](https://firebase.google.com/) (Google Auth)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend (`/server`)
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **AI Intelligence**: [Google Gemini API](https://ai.google.dev/) (`gemini-3.5-flash` / `gemini-3.1-flash-lite`) with OpenRouter fallback
- **File Processing**: [Multer](https://github.com/expressjs/multer) & [pdfjs-dist](https://mozilla.github.io/pdf.js/)
- **Payment Processing**: [Razorpay Node SDK](https://razorpay.com/docs/) & Node `crypto` HMAC verification
- **Security**: [Cookie-Parser](https://github.com/expressjs/cookie-parser), [CORS](https://github.com/expressjs/cors), [JSONWebToken](https://github.com/auth0/node-jsonwebtoken)

---

## 📂 Project Structure

```text
InterviewIQ/
├── client/
│   ├── public/              # Static assets and icons
│   ├── src/
│   │   ├── assets/          # Images, avatars, and video files
│   │   ├── components/      # Navbar, Footer, AuthModal, Step1SetUp, Step2Interview, Step3Report, Timer
│   │   ├── pages/           # Home, Auth, InterviewPage, InterviewHistory, Pricing, InterviewReport
│   │   ├── redux/           # Store and userSlice
│   │   ├── utils/           # Firebase initialization
│   │   ├── App.jsx          # Route declarations & global auth listener
│   │   └── main.jsx         # Vite entry point
│   ├── .env.example         # Client environment template
│   └── package.json
│
├── server/
│   ├── config/              # MongoDB connection & token generation
│   ├── controllers/         # Auth, User, Interview, and Payment controllers
│   ├── middlewares/         # isAuth JWT middleware & Multer upload
│   ├── models/              # User, Interview, and Payment Mongoose schemas
│   ├── routes/              # Express API route definitions
│   ├── services/            # Gemini / OpenRouter AI service & Razorpay service
│   ├── index.js             # Express server entry point
│   ├── .env.example         # Server environment template
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/InterviewIQ.git
cd InterviewIQ
```

### 3. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (refer to [server/.env.example](server/.env.example)):
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/interviewiq?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend development server:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 4. Frontend Setup
In a new terminal:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory (refer to [client/.env.example](client/.env.example)):
```env
VITE_FIREBASE_APIKEY=your_firebase_web_api_key
VITE_SERVER_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the Vite development server:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/google` | Google sign-in or demo sign-in | No |
| `GET` | `/api/auth/logout` | Clear auth token cookie | No |
| `GET` | `/api/user/current-user` | Fetch authenticated user profile & credits | Yes |
| `POST` | `/api/interview/resume` | Upload & extract structured resume data | Yes |
| `POST` | `/api/interview/generate-questions` | Generate 5 progressive interview questions | Yes |
| `POST` | `/api/interview/submit-answer` | Submit and evaluate candidate answer with AI | Yes |
| `POST` | `/api/interview/finish` | Finalize interview and calculate average metrics | Yes |
| `GET` | `/api/interview/get-interview` | List past interview history for user | Yes |
| `GET` | `/api/interview/report/:id` | Fetch detailed report for an interview | Yes |
| `POST` | `/api/payment/order` | Create Razorpay order | Yes |
| `POST` | `/api/payment/verify` | Verify payment signature and credit top-up | Yes |

---

## 🛡️ License

This project is licensed under the [ISC License](LICENSE).
