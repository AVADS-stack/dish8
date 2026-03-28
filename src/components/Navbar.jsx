import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useSubscription } from "../context/SubscriptionContext.jsx";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartSummary } = useCart();
  const { activePlan } = useSubscription();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { totalItems } = getCartSummary();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🍽</span>
          <span className="brand-text">Dish<span className="brand-8">8</span></span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${menuOpen ? "open" : ""}`} />
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Browse
          </Link>
          <Link to="/weekly" onClick={() => setMenuOpen(false)}>
            Weekly Menu
          </Link>
          <Link to="/plans" onClick={() => setMenuOpen(false)}>
            {activePlan ? (
              <span className="plan-badge">{activePlan.name}</span>
            ) : (
              "Subscribe"
            )}
          </Link>
          <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
            🛒
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>
          {user ? (
            <div className="user-menu">
              <Link to="/account" onClick={() => setMenuOpen(false)}>
                <span className="avatar">{user.name[0]}</span>
              </Link>
              <button
                className="btn-logout"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                  navigate("/");
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-signin" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
