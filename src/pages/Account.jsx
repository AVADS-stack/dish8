import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useSubscription } from "../context/SubscriptionContext.jsx";
import { getOrderHistory } from "../lib/orders.js";
import SEO from "../components/SEO.jsx";

export default function Account() {
  const { user, logout, loading } = useAuth();
  const { activePlan, subscription, cancelSubscription } = useSubscription();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      getOrderHistory().then((data) => {
        setOrders(data);
        setOrdersLoading(false);
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">Loading your dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Please Sign In</h1>
          <p>You need an account to access your dashboard.</p>
          <Link to="/auth" className="btn btn-primary btn-block">Sign In</Link>
        </div>
      </div>
    );
  }

  const totalMealsOrdered = orders.reduce((sum, o) => sum + (o.total_meals || 0), 0);
  const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
  const completedOrders = orders.filter((o) => o.status === "confirmed" || o.status === "delivered");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: `Orders (${orders.length})` },
    { id: "subscription", label: "Subscription" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="dashboard-page">
      <SEO title="My Dashboard" description="Manage your Dish8 account, orders, and subscription." path="/account" />

      {/* Header */}
      <div className="dash-header">
        <div className="dash-user">
          <div className="dash-avatar"><span>{(user.name || user.email)[0].toUpperCase()}</span></div>
          <div>
            <h1>{user.name || "Welcome"}</h1>
            <p className="dash-email">{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => { logout(); navigate("/"); }}
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`dash-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="dash-content">
          {/* Stats */}
          <div className="dash-stats">
            <div className="stat-card">
              <span className="stat-value">{orders.length}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{totalMealsOrdered}</span>
              <span className="stat-label">Meals Ordered</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">${totalSpent.toFixed(2)}</span>
              <span className="stat-label">Total Spent</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{activePlan ? activePlan.name : "None"}</span>
              <span className="stat-label">Current Plan</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dash-section">
            <h2>Quick Actions</h2>
            <div className="dash-actions">
              {!activePlan ? (
                <Link to="/plans" className="btn btn-primary">Subscribe Now — from $99.99/mo</Link>
              ) : (
                <Link to="/weekly" className="btn btn-primary">Build Weekly Menu</Link>
              )}
              <Link to="/" className="btn btn-secondary">Browse Cuisines</Link>
              <Link to="/cart" className="btn btn-secondary">View Cart</Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="dash-section">
            <div className="dash-section-header">
              <h2>Recent Orders</h2>
              {orders.length > 0 && (
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setActiveTab("orders")}>
                  View All
                </button>
              )}
            </div>
            {ordersLoading ? (
              <p className="dash-muted">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="dash-empty">
                <p>No orders yet.</p>
                {activePlan ? (
                  <Link to="/weekly" className="btn btn-primary btn-sm">Start Ordering</Link>
                ) : (
                  <Link to="/plans" className="btn btn-primary btn-sm">Subscribe to Start</Link>
                )}
              </div>
            ) : (
              <div className="order-list">
                {orders.slice(0, 3).map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="dash-content">
          <h2>Order History</h2>
          {ordersLoading ? (
            <p className="dash-muted">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="dash-empty">
              <p>No orders yet. Start building your weekly meals!</p>
              <Link to="/weekly" className="btn btn-primary btn-sm">Build Weekly Menu</Link>
            </div>
          ) : (
            <div className="order-list">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} showItems />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="dash-content">
          <h2>Subscription</h2>
          {activePlan ? (
            <div className="sub-detail-card">
              <div className="sub-header">
                <div>
                  <h3>{activePlan.name}</h3>
                  <p className="sub-price">${activePlan.price}/month</p>
                </div>
                <span className="sub-status active">Active</span>
              </div>
              <div className="sub-info-grid">
                <div className="sub-info">
                  <span className="sub-info-label">Per Meal</span>
                  <span className="sub-info-value">${activePlan.mealPrice}</span>
                </div>
                <div className="sub-info">
                  <span className="sub-info-label">Meal Times</span>
                  <span className="sub-info-value">{activePlan.meals.map((m) => m === "lunch" ? "Lunch" : "Dinner").join(" & ")}</span>
                </div>
                <div className="sub-info">
                  <span className="sub-info-label">Delivery</span>
                  <span className="sub-info-value">Included</span>
                </div>
                <div className="sub-info">
                  <span className="sub-info-label">Meals Ordered</span>
                  <span className="sub-info-value">{totalMealsOrdered}</span>
                </div>
                <div className="sub-info">
                  <span className="sub-info-label">Started</span>
                  <span className="sub-info-value">
                    {subscription?.startDate
                      ? new Date(subscription.startDate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <div className="sub-info">
                  <span className="sub-info-label">Total Spent on Meals</span>
                  <span className="sub-info-value">${totalSpent.toFixed(2)}</span>
                </div>
              </div>
              <div className="sub-features">
                <h4>Plan Features</h4>
                <ul>
                  {activePlan.features.map((f) => (
                    <li key={f}><span className="check">✓</span> {f}</li>
                  ))}
                </ul>
              </div>
              <div className="sub-actions">
                <Link to="/plans" className="btn btn-outline btn-sm">Change Plan</Link>
                <button type="button" className="btn btn-danger btn-sm" onClick={cancelSubscription}>
                  Cancel Subscription
                </button>
              </div>
              <p className="sub-note">
                Cancellation takes effect at the end of the current billing cycle.
                Per-meal orders can be cancelled within 24 hours of placement.
              </p>
            </div>
          ) : (
            <div className="dash-empty">
              <h3>No Active Subscription</h3>
              <p>Subscribe to unlock $9.99/meal pricing with delivery included.</p>
              <Link to="/plans" className="btn btn-primary">View Subscription Plans</Link>
            </div>
          )}
        </div>
      )}

      {activeTab === "settings" && (
        <div className="dash-content">
          <h2>Account Settings</h2>
          <div className="settings-section">
            <h3>Profile</h3>
            <div className="settings-row">
              <span className="settings-label">Name</span>
              <span className="settings-value">{user.name || "Not set"}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Email</span>
              <span className="settings-value">{user.email}</span>
            </div>
          </div>

          <div className="settings-section">
            <h3>Saved Address</h3>
            <p className="settings-value">{user.address || "No address saved. You can enter one at checkout."}</p>
          </div>

          <div className="settings-section">
            <h3>Legal</h3>
            <div className="settings-links">
              <Link to="/terms">Terms & Conditions</Link>
              <Link to="/refund-policy">Refund Policy</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>

          <div className="settings-section settings-danger">
            <h3>Account</h3>
            <button
              type="button"
              className="btn btn-outline btn-block"
              onClick={() => { logout(); navigate("/"); }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, showItems = false }) {
  const date = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusColors = {
    pending: "#e87c03",
    confirmed: "#46d369",
    preparing: "#4facfe",
    delivered: "#46d369",
    cancelled: "#e50914",
  };

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div>
          <span className="order-id">#{order.id?.slice(0, 8)}</span>
          <span className="order-date">{date}</span>
        </div>
        <span className="order-status" style={{ color: statusColors[order.status] || "#999" }}>
          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
        </span>
      </div>
      <div className="order-card-summary">
        <span>{order.total_meals} meal{order.total_meals !== 1 ? "s" : ""}</span>
        <span className="order-sep">·</span>
        <span>{order.subscription_plan || "No plan"}</span>
        <span className="order-sep">·</span>
        <span className="order-total">${parseFloat(order.total || 0).toFixed(2)}</span>
      </div>
      {order.delivery_address && (
        <p className="order-address">{order.delivery_address}</p>
      )}
      {showItems && order.order_items && order.order_items.length > 0 && (
        <div className="order-items-table">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Meal</th>
                <th>Appetizer 1</th>
                <th>Appetizer 2</th>
                <th>Main</th>
                <th>Side</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item, i) => (
                <tr key={i}>
                  <td>{item.day}</td>
                  <td>{item.meal_time === "lunch" ? "Lunch" : "Dinner"}</td>
                  <td>{item.appetizer1_name}</td>
                  <td>{item.appetizer2_name}</td>
                  <td>{item.main_name}</td>
                  <td>{item.side_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
