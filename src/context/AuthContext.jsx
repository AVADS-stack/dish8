import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("d8_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("d8_user", JSON.stringify(user));
    else localStorage.removeItem("d8_user");
  }, [user]);

  const signup = (name, email, password, address) => {
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      address,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return newUser;
  };

  const login = (email) => {
    const saved = localStorage.getItem("d8_user");
    if (saved) {
      const u = JSON.parse(saved);
      if (u.email === email) {
        setUser(u);
        return u;
      }
    }
    return null;
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
