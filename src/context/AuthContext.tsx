import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { checkUserIsAdmin, checkUserIsAuthor, BOOTSTRAP_ADMIN_EMAIL } from '../services/firestoreService';
import { AuthorProfile } from '../types';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthor: boolean;
  authorProfile: AuthorProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  adminEmail: string;
  refreshAuthRoles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAuthor: false,
  authorProfile: null,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
  adminEmail: BOOTSTRAP_ADMIN_EMAIL,
  refreshAuthRoles: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [authorProfile, setAuthorProfile] = useState<AuthorProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const evaluateRoles = useCallback(async (currentUser: User | null) => {
    if (currentUser) {
      const adminStatus = await checkUserIsAdmin(currentUser);
      setIsAdmin(adminStatus);
      const authorCheck = await checkUserIsAuthor(currentUser);
      setIsAuthor(authorCheck.isAuthor);
      setAuthorProfile(authorCheck.authorProfile || null);
    } else {
      setIsAdmin(false);
      setIsAuthor(false);
      setAuthorProfile(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await evaluateRoles(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [evaluateRoles]);

  const refreshAuthRoles = async () => {
    if (user) {
      await evaluateRoles(user);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await evaluateRoles(result.user);
    } catch (error) {
      console.error('Google Sign-in Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      setIsAuthor(false);
      setAuthorProfile(null);
    } catch (error) {
      console.error('Sign-out Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isAuthor,
        authorProfile,
        loading,
        loginWithGoogle,
        logout,
        adminEmail: BOOTSTRAP_ADMIN_EMAIL,
        refreshAuthRoles
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

