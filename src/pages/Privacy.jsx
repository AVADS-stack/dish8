import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="legal-page">
      <div className="legal-card">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last Updated: March 28, 2026</p>
        <p className="legal-entity">Dish8 LLC</p>

        <div className="legal-important">
          This Privacy Policy describes how Dish8 LLC ("we," "us," "our") collects,
          uses, stores, and protects your personal information when you use our
          platform and services. By using Dish8, you consent to the practices
          described in this policy.
        </div>

        <section>
          <h2>1. Information We Collect</h2>
          <h3>1.1 Information You Provide</h3>
          <ul>
            <li><strong>Account information:</strong> name, email address, password, delivery address</li>
            <li><strong>Payment information:</strong> credit/debit card details, billing address (processed by our third-party payment processor)</li>
            <li><strong>Order information:</strong> meal selections, dietary preferences, order history</li>
            <li><strong>Communications:</strong> messages you send to our support team</li>
          </ul>
          <h3>1.2 Information Collected Automatically</h3>
          <ul>
            <li><strong>Device information:</strong> browser type, operating system, device identifiers</li>
            <li><strong>Usage data:</strong> pages viewed, features used, time spent on the platform</li>
            <li><strong>Location data:</strong> approximate location based on IP address, delivery address</li>
            <li><strong>Cookies and tracking technologies:</strong> session cookies, analytics cookies, advertising identifiers</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>Process and deliver your meal orders</li>
            <li>Manage your account and subscription</li>
            <li>Process payments and prevent fraud</li>
            <li>Send order confirmations, delivery updates, and service notifications</li>
            <li>Improve our platform, menu offerings, and user experience</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Comply with legal obligations</li>
            <li>Enforce our Terms and Conditions</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul>
            <li><strong>Delivery partners:</strong> name and address for meal delivery</li>
            <li><strong>Payment processors:</strong> payment details to process transactions</li>
            <li><strong>Analytics providers:</strong> anonymized usage data for platform improvement</li>
            <li><strong>Legal authorities:</strong> when required by law, court order, or to protect our rights</li>
            <li><strong>Business transfers:</strong> in connection with a merger, acquisition, or sale of assets</li>
          </ul>
          <p>We do <strong>not</strong> sell your personal information to third parties for their marketing purposes.</p>
        </section>

        <section>
          <h2>4. Data Retention</h2>
          <p>We retain your personal information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information for up to 7 years for legal compliance, dispute resolution, and fraud prevention purposes.</p>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>We implement industry-standard security measures including encryption, access controls, and secure data storage. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security of your data.</p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access and receive a copy of your personal data</li>
            <li>Correct inaccurate personal data</li>
            <li>Request deletion of your personal data (subject to legal retention requirements)</li>
            <li>Object to or restrict processing of your personal data</li>
            <li>Data portability</li>
            <li>Withdraw consent for marketing communications</li>
          </ul>
          <p>To exercise these rights, contact us at <strong>privacy@dish8.com</strong>.</p>
        </section>

        <section>
          <h2>7. Cookies</h2>
          <p>We use cookies and similar technologies to maintain your session, remember preferences, and analyze usage patterns. You can control cookies through your browser settings, though disabling cookies may affect platform functionality.</p>
        </section>

        <section>
          <h2>8. Children's Privacy</h2>
          <p>Dish8 is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected data from a minor, we will take steps to delete it promptly.</p>
        </section>

        <section>
          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. We will notify you of material changes by posting the updated policy on our platform with a revised "Last Updated" date. Continued use of the Service after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p><strong>Dish8 LLC</strong></p>
          <p>Email: privacy@dish8.com</p>
        </section>

        <p className="legal-footer-note">
          &copy; {new Date().getFullYear()} Dish8 LLC. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
