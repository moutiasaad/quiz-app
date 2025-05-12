import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBB81_MqReUBtkS6gCrehpR5ZEv0XT3Nxo",
  authDomain: "quiz-89b35.firebaseapp.com",
  projectId: "quiz-89b35",
  storageBucket: "quiz-89b35.firebasestorage.app",
  messagingSenderId: "682770601517",
  appId: "1:682770601517:web:c8e5b49caa247299da8aa4"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
