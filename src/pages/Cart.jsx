import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useSubscription } from "../context/SubscriptionContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isStripeConfigured, redirectToMealPayment } from "../lib/stripe.js";
import { sendOrderConfirmation } from "../lib/email.js";
import AddressAutocomplete from "../components/AddressAutocomplete.jsx";
import { useState } from "react";

const TAX_RATE = 0.08;
const COURSE_LABELS = {
  appetizer1: "Appetizer 1",
  appetizer2: "Appetizer 2",
  main: "Main Course",
  side: "Side Dish",
};

export default function Cart() {
  const { getCartByDay, getCartSummary, clearDay, clearCart, isMealComplete, DAYS, COURSE_SLOTS } =
    useCart();
  const { activePlan } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [addressError, setAddressError] = useState("");

  const cartByDay = getCartByDay();
  const summary = getCartSummary();
  const subscriptionPrice = activePlan ? activePlan.price : 0;
  const mealSubtotal = summary.subtotal;
  const combinedSubtotal = mealSubtotal + subscriptionPrice;
  const tax = +(combinedSubtotal * TAX_RATE).toFixed(2);
  const total = +(combinedSubtotal + tax).toFixed(2);
  const isEmpty = Object.keys(cartByDay).length === 0;

  const handleCheckout = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!activePlan) {
      navigate("/plans");
      return;
    }
    if (summary.totalMeals === 0) return;

    if (!deliveryAddress.trim()) {
      setAddressError("Please enter a delivery address.");
      return;
    }
    setAddressError("");

    // If Stripe is configured, redirect to Stripe Payment Link for meal payment
    if (isStripeConfigured()) {
      setProcessing(true);
      const redirected = redirectToMealPayment(summary.totalMeals, user.email);
      if (redirected) return;
      setProcessing(false);
    }

    // Place order and send confirmation email
    await placeOrderAndNotify();
  };

  const placeOrderAndNotify = async () => {
    // Build order items from cart before clearing
    const items = [];
    DAYS.forEach((day) => {
      ["lunch", "dinner"].forEach((mealTime) => {
        if (isMealComplete(day, mealTime)) {
          const meal = getCartByDay()[day]?.[mealTime];
          if (meal) {
            items.push({
              day,
              mealTime,
              appetizer1: meal.appetizer1?.name || "",
              appetizer2: meal.appetizer2?.name || "",
              main: meal.main?.name || "",
              side: meal.side?.name || "",
            });
          }
        }
      });
    });

    setOrderPlaced(true);
    clearCart();

    const fullAddress = unitNumber.trim()
      ? `${deliveryAddress}, ${unitNumber.trim()}`
      : deliveryAddress;

    // Send confirmation email (async, don't block)
    sendOrderConfirmation({
      userEmail: user.email,
      userName: user.name || "Customer",
      planName: activePlan?.name || "No Plan",
      deliveryAddress: fullAddress,
      items,
      totalMeals: summary.totalMeals,
      mealSubtotal,
      subscriptionPrice,
      tax: parseFloat(tax),
      total: parseFloat(total),
    });
  };

  // Handle return from Stripe success
  if (!orderPlaced && typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("order") === "success") {
      clearCart();
      window.history.replaceState({}, "", "/cart");
      return (
        <div className="cart-page">
          <div className="order-success">
            <div className="success-icon">🎉</div>
            <h1>Payment Successful — Order Placed!</h1>
            <p>
              Your meals have been ordered and paid for. They will be delivered within 24 hours
              of each scheduled meal time.
            </p>
            <p className="success-note">
              A confirmation has been sent to {user?.email}.
            </p>
            <Link to="/" className="btn btn-primary btn-lg">
              Browse More Cuisines
            </Link>
          </div>
        </div>
      );
    }
  }

  if (orderPlaced) {
    return (
      <div className="cart-page">
        <div className="order-success">
          <div className="success-icon">🎉</div>
          <h1>Order Placed!</h1>
          <p>
            Your meals have been ordered. They will be delivered within 24 hours
            of each scheduled meal time.
          </p>
          <p className="success-note">
            Remember: meals must be ordered at least 24 hours in advance.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            Browse More Cuisines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        {!isEmpty && (
          <button className="btn btn-outline btn-sm" onClick={clearCart}>
            Clear All
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>
            Start building your meals by browsing cuisines or using the weekly
            menu.
          </p>
          <div className="empty-actions">
            <Link to="/" className="btn btn-primary">
              Browse Cuisines
            </Link>
            <Link to="/weekly" className="btn btn-secondary">
              Weekly Menu
            </Link>
          </div>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {DAYS.map((day) => {
              const dayMeals = cartByDay[day];
              if (!dayMeals) return null;
              return (
                <div key={day} className="cart-day">
                  <div className="cart-day-header">
                    <h2>{day}</h2>
                  </div>
                  {Object.entries(dayMeals).map(([mealTime, meal]) => {
                    const complete = isMealComplete(day, mealTime);
                    return (
                      <div
                        key={mealTime}
                        className={`cart-meal ${complete ? "complete" : "incomplete"}`}
                      >
                        <div className="cart-meal-header">
                          <h3>
                            {mealTime === "lunch" ? "🌮 Lunch" : "🍷 Dinner"}
                          </h3>
                          {!complete && (
                            <span className="incomplete-badge">
                              Incomplete — need 2 appetizers + 1 main + 1 side
                            </span>
                          )}
                          <button
                            className="btn-remove-meal"
                            onClick={() => clearDay(day, mealTime)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="cart-courses four-cols">
                          {COURSE_SLOTS.map((slot) => {
                            const item = meal[slot];
                            return (
                              <div
                                key={slot}
                                className={`cart-course ${item ? "" : "empty"}`}
                              >
                                <span className="course-type">
                                  {COURSE_LABELS[slot]}
                                </span>
                                <span className="course-name">
                                  {item ? item.name : "Not selected"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        {complete && (
                          <div className="cart-meal-price">$9.99</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="cart-summary">
            {/* Delivery address */}
            <div className="summary-card delivery-card">
              <h3>Delivery Address</h3>
              <div className="form-group">
                <label>Street Address</label>
                <AddressAutocomplete
                  value={deliveryAddress}
                  onChange={setDeliveryAddress}
                  placeholder="Start typing your address..."
                />
              </div>
              <div className="form-group">
                <label>Apt / Suite / Unit (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Apt 4B, Unit 201, Suite 300"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  className="unit-input"
                />
              </div>
              {addressError && (
                <p className="address-error">{addressError}</p>
              )}
            </div>

            <div className="summary-card">
              <h3>Order Summary</h3>
              {!activePlan && (
                <div className="summary-warning">
                  <p>
                    ⚠️ You need an active subscription to checkout.{" "}
                    <Link to="/plans">View plans</Link>
                  </p>
                </div>
              )}
              {!user && (
                <div className="summary-warning">
                  <p>
                    ⚠️ Please <Link to="/auth">sign in</Link> to checkout.
                  </p>
                </div>
              )}
              {activePlan && (
                <div className="summary-line subscription-line">
                  <span>{activePlan.name} Subscription</span>
                  <span>${subscriptionPrice.toFixed(2)}/mo</span>
                </div>
              )}
              <div className="summary-line">
                <span>Complete meals</span>
                <span>{summary.totalMeals}</span>
              </div>
              <div className="summary-line">
                <span>
                  Meals ({summary.totalMeals} × ${summary.mealCost})
                </span>
                <span>${mealSubtotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Delivery</span>
                <span className="free">Included</span>
              </div>
              <div className="summary-line">
                <span>Est. Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-line total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="summary-note">
                * Subscription billed monthly. Meal charges per order.
                State taxes estimated at 8%. Delivery within 24 hours of meal time.
              </p>
              <button
                className="btn btn-primary btn-block btn-lg"
                disabled={
                  summary.totalMeals === 0 || !activePlan || !user || processing
                }
                onClick={handleCheckout}
              >
                {processing
                  ? "Redirecting to payment..."
                  : !user
                  ? "Sign In to Checkout"
                  : !activePlan
                  ? "Subscribe to Checkout"
                  : `Pay & Place Order — $${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
