// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDSZi3R2Dg85MtiiWfVJTax7_e_tQmFqJI',
  authDomain: 'grocare-7442b.firebaseapp.com',
  projectId: 'grocare-7442b',
  storageBucket: 'grocare-7442b.appspot.com',
  messagingSenderId: '541721047108',
  appId: '1:541721047108:web:29338a9c51aaa26301cc11',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;
