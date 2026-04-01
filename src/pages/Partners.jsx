import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

export default function Partners() {
  return (
    <div className="legal-page">
      <SEO
        title="Restaurant Partners"
        description="Partner with Dish8 to reach new customers through our subscription meal delivery platform. No upfront costs, flexible fulfillment."
        path="/partners"
      />
      <div className="legal-card">
        <Link to="/" className="back-link">← Back to Home</Link>

        <div className="biz-hero">
          <h1>Restaurant Partners</h1>
          <p className="biz-tagline">Grow your business with Dish8's subscription meal delivery network.</p>
        </div>

        <section>
          <h2>Why Partner with Dish8?</h2>
          <p>
            Dish8 connects your restaurant with a growing network of subscription-based
            customers who order meals weekly — not just when they're hungry. Unlike one-off
            delivery platforms, our subscribers commit to regular orders, giving you predictable,
            recurring revenue from a loyal customer base.
          </p>

          <div className="biz-stats">
            <div className="biz-stat">
              <span className="biz-stat-value">21+</span>
              <span className="biz-stat-label">Cuisines represented</span>
            </div>
            <div className="biz-stat">
              <span className="biz-stat-value">$0</span>
              <span className="biz-stat-label">Upfront cost to join</span>
            </div>
            <div className="biz-stat">
              <span className="biz-stat-value">Weekly</span>
              <span className="biz-stat-label">Recurring order volume</span>
            </div>
            <div className="biz-stat">
              <span className="biz-stat-value">24hr</span>
              <span className="biz-stat-label">Advance notice on orders</span>
            </div>
          </div>
        </section>

        <section>
          <h2>How It Works</h2>

          <div className="biz-steps">
            <div className="biz-step">
              <div className="biz-step-num">1</div>
              <div>
                <h3>Apply to Join</h3>
                <p>
                  Fill out a quick application with your restaurant details, cuisine type,
                  and fulfillment capacity. We'll review and respond within 48 hours.
                </p>
              </div>
            </div>

            <div className="biz-step">
              <div className="biz-step-num">2</div>
              <div>
                <h3>Menu Integration</h3>
                <p>
                  Our team works with you to curate your best dishes for the Dish8 platform —
                  appetizers, main courses, and sides that travel well and represent your cuisine.
                </p>
              </div>
            </div>

            <div className="biz-step">
              <div className="biz-step-num">3</div>
              <div>
                <h3>Receive Orders</h3>
                <p>
                  Orders come in with at least 24 hours advance notice, giving you ample time
                  to prep. No surprise rushes, no last-minute scrambles.
                </p>
              </div>
            </div>

            <div className="biz-step">
              <div className="biz-step-num">4</div>
              <div>
                <h3>We Handle Delivery</h3>
                <p>
                  Dish8 manages all delivery logistics. You prepare the food, we pick it up and
                  deliver it to the customer. No delivery fleet needed on your end.
                </p>
              </div>
            </div>

            <div className="biz-step">
              <div className="biz-step-num">5</div>
              <div>
                <h3>Get Paid</h3>
                <p>
                  Transparent, on-time payments. You receive settlement for all fulfilled orders
                  on a regular payment cycle — no hidden fees, no surprises.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2>Partner Benefits</h2>
          <ul>
            <li>
              <strong>Zero upfront cost</strong> — no signup fees, no integration charges,
              no monthly platform fees
            </li>
            <li>
              <strong>Predictable order volume</strong> — subscription customers order
              weekly, giving you a reliable revenue stream
            </li>
            <li>
              <strong>24-hour advance notice</strong> — all orders are placed at least
              24 hours ahead, so you can plan prep and inventory
            </li>
            <li>
              <strong>No delivery burden</strong> — Dish8 handles pickup and delivery
              logistics completely
            </li>
            <li>
              <strong>Brand visibility</strong> — your restaurant and dishes are featured
              to Dish8's subscriber base across our platform and marketing channels
            </li>
            <li>
              <strong>Menu flexibility</strong> — update your available dishes seasonally
              or based on ingredient availability
            </li>
            <li>
              <strong>Customer feedback</strong> — receive aggregated feedback to help
              refine your most popular dishes
            </li>
            <li>
              <strong>Marketing support</strong> — featured placement opportunities for
              high-performing partners
            </li>
          </ul>
        </section>

        <section>
          <h2>Ideal Partner Profile</h2>
          <p>We're looking for restaurants that meet the following criteria:</p>
          <ul>
            <li>Operating kitchen with valid health permits and food safety certifications</li>
            <li>Ability to fulfill a minimum of 20 meals per day during peak periods</li>
            <li>Consistent quality and portion control across all orders</li>
            <li>Cuisine that aligns with one or more of our 21 cuisine categories</li>
            <li>Located in or near our active delivery zones (currently Midwest metro areas)</li>
            <li>Willingness to collaborate on menu curation for the delivery format</li>
          </ul>
          <p>
            <strong>Cloud kitchens and ghost kitchens are welcome.</strong> We're
            cuisine-first — whether you operate a fine-dining restaurant, a family-owned
            eatery, or a dedicated delivery kitchen, we'd love to hear from you.
          </p>
        </section>

        <section>
          <h2>Commission Structure</h2>
          <p>
            Our commission model is designed to be fair and transparent. The exact rate
            depends on order volume, cuisine type, and market. We offer:
          </p>
          <ul>
            <li><strong>Competitive commission rates</strong> — lower than major delivery platforms</li>
            <li><strong>Volume incentives</strong> — reduced rates as your monthly order count grows</li>
            <li><strong>No hidden fees</strong> — commission is the only cost, no tablet fees, no marketing surcharges</li>
            <li><strong>Regular payment cycles</strong> — weekly or biweekly settlements via direct deposit</li>
          </ul>
          <p>
            Specific rates are discussed during the onboarding process and tailored to
            your restaurant's situation.
          </p>
        </section>

        <section>
          <h2>Frequently Asked Questions</h2>

          <h3>What cuisines are you looking for?</h3>
          <p>
            We feature 21 cuisines including Italian, Chinese, Japanese, Indian, Mexican,
            Thai, French, Korean, Vietnamese, Greek, Spanish, Lebanese, Ethiopian, Turkish,
            Moroccan, Brazilian, Peruvian, Caribbean, German, American, and Pizza. If your
            cuisine isn't listed, reach out — we're always expanding.
          </p>

          <h3>What are the packaging requirements?</h3>
          <p>
            Meals must be packaged in food-safe, sealed containers suitable for transport.
            We provide packaging guidelines during onboarding and can recommend approved
            suppliers at discounted rates.
          </p>

          <h3>How are orders communicated?</h3>
          <p>
            Orders are sent via our partner dashboard (web-based) with at least 24 hours
            advance notice. You'll receive an email and dashboard notification for each
            new batch of orders.
          </p>

          <h3>Can I adjust my menu?</h3>
          <p>
            Yes. You can update your available dishes, mark items as unavailable, or
            introduce seasonal specials at any time through the partner dashboard.
          </p>

          <h3>What if I need to stop temporarily?</h3>
          <p>
            No problem. You can pause your availability at any time — for vacations,
            renovations, or any reason. There are no penalties for pausing.
          </p>
        </section>

        <section className="biz-cta-section">
          <h2>Become a Dish8 Partner</h2>
          <p>
            Join our growing network of restaurant partners and start reaching new
            customers through the Dish8 subscription platform. Getting started is simple —
            just send us an email.
          </p>
          <div className="biz-contact">
            <p><strong>Dish8 LLC — Restaurant Partnerships</strong></p>
            <p>Email: <a href="mailto:business@dish8.com">business@dish8.com</a></p>
            <p>Subject line: "Restaurant Partnership Inquiry"</p>
          </div>
          <p>
            Please include your restaurant name, location, cuisine type, and a brief
            description of your kitchen capacity. Our partnerships team will respond
            within 48 hours.
          </p>
        </section>

        <p className="legal-footer-note">
          &copy; {new Date().getFullYear()} Dish8 LLC. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
