// useAuth.js - Hook Only (No JSX)
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for protected routes - move this to a separate .jsx file if needed
// For now, just export the logic and implement the JSX in your components