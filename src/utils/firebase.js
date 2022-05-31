import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import firebase from 'firebase/compat';

const firebaseConfig = {
  apiKey: "AIzaSyBw3xJy6aVJpSaUekQ3oGnHmD4uPjs7tyA",
  authDomain: "ar-glasses-9a436.firebaseapp.com",
  projectId: "ar-glasses-9a436",
  storageBucket: "ar-glasses-9a436.appspot.com",
  messagingSenderId: "832639560878",
  appId: "1:832639560878:web:890d53184aa36d5a11513f"
};

firebase.initializeApp(firebaseConfig);

export const firebaseStore = firebase.firestore();
export const firebaseAuth = firebase.auth();
