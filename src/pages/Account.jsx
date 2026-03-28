import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSubscription } from "../context/SubscriptionContext.jsx";

export default function Account() {
  const { user, logout } = useAuth();
  const { activePlan, cancelSubscription } = useSubscription();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Please Sign In</h1>
          <p>You need an account to access this page.</p>
          <Link to="/auth" className="btn btn-primary btn-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-card">
        <div className="account-avatar">
          <span>{user.name[0]}</span>
        </div>
        <h1>{user.name}</h1>
        <p className="account-email">{user.email}</p>

        <div className="account-section">
          <h3>Delivery Address</h3>
          <p>{user.address}</p>
        </div>

        <div className="account-section">
          <h3>Subscription</h3>
          {activePlan ? (
            <div className="account-plan">
              <div className="plan-info">
                <strong>{activePlan.name}</strong>
                <span>${activePlan.price}/mo</span>
              </div>
              <p>{activePlan.description}</p>
              <p className="plan-detail">
                Each meal: ${activePlan.mealPrice} (delivery included, taxes
                extra)
              </p>
              <div className="account-plan-actions">
                <Link to="/plans" className="btn btn-outline btn-sm">
                  Change Plan
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={cancelSubscription}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="no-plan">
              <p>No active subscription</p>
              <Link to="/plans" className="btn btn-primary btn-sm">
                View Plans
              </Link>
            </div>
          )}
        </div>

        <div className="account-section">
          <h3>Quick Links</h3>
          <div className="quick-links">
            <Link to="/weekly" className="btn btn-secondary btn-sm">
              Build Weekly Menu
            </Link>
            <Link to="/cart" className="btn btn-secondary btn-sm">
              View Cart
            </Link>
            <Link to="/" className="btn btn-secondary btn-sm">
              Browse Cuisines
            </Link>
          </div>
        </div>

        <button
          className="btn btn-outline btn-block"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
