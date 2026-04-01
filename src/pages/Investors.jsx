import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

export default function Investors() {
  return (
    <div className="legal-page">
      <SEO
        title="Investor Relations"
        description="Invest in Dish8 — a high-growth food delivery startup disrupting the $350B meal delivery market with a subscription-first model."
        path="/investors"
      />
      <div className="legal-card">
        <Link to="/" className="back-link">← Back to Home</Link>

        <div className="biz-hero">
          <h1>Investor Relations</h1>
          <p className="biz-tagline">Building the future of meal delivery — one subscription at a time.</p>
        </div>

        <section>
          <h2>About Dish8 LLC</h2>
          <p>
            Dish8 LLC is an American food technology company headquartered in the Midwest.
            Founded with the mission to make world-class cuisine accessible, affordable, and
            convenient, Dish8 operates a subscription-based meal delivery platform that connects
            consumers with 21+ world cuisines through an intuitive, catalog-style digital experience.
          </p>
          <p>
            Our platform serves the growing demand for curated, high-quality meal delivery —
            combining the convenience of on-demand food services with the value and predictability
            of a subscription model.
          </p>
        </section>

        <section>
          <h2>The Opportunity</h2>
          <div className="biz-stats">
            <div className="biz-stat">
              <span className="biz-stat-value">$350B+</span>
              <span className="biz-stat-label">Global meal delivery market by 2027</span>
            </div>
            <div className="biz-stat">
              <span className="biz-stat-value">21+</span>
              <span className="biz-stat-label">World cuisines on our platform</span>
            </div>
            <div className="biz-stat">
              <span className="biz-stat-value">822</span>
              <span className="biz-stat-label">Dishes available to order</span>
            </div>
            <div className="biz-stat">
              <span className="biz-stat-value">$9.99</span>
              <span className="biz-stat-label">Per meal with delivery included</span>
            </div>
          </div>
        </section>

        <section>
          <h2>Why Dish8</h2>

          <h3>Subscription-First Model</h3>
          <p>
            Unlike traditional food delivery platforms that rely on per-order transactions with
            high customer acquisition costs, Dish8 employs a subscription-first approach. Starting
            at $99.99/month, subscribers gain access to discounted $9.99/meal pricing with delivery
            included — creating predictable recurring revenue and significantly higher customer
            lifetime value.
          </p>

          <h3>Massive Cuisine Catalog</h3>
          <p>
            Dish8 offers one of the most diverse cuisine catalogs in the meal delivery space —
            21 cuisines spanning Italian, Japanese, Indian, Mexican, Thai, American, Pizza, and
            13 more world cuisines. With 822+ dishes, customers enjoy restaurant-quality variety
            without the restaurant markup.
          </p>

          <h3>Technology-Driven Operations</h3>
          <p>
            Built on a modern technology stack (React, Supabase, Vercel), Dish8 operates with
            minimal infrastructure overhead. Our platform is designed for rapid scaling — from
            local Midwest markets to nationwide expansion — without proportional increases in
            engineering or operational costs.
          </p>

          <h3>Asset-Light Kitchen Network</h3>
          <p>
            Dish8 partners with local restaurants and cloud kitchens to fulfill orders, avoiding
            the capital-intensive approach of building owned kitchens. This model enables rapid
            geographic expansion with lower risk and faster time-to-market.
          </p>
        </section>

        <section>
          <h2>Revenue Model</h2>
          <div className="biz-table-wrapper">
            <table className="biz-table">
              <thead>
                <tr>
                  <th>Revenue Stream</th>
                  <th>Description</th>
                  <th>Pricing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Subscription Fees</td>
                  <td>Monthly recurring revenue from Lunch, Dinner, or Combo plans</td>
                  <td>$99.99 – $199.99/mo</td>
                </tr>
                <tr>
                  <td>Per-Meal Charges</td>
                  <td>Each complete meal (2 appetizers + main + side) billed per order</td>
                  <td>$9.99/meal</td>
                </tr>
                <tr>
                  <td>Restaurant Partnerships</td>
                  <td>Commission on orders fulfilled by partner restaurants</td>
                  <td>Negotiated per partner</td>
                </tr>
                <tr>
                  <td>Premium Cuisines</td>
                  <td>Future: premium/seasonal menus at higher price points</td>
                  <td>TBD</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Growth Strategy</h2>
          <ol>
            <li>
              <strong>Phase 1 — Midwest Launch:</strong> Establish strong market presence
              in key Midwest metro areas with dense restaurant partner networks.
            </li>
            <li>
              <strong>Phase 2 — Regional Expansion:</strong> Scale to adjacent markets
              leveraging proven operational playbook and brand recognition.
            </li>
            <li>
              <strong>Phase 3 — Nationwide Coverage:</strong> Full national rollout with
              diversified restaurant partnerships and enterprise catering services.
            </li>
            <li>
              <strong>Phase 4 — Platform Extensions:</strong> Mobile apps (iOS/Android),
              corporate meal programs, white-label solutions for restaurant chains.
            </li>
          </ol>
        </section>

        <section>
          <h2>Competitive Advantages</h2>
          <ul>
            <li><strong>Subscription lock-in:</strong> Higher retention vs. per-order platforms (DoorDash, UberEats)</li>
            <li><strong>Cuisine breadth:</strong> 21 cuisines vs. single-cuisine meal kit competitors</li>
            <li><strong>Price leadership:</strong> $9.99/meal all-in vs. $15-25+ on competing platforms</li>
            <li><strong>Low CAC:</strong> Subscription model reduces customer acquisition cost over LTV</li>
            <li><strong>Asset-light:</strong> No owned kitchens, minimal fixed infrastructure</li>
            <li><strong>Tech-first:</strong> Modern stack enabling rapid iteration and low ops cost</li>
          </ul>
        </section>

        <section>
          <h2>Use of Funds</h2>
          <p>
            Investment capital will be deployed across the following strategic priorities:
          </p>
          <ul>
            <li><strong>Restaurant partner acquisition and onboarding</strong> — building a dense network of kitchen partners in target markets</li>
            <li><strong>Customer acquisition</strong> — digital marketing, referral programs, and brand awareness campaigns</li>
            <li><strong>Technology development</strong> — mobile apps, operations dashboard, logistics optimization, and AI-powered recommendations</li>
            <li><strong>Operations infrastructure</strong> — delivery logistics, quality assurance, and customer support systems</li>
            <li><strong>Working capital</strong> — inventory, packaging, and operational runway for market expansion</li>
          </ul>
        </section>

        <section>
          <h2>Leadership</h2>
          <p>
            Dish8 is led by a team with deep experience in food technology, consumer platforms,
            and operations. Our leadership combines startup agility with industry knowledge to
            execute on our ambitious growth roadmap.
          </p>
        </section>

        <section className="biz-cta-section">
          <h2>Interested in Investing?</h2>
          <p>
            We're actively engaging with strategic investors, venture capital firms, and angel
            investors who share our vision for the future of meal delivery. For investment
            inquiries, pitch deck requests, or financial information:
          </p>
          <div className="biz-contact">
            <p><strong>Dish8 LLC — Investor Relations</strong></p>
            <p>Email: <a href="mailto:business@dish8.com">business@dish8.com</a></p>
            <p>Subject line: "Investment Inquiry"</p>
          </div>
          <p className="biz-disclaimer">
            This page is for informational purposes only and does not constitute an offer to
            sell or a solicitation of an offer to buy any securities. Any investment in Dish8 LLC
            involves risk and is subject to applicable securities laws and regulations.
          </p>
        </section>

        <p className="legal-footer-note">
          &copy; {new Date().getFullYear()} Dish8 LLC. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
