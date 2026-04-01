import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <h4>Dish8</h4>
            <p>Your meal, your way. Curated cuisines from around the world, delivered fresh to your door.</p>
            <p className="footer-hq">Dish8 LLC — Midwest, USA</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Browse Cuisines</Link></li>
              <li><Link to="/weekly">Weekly Menu</Link></li>
              <li><Link to="/plans">Subscription Plans</Link></li>
            </ul>
          </div>
          <div>
            <h4>Business</h4>
            <ul>
              <li><Link to="/investors">Investor Relations</Link></li>
              <li><Link to="/partners">Restaurant Partners</Link></li>
              <li><a href="mailto:business@dish8.com">business@dish8.com</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><Link to="/terms">Terms &amp; Conditions</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Dish8 LLC. All Rights Reserved.</p>
          <div className="footer-legal-links">
            <Link to="/terms">Terms</Link>
            <span className="footer-sep">|</span>
            <Link to="/refund-policy">Refund</Link>
            <span className="footer-sep">|</span>
            <Link to="/privacy">Privacy</Link>
            <span className="footer-sep">|</span>
            <Link to="/investors">Investors</Link>
            <span className="footer-sep">|</span>
            <Link to="/partners">Partners</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
