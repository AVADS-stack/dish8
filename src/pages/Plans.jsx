import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription, PLANS } from "../context/SubscriptionContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isStripeConfigured, redirectToCheckout } from "../lib/stripe.js";
import SEO from "../components/SEO.jsx";

// Map plan IDs to Stripe Price IDs (set these in Stripe Dashboard → Products)
const STRIPE_PRICE_IDS = {
  lunch: import.meta.env.VITE_STRIPE_PRICE_LUNCH || "",
  dinner: import.meta.env.VITE_STRIPE_PRICE_DINNER || "",
  both: import.meta.env.VITE_STRIPE_PRICE_BOTH || "",
};

export default function Plans() {
  const { subscription, subscribe, cancelSubscription, activePlan } =
    useSubscription();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [processingPlan, setProcessingPlan] = useState(null);
  const [error, setError] = useState("");

  const handleSubscribe = async (planId) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setError("");

    // If Stripe is configured AND we have a price ID for this plan, use Stripe
    const priceId = STRIPE_PRICE_IDS[planId];
    if (isStripeConfigured() && priceId) {
      setProcessingPlan(planId);
      try {
        await redirectToCheckout({
          priceId,
          userEmail: user.email,
        });
      } catch (err) {
        setError(err.message || "Payment failed. Please try again.");
        setProcessingPlan(null);
      }
      return;
    }

    // Fallback: activate subscription without payment (demo mode)
    subscribe(planId);
    navigate("/weekly");
  };

  return (
    <div className="plans-page">
      <SEO
        title="Subscription Plans"
        description="Subscribe to Dish8 from $99.99/mo. Lunch or dinner plans with 19+ cuisines. Every meal just $9.99 — delivery included."
        path="/plans"
      />
      {error && (
        <div className="auth-error" role="alert" style={{ maxWidth: 600, margin: "0 auto 1.5rem" }}>
          {error}
        </div>
      )}
      <div className="plans-header">
        <h1>Choose Your Plan</h1>
        {loading && <p style={{ color: "#999" }}>Loading your account...</p>}
        <p>
          Unlimited access to 19+ world cuisines. Every meal just{" "}
          <strong>$9.99</strong> — delivery included, taxes extra.
        </p>
      </div>

      <div className="plans-grid">
        {PLANS.map((plan) => {
          const isActive = activePlan?.id === plan.id;
          const isProcessing = processingPlan === plan.id;
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
                    disabled={isProcessing || loading}
                  >
                    {loading
                      ? "Loading..."
                      : isProcessing
                      ? "Redirecting to payment..."
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
