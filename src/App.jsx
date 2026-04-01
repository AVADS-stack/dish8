import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import CuisineDishes from "./pages/CuisineDishes.jsx";
import Plans from "./pages/Plans.jsx";
import Cart from "./pages/Cart.jsx";
import Auth from "./pages/Auth.jsx";
import Account from "./pages/Account.jsx";
import WeeklyMenu from "./pages/WeeklyMenu.jsx";
import RefundPolicy from "./pages/RefundPolicy.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import Investors from "./pages/Investors.jsx";
import Partners from "./pages/Partners.jsx";
import NotFound from "./pages/NotFound.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cuisine/:cuisineId" element={<CuisineDishes />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/account" element={<Account />} />
          <Route path="/weekly" element={<WeeklyMenu />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
