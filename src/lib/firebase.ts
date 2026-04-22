import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// 🏛️ Sanctuary Firebase Configuration
// Values should be synchronized from the Firebase Console to your .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

// Initialize Firebase
console.log("🔥 FIREBASE_INIT: Checking Hostname Awareness");
console.log("📍 Current Hostname:", window.location.hostname);
console.log("🔑 API Key in use:", firebaseConfig.apiKey);
console.log("🌐 Auth Domain in use:", firebaseConfig.authDomain);

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export default app;
