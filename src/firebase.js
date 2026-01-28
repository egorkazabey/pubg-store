import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3zhzj5ujN0uybsBisZarxlb60NiYAdeQ",
  authDomain: "pubg-store-dbeb2.firebaseapp.com",
  projectId: "pubg-store-dbeb2",
  storageBucket: "pubg-store-dbeb2.firebasestorage.app",
  messagingSenderId: "675390733668",
  appId: "1:675390733668:web:85aca806b40736b5978e71",
  measurementId: "G-MVH68FLXDM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
