# AI Code Reviewer

A powerful, full-stack application that leverages Artificial Intelligence to automatically review code, detect potential issues, suggest improvements, and recommend better folder structures.

![Hero Image](frontend/src/assets/HeroImage.png)

## 🚀 Features

-   **AI-Powered Analysis**: Deep code analysis using advanced LLMs to identify bugs, security vulnerabilities, and performance bottlenecks.
-   **Smart Suggestions**: Contextual recommendations for better code patterns and best practices.
-   **Structure Recommendations**: Intelligent suggestions for project organization and folder structure.
-   **GitHub Integration**: Seamlessly connect with GitHub repositories (planned/in-progress).
-   **File Upload**: Support for uploading repository ZIP files directly.
-   **Responsive Design**: A modern, fully responsive UI built with React and Tailwind CSS.
-   **Background Processing**: Asynchronous job processing for handling large codebases without blocking the UI.

## 🛠️ Tech Stack

### Frontend
-   **React** (Vite)
-   **Tailwind CSS** (Styling)
-   **React Router** (Navigation)
-   **Axios** (API Communication)
-   **React Query** (State Management)

### Backend
-   **Node.js & Express**
-   **MongoDB & Mongoose** (Database)
-   **JWT & BCrypt** (Authentication)
-   **AWS S3** (File Storage)
-   **OpenAI API** (AI Logic)

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
-   Node.js (v18+)
-   MongoDB (Local or Atlas)
-   AWS Account (for S3)
-   OpenAI API Key

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/AI-Code-Reviewer.git
cd AI-Code-Reviewer
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# AWS S3 Configuration
S3_REGION=your_aws_region
S3_KEY=your_aws_access_key
S3_SECRET=your_aws_secret_key
S3_BUCKET=your_s3_bucket_name

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_URL=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=gpt-4o
```

### 3. Frontend Setup
Navigate to the frontend folder and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:4000/v1/api
```

## 🏃‍♂️ Running the Application

To run the full application locally, you need to start three processes:

1.  **Backend API Server**:
    ```bash
    # Inside /backend
    npm run dev
    ```

2.  **Background Worker** (Handles the AI processing):
    ```bash
    # Inside /backend (open a new terminal)
    npm run worker
    ```

3.  **Frontend Development Server**:
    ```bash
    # Inside /frontend (open a new terminal)
    npm run dev
    ```

Open your browser and visit `http://localhost:5173`.

## 🐳 Deployment

### Backend
The backend consists of two services that must run simultaneously:
1.  **Web Server**: Run `npm start`.
2.  **Worker Service**: Run `npm run worker`.

Ensure both services share the same database and environment variables.

### Frontend
Build the frontend using `npm run build` and deploy the `dist` folder to any static site provider (Vercel, Netlify, AWS S3).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.