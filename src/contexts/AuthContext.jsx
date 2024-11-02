import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const signup = async (email, password, userData) => {
    try {
      setAuthError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        ...userData,
        email,
        helpfulnessScore: 0,
        tasksCompleted: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      toast.success('Account created successfully!');
      return { success: true, user: result.user };
    } catch (error) {
      setAuthError(error.message);
      toast.error(getFirebaseErrorMessage(error.code));
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);
      console.log('Attempting Firebase')
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login timestamp
      const userRef = doc(db, 'users', result.user.uid);
      await updateDoc(userRef, {
        lastLogin: new Date().toISOString()
      });

      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setCurrentUser({
          ...result.user,
          ...docSnap.data()
        });
      }

      console.log('Login SucessFull , user data updated')




      return { success: true, user: result.user };
    } catch (error) {
      setAuthError(error.message);
      toast.error(getFirebaseErrorMessage(error.code));
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      toast.error('Failed to log out');
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
      return { success: true };
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error.code));
      return { success: false, error: error.message };
    }
  };

  // Helper function to get user-friendly error messages
  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Invalid password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'An error occurred. Please try again';
    }
  };

  // Update user profile data
  const updateUserProfile = async (userId, updateData) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      
      // Update local user state
      setCurrentUser(prev => ({
        ...prev,
        ...updateData
      }));
      
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      toast.error('Failed to update profile');
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setCurrentUser({
              ...user,
              ...docSnap.data()
            });
          } else {
            // Handle case where user auth exists but no Firestore document
            console.error('No user document found for authenticated user');
            setCurrentUser(user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    authError,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;