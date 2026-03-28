import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-icon">404</div>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div className="error-actions">
        <Link to="/" className="btn btn-primary">
          Browse Cuisines
        </Link>
        <Link to="/plans" className="btn btn-secondary">
          View Plans
        </Link>
      </div>
    </div>
  );
}
