
import { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from local storage)
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('quantum-vault-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function - for now a mock implementation
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // This is just a mock - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      // Mock successful login for demo purposes
      // In a real app, validate credentials with backend
      if (email && password) {
        const mockUser = {
          id: 'user-1',
          username: email.split('@')[0],
          email: email,
          isAdmin: email.includes('admin'),
        };
        
        localStorage.setItem('quantum-vault-user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function - for now a mock implementation
  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // This is just a mock - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      // Mock successful signup for demo purposes
      if (username && email && password) {
        const mockUser = {
          id: `user-${Date.now()}`,
          username: username,
          email: email,
          isAdmin: false,
        };
        
        localStorage.setItem('quantum-vault-user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('quantum-vault-user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
