import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const tabs = [
  { path: "/", icon: "home", label: "Home" },
  { path: "/weekly", icon: "calendar", label: "Menu" },
  { path: "/plans", icon: "star", label: "Plans" },
  { path: "/cart", icon: "cart", label: "Cart" },
  { path: "/account", icon: "user", label: "Account" },
];

const icons = {
  home: (active) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#e50914" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  calendar: (active) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#e50914" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  star: (active) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#e50914" : "none"} stroke={active ? "#e50914" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  cart: (active) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#e50914" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  user: (active) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#e50914" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

export default function MobileTabBar() {
  const location = useLocation();
  const { getCartSummary } = useCart();
  const { user } = useAuth();
  const { totalItems } = getCartSummary();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="mobile-tab-bar" aria-label="Main navigation">
      {tabs.map((tab) => {
        const active = isActive(tab.path);
        // If not logged in, redirect account tab to auth
        const href = tab.path === "/account" && !user ? "/auth" : tab.path;
        return (
          <Link
            key={tab.path}
            to={href}
            className={`tab-item ${active ? "active" : ""}`}
            aria-label={tab.label}
            aria-current={active ? "page" : undefined}
          >
            <span className="tab-icon">
              {icons[tab.icon](active)}
              {tab.icon === "cart" && totalItems > 0 && (
                <span className="tab-badge">{totalItems}</span>
              )}
            </span>
            <span className="tab-label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
