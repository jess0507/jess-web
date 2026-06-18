import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// 從環境變數讀取 Firebase 設定(見 .env.example)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Storage:存取圖片、檔案等媒體
export const storage = getStorage(app);

// 日後若要擴充其他 Firebase 服務,解除下列註解並安裝對應模組:
// import { getAuth } from 'firebase/auth';
// export const auth = getAuth(app);
// import { getFirestore } from 'firebase/firestore';
// export const db = getFirestore(app);

export default app;
