import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBw3xJy6aVJpSaUekQ3oGnHmD4uPjs7tyA",
  authDomain: "ar-glasses-9a436.firebaseapp.com",
  projectId: "ar-glasses-9a436",
  storageBucket: "ar-glasses-9a436.appspot.com",
  messagingSenderId: "832639560878",
  appId: "1:832639560878:web:890d53184aa36d5a11513f"
};

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseStore = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

export default firebaseApp;
