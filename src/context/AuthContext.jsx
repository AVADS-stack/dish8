import { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          loadProfile(session.user.id).then((profile) => {
            setUser({ ...session.user, ...profile });
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            const profile = await loadProfile(session.user.id);
            setUser({ ...session.user, ...profile });
          } else {
            setUser(null);
          }
        }
      );
      return () => subscription.unsubscribe();
    } else {
      // Fallback: localStorage
      const saved = localStorage.getItem("d8_user");
      setUser(saved ? JSON.parse(saved) : null);
      setLoading(false);
    }
  }, []);

  // Sync to localStorage when not using Supabase
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      if (user) localStorage.setItem("d8_user", JSON.stringify(user));
      else localStorage.removeItem("d8_user");
    }
  }, [user]);

  async function loadProfile(userId) {
    const { data } = await supabase
      .from("profiles")
      .select("name, address")
      .eq("id", userId)
      .single();
    return data || {};
  }

  const signup = async (name, email, password, address) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;

      // Create profile row
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          name,
          address,
          email,
        });
      }
      return data.user;
    } else {
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        address,
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      return newUser;
    }
  };

  const login = async (email, password) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data.user;
    } else {
      const saved = localStorage.getItem("d8_user");
      if (saved) {
        const u = JSON.parse(saved);
        if (u.email === email) {
          setUser(u);
          return u;
        }
      }
      return null;
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (isSupabaseConfigured() && user) {
      await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);
    }
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
