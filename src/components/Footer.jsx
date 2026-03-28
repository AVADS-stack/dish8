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
              <li><a href="/">Browse Cuisines</a></li>
              <li><a href="/weekly">Weekly Menu</a></li>
              <li><a href="/plans">Subscription Plans</a></li>
            </ul>
          </div>
          <div>
            <h4>Account</h4>
            <ul>
              <li><a href="/account">My Account</a></li>
              <li><a href="/cart">My Cart</a></li>
              <li><a href="/auth">Sign In</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="/terms">Terms &amp; Conditions</a></li>
              <li><a href="/refund-policy">Refund Policy</a></li>
              <li>$9.99 per meal with subscription</li>
              <li>Delivery included, taxes extra</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Dish8 LLC. All Rights Reserved.</p>
          <div className="footer-legal-links">
            <a href="/terms">Terms &amp; Conditions</a>
            <span className="footer-sep">|</span>
            <a href="/refund-policy">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
