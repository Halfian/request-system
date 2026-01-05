import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAvafu1qukRmKhUE8O6jhNNIF2PiHj7bfY",
    authDomain: "request-system-c5730.firebaseapp.com",
    projectId: "request-system-c5730",
    storageBucket: "request-system-c5730.firebasestorage.app",
    messagingSenderId: "174073891284",
    appId: "1:174073891284:web:bef352061fdf9f1885ee41",
    measurementId: "G-RTNJFSFNVZ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);