// src/context/AuthContext.js
import React, { useState, createContext, useEffect } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged } from '../services/firebase';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


   useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setUser(user);
                setLoading(false);
            });

            return () => unsubscribe();
        }, []);

    const signup = async (email, password) => {
      try {
           await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
             console.error("Error signing up:", error);
             throw error;
        }
    };

    const login = async (email, password) => {
      try {
            await signInWithEmailAndPassword(auth, email, password);
      } catch(error) {
          console.error("Error loggin in", error)
          throw error;
      }
    };

    const logout = async () => {
      try {
        await signOut(auth)
      } catch (error) {
          console.error("Error loggin out", error)
          throw error;
      }
    };


    const resetPassword = async (email) => {
        try {
             await sendPasswordResetEmail(auth,email)
        } catch (error){
            console.error("Error reseting password", error)
            throw error;
        }
    };

    const value = {
        user,
        loading,
        signup,
        login,
        logout,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };