import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const { signup, login, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  useEffect(() => {
    if (user) navigate("/account");
  }, [user, navigate]);

  if (user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!form.name || !form.email || !form.password || !form.address) {
        setError("All fields are required.");
        return;
      }
      signup(form.name, form.email, form.password, form.address);
      navigate("/plans");
    } else {
      if (!form.email || !form.password) {
        setError("Email and password are required.");
        return;
      }
      const u = login(form.email);
      if (!u) {
        setError("No account found with that email. Please sign up.");
        return;
      }
      navigate("/");
    }
  };

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{mode === "login" ? "Sign In" : "Create Account"}</h1>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Welcome back to Dish8"
            : "Join Dish8 — every user needs an account to order"}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
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
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
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
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="auth-toggle">
          {mode === "login" ? (
            <>
              New to Dish8?{" "}
              <button type="button" onClick={() => setMode("signup")}>Sign Up</button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("login")}>Sign In</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
