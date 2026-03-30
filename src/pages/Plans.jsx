import { useNavigate } from "react-router-dom";
import { useSubscription, PLANS } from "../context/SubscriptionContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isStripeConfigured, redirectToSubscription } from "../lib/stripe.js";
import SEO from "../components/SEO.jsx";

export default function Plans() {
  const { subscription, subscribe, cancelSubscription, activePlan } =
    useSubscription();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = (planId) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Try Stripe Payment Link
    if (isStripeConfigured()) {
      const redirected = redirectToSubscription(planId, user.email);
      if (redirected) return;
    }

    // Fallback: demo mode (no payment)
    subscribe(planId);
    navigate("/weekly");
  };

  // Handle return from Stripe success
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const subscribedPlan = params.get("subscribed");
    if (subscribedPlan && !activePlan) {
      subscribe(subscribedPlan);
      window.history.replaceState({}, "", "/weekly");
      navigate("/weekly");
      return null;
    }
  }

  return (
    <div className="plans-page">
      <SEO
        title="Subscription Plans"
        description="Subscribe to Dish8 from $99.99/mo. Lunch or dinner plans with 19+ cuisines. Every meal just $9.99 — delivery included."
        path="/plans"
      />
      <div className="plans-header">
        <h1>Choose Your Plan</h1>
        <p>
          Unlimited access to 19+ world cuisines. Every meal just{" "}
          <strong>$9.99</strong> — delivery included, taxes extra.
        </p>
      </div>

      <div className="plans-grid">
        {PLANS.map((plan) => {
          const isActive = activePlan?.id === plan.id;
          return (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? "popular" : ""} ${
                isActive ? "active" : ""
              }`}
            >
              {plan.popular && (
                <div className="popular-badge">Best Value</div>
              )}
              {isActive && <div className="active-badge">Current Plan</div>}
              <div
                className="plan-accent"
                style={{ background: plan.color }}
              />
              <div className="plan-body">
                <h2>{plan.name}</h2>
                <div className="plan-price">
                  <span className="price-amount">${plan.price}</span>
                  <span className="price-period">/month</span>
                </div>
                <p className="plan-desc">{plan.description}</p>
                <div className="plan-meal-price">
                  <span>Each meal: </span>
                  <strong>${plan.mealPrice}/meal</strong>
                </div>
                <ul className="plan-features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <span className="check">✓</span> {f}
                    </li>
                  ))}
                </ul>
                {isActive ? (
                  <button
                    className="btn btn-outline btn-block"
                    onClick={cancelSubscription}
                  >
                    Cancel Plan
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-block"
                    style={{ background: plan.color }}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading}
                  >
                    {loading
                      ? "Loading..."
                      : !user
                      ? "Sign In to Subscribe"
                      : subscription
                      ? "Switch Plan"
                      : "Get Started"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="plans-faq">
        <h2>How Pricing Works</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Monthly Subscription</h3>
            <p>
              Pay $99.99/mo for lunch only or dinner only. Pay $199.99/mo for
              both lunch & dinner. This unlocks the discounted $9.99/meal rate.
            </p>
          </div>
          <div className="faq-item">
            <h3>Per-Meal Cost</h3>
            <p>
              Each complete meal (2 appetizers + main course + side dish) costs
              $9.99. This includes delivery. State taxes are applied at checkout.
            </p>
          </div>
          <div className="faq-item">
            <h3>Order Cancellation</h3>
            <p>
              You may cancel any individual meal order within 24 hours of
              placing it for a full refund of the $9.99 per-meal charge.
              Cancellations after 24 hours are not eligible for a refund.
            </p>
          </div>
          <div className="faq-item">
            <h3>Flexible Ordering</h3>
            <p>
              Order for just one day, an entire week, or the full month. You
              must order at least 24 hours before meal time.
            </p>
          </div>
          <div className="faq-item">
            <h3>Delivery</h3>
            <p>
              Food is delivered anytime within 24 hours of your scheduled meal
              time. Delivery cost is included in the $9.99/meal price.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
