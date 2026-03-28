import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <h4>Dish8</h4>
            <p>Your meal, your way. Curated cuisines from around the world, delivered fresh to your door.</p>
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
            <h4>Account</h4>
            <ul>
              <li><Link to="/account">My Account</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/auth">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><Link to="/terms">Terms &amp; Conditions</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li>Delivery included, taxes extra</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Dish8 LLC. All Rights Reserved.</p>
          <div className="footer-legal-links">
            <Link to="/terms">Terms &amp; Conditions</Link>
            <span className="footer-sep">|</span>
            <Link to="/refund-policy">Refund Policy</Link>
            <span className="footer-sep">|</span>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
