// Imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

//Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAZbH3O6ZdQ7MFLT6SDcLaF8TCyOhTeU9I",
  authDomain: "tcc-app-54f7d.firebaseapp.com",
  projectId: "tcc-app-54f7d",
  storageBucket: "tcc-app-54f7d.appspot.com",
  messagingSenderId: "641768043218",
  appId: "1:641768043218:web:be002d77449f6b00e0b30b",
  measurementId: "G-LZCZWR1FGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
