
import { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  user: { id: string; email: string; isAdmin: boolean } | null;
  isAdmin: boolean;
  isAuthenticated: boolean; // Add isAuthenticated property
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<boolean>; // Add signup method
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string; isAdmin: boolean } | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Mock login - in real app would check against backend
      if (email === "admin@quantum.vault") {
        setUser({
          id: "admin",
          email,
          isAdmin: true
        });
        return true;
      }
      
      setUser({
        id: "user-" + Math.random().toString(36).substr(2, 9),
        email,
        isAdmin: false
      });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    try {
      // Mock signup - in real app would register with backend
      setUser({
        id: "user-" + Math.random().toString(36).substr(2, 9),
        email,
        isAdmin: false
      });
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = {
    user,
    isAdmin: user?.isAdmin || false,
    isAuthenticated: user !== null, // Add isAuthenticated derived from user state
    login,
    logout,
    signup // Add signup to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
