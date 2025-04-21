
import { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  user: { id: string; email: string; isAdmin: boolean; phone?: string } | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string, verificationCode: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string, verificationCode: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string; isAdmin: boolean; phone?: string } | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Special admin account with predefined credentials
      if (email === "netlifegy@gmail.com" && password === "Zaq12wsx@!") {
        setUser({
          id: "admin-1",
          email,
          isAdmin: true,
          phone: "+1234567890" // Default admin phone for WhatsApp
        });
        return true;
      }
      
      // Legacy admin account
      if (email === "admin@quantum.vault") {
        setUser({
          id: "admin",
          email,
          isAdmin: true
        });
        return true;
      }
      
      // Regular users
      setUser({
        id: "user-" + Math.random().toString(36).substr(2, 9),
        email,
        isAdmin: false,
        phone: "" // By default, no phone number
      });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    try {
      // Prevent creation of admin accounts through signup
      if (email === "netlifegy@gmail.com" || email === "admin@quantum.vault") {
        throw new Error("This email is reserved for admin use");
      }
      
      setUser({
        id: "user-" + Math.random().toString(36).substr(2, 9),
        email,
        isAdmin: false,
        phone: "" // Users can set their phone later
      });
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string, verificationCode: string) => {
    try {
      // In a real app, verify current password and verify the code sent via WhatsApp
      // For demo purposes, we'll accept any verification code that's 6 digits
      if (!verificationCode.match(/^\d{6}$/)) {
        throw new Error("Invalid verification code");
      }
      
      // Password complexity check
      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      
      console.log("Password changed successfully");
      return true;
    } catch (error) {
      console.error("Password change failed:", error);
      return false;
    }
  }, []);
  
  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      // In a real app, this would send a verification code to the user's WhatsApp
      console.log(`Password reset requested for ${email}`);
      return true;
    } catch (error) {
      console.error("Password reset request failed:", error);
      return false;
    }
  }, []);
  
  const resetPassword = useCallback(async (email: string, newPassword: string, verificationCode: string) => {
    try {
      // In a real app, verify the code sent via WhatsApp
      // For demo purposes, we'll accept any verification code that's 6 digits
      if (!verificationCode.match(/^\d{6}$/)) {
        throw new Error("Invalid verification code");
      }
      
      // Password complexity check
      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      
      console.log(`Password reset for ${email}`);
      return true;
    } catch (error) {
      console.error("Password reset failed:", error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = {
    user,
    isAdmin: user?.isAdmin || false,
    isAuthenticated: user !== null,
    login,
    logout,
    signup,
    changePassword,
    requestPasswordReset,
    resetPassword
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
