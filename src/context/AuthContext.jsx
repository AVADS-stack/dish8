import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) return null;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("name, address")
        .eq("id", authUser.id)
        .single();
      return {
        id: authUser.id,
        email: authUser.email,
        name: data?.name || authUser.user_metadata?.name || "",
        address: data?.address || "",
      };
    } catch {
      // Profile might not exist yet (race condition on signup)
      return {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || "",
        address: "",
      };
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const saved = localStorage.getItem("d8_user");
      setUser(saved ? JSON.parse(saved) : null);
      setLoading(false);
      return;
    }

    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        const profile = await loadProfile(session.user);
        if (mounted) setUser(profile);
      }
      if (mounted) setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session?.user) {
            const profile = await loadProfile(session.user);
            if (mounted) setUser(profile);
          }
        } else if (event === "SIGNED_OUT") {
          if (mounted) setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  // Sync localStorage fallback
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      if (user) localStorage.setItem("d8_user", JSON.stringify(user));
      else localStorage.removeItem("d8_user");
    }
  }, [user]);

  const signup = async (name, email, password, address) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: window.location.origin + "/auth",
        },
      });
      if (error) throw error;

      // If email confirmation is disabled, user is signed in immediately
      if (data.session) {
        // Create/update profile
        await supabase.from("profiles").upsert({
          id: data.user.id,
          name,
          address,
          email,
        });
        const profile = await loadProfile(data.user);
        setUser(profile);
        return data.user;
      }

      // Email confirmation enabled — user must confirm first
      if (data.user && !data.session) {
        // Try to create profile anyway (trigger may have done it)
        await supabase.from("profiles").upsert({
          id: data.user.id,
          name,
          address,
          email,
        }).then(() => {}, () => {});
        // Return a marker so the UI can show "check your email"
        return { needsConfirmation: true, email };
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
      // onAuthStateChange will handle setting the user
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
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
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
