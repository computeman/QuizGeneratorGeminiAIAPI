// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase.config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const createUserProfile = async (userId, email) => {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
       profile: {
         email,
          createdAt: new Date(),
          displayName: ''
       }
    }, { merge: true });
};

const getUserData = async (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
       return userDoc.data()
    } else {
       return null
    }
}

const addQuizToHistory = async (userId, quizData) => {
  const userQuizzesCollection = collection(db, `users/${userId}/quizzes`);
    await addDoc(userQuizzesCollection, quizData);
};
  const getQuizHistory = async (userId) => {
     const userQuizzesCollection = collection(db, `users/${userId}/quizzes`);
     const q = query(userQuizzesCollection);
     const querySnapshot = await getDocs(q);
     const quizHistory = [];
     querySnapshot.forEach(doc => {
        quizHistory.push({id: doc.id, ...doc.data()})
     })

     return quizHistory
  }

export {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    createUserProfile,
    addQuizToHistory,
    getUserData,
    getQuizHistory,
};