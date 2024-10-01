// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
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
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics (only in the browser and if supported)
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      const analytics = getAnalytics(app);
      console.log("Analytics initialized:", analytics);
    }
  }).catch((error) => {
    console.error("Error initializing Firebase Analytics:", error);
  });
}

export default app;
