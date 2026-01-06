import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (email: string, password: string) => boolean;
  signup: (userData: UserData & { password: string }) => void;
  logout: () => void;
  updateProfile: (userData: UserData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('echoEatsUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Check for demo credentials
    if (email === 'demo@echoears.com' && password === 'demo123') {
      const demoUser: UserData = {
        name: 'Demo User',
        email: 'demo@echoears.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
      };
      setUser(demoUser);
      setIsAuthenticated(true);
      localStorage.setItem('echoEatsUser', JSON.stringify(demoUser));
      return true;
    }

    // Check for registered users
    const savedUser = localStorage.getItem('echoEatsUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const savedPassword = localStorage.getItem('echoEatsPassword');
      
      if (userData.email === email && savedPassword === password) {
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }
    }

    return false;
  };

  const signup = (userData: UserData & { password: string }) => {
    const { password, ...userDataWithoutPassword } = userData;
    setUser(userDataWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('echoEatsUser', JSON.stringify(userDataWithoutPassword));
    localStorage.setItem('echoEatsPassword', password);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Don't clear localStorage on logout so users can login again
  };

  const updateProfile = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('echoEatsUser', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
