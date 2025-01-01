import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAdqTa5ScOEyMtiVtwNyDkiIQSop0e9ZlY",
  authDomain: "sb-alpine-tours.firebaseapp.com",
  projectId: "sb-alpine-tours",
  databaseURL: "https://sb-alpine-tours-default-rtdb.firebaseio.com",
  storageBucket: "sb-alpine-tours.firebasestorage.app",
  messagingSenderId: "820077641021",
  appId: "1:820077641021:web:9d7224ce64e6bdbccb1954"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database as db };