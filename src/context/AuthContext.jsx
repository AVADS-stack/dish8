import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase.js";
import { notifySignup } from "../lib/notifications.js";

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

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        const profile = await loadProfile(session.user);
        if (mounted) setUser(profile);
      }
      if (mounted) setLoading(false);
    });

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

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      if (user) localStorage.setItem("d8_user", JSON.stringify(user));
      else localStorage.removeItem("d8_user");
    }
  }, [user]);

  const signup = async (name, email, password) => {
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

      if (!data.user) {
        throw new Error("Signup failed. Please try again.");
      }

      // Check if this is a fake signup (user already exists, Supabase returns
      // an empty user with no identities to prevent email enumeration)
      if (data.user.identities && data.user.identities.length === 0) {
        throw new Error("An account with this email already exists. Please sign in instead.");
      }

      // If session exists, user is signed in immediately (no email confirmation)
      if (data.session) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          name,
          email,
        }).then(() => {}, () => {});
        const profile = await loadProfile(data.user);
        setUser(profile);
        notifySignup(name, email);
        return data.user;
      }

      // No session = email confirmation required
      notifySignup(name, email);
      await supabase.from("profiles").upsert({
        id: data.user.id,
        name,
        email,
      }).then(() => {}, () => {});

      return { needsConfirmation: true, email };
    } else {
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
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

      if (error) {
        // Provide clearer error messages
        if (error.message.includes("Invalid login")) {
          throw new Error("Invalid email or password. Please try again.");
        }
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Please confirm your email first. Check your inbox for the confirmation link.");
        }
        throw error;
      }

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
