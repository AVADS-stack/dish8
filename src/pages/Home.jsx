import { genreGroups } from "../data/cuisines.js";
import GenreRow from "../components/GenreRow.jsx";
import { Link } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext.jsx";
import SEO, { organizationSchema, foodServiceSchema } from "../components/SEO.jsx";

export default function Home() {
  const { activePlan } = useSubscription();

  return (
    <div className="home-page">
      <SEO
        path="/"
        description="Explore 21+ world cuisines. Pick your weekly meals — 2 appetizers, a main course, and a side — delivered fresh for just $9.99/meal."
        jsonLd={[organizationSchema, foodServiceSchema]}
      />
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <h1>
            Endless Flavors.
            <br />
            <span className="accent">One Subscription.</span>
          </h1>
          <p className="hero-sub">
            Explore 19+ world cuisines. Pick your meals for the week. Delivered
            fresh to your door — starting at just <strong>$9.99/meal</strong>.
          </p>
          <div className="hero-actions">
            {!activePlan && (
              <Link to="/plans" className="btn btn-primary btn-lg">
                View Plans — from $99.99/mo
              </Link>
            )}
            <Link to="/weekly" className="btn btn-secondary btn-lg">
              Build Your Week
            </Link>
          </div>
          <p className="hero-note">
            Order at least 24 hours in advance. Delivery included. Taxes extra.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Subscribe</h3>
            <p>Choose Lunch ($99.99/mo), Dinner ($99.99/mo), or Both ($199.99/mo).</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Browse & Pick</h3>
            <p>Explore world cuisines by genre. Select 2 appetizers, a main course, and a side for each meal.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Order Flexibly</h3>
            <p>Order for a day, a week, or the full month. Just order 24 hours ahead.</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Enjoy</h3>
            <p>Fresh meals delivered within 24 hours of your meal time. Every meal just $9.99.</p>
          </div>
        </div>
      </section>

      {/* Genre Rows */}
      <section className="browse-section">
        <h2 className="section-heading">Browse by Cuisine</h2>
        {genreGroups.map((genre) => (
          <GenreRow key={genre.id} genre={genre} />
        ))}
      </section>
    </div>
  );
}
