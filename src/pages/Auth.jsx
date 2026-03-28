import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import SEO from "../components/SEO.jsx";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const { signup, login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  useEffect(() => {
    if (user) navigate("/account");
  }, [user, navigate]);

  if (user || loading) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "signup") {
        if (!form.name || !form.email || !form.password || !form.address) {
          setError("All fields are required.");
          setSubmitting(false);
          return;
        }
        if (form.password.length < 6) {
          setError("Password must be at least 6 characters.");
          setSubmitting(false);
          return;
        }
        await signup(form.name, form.email, form.password, form.address);
        navigate("/plans");
      } else {
        if (!form.email || !form.password) {
          setError("Email and password are required.");
          setSubmitting(false);
          return;
        }
        const u = await login(form.email, form.password);
        if (!u) {
          setError("Invalid email or password. Please try again.");
          setSubmitting(false);
          return;
        }
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="auth-page">
      <SEO
        title={mode === "login" ? "Sign In" : "Create Account"}
        description="Sign in or create your Dish8 account to start ordering meals from 19+ world cuisines."
        path="/auth"
      />
      <div className="auth-card">
        <h1>{mode === "login" ? "Sign In" : "Create Account"}</h1>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Welcome back to Dish8"
            : "Join Dish8 — every user needs an account to order"}
        </p>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              minLength={6}
              required
            />
          </div>
          {mode === "signup" && (
            <div className="form-group">
              <label>Delivery Address</label>
              <textarea
                placeholder="Your delivery address"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                rows={2}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <p className="auth-toggle">
          {mode === "login" ? (
            <>
              New to Dish8?{" "}
              <button type="button" onClick={() => { setMode("signup"); setError(""); }}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => { setMode("login"); setError(""); }}>
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
