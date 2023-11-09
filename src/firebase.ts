import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAh333Isf8I52gFl3hgJWTw11oJOPOUVMo',
  authDomain: 'nwitter-reloaded-b6fb6.firebaseapp.com',
  projectId: 'nwitter-reloaded-b6fb6',
  storageBucket: 'nwitter-reloaded-b6fb6.appspot.com',
  messagingSenderId: '254350253191',
  appId: '1:254350253191:web:3328c53b19a6051a56ac22',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
