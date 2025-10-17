import "../Stlying/footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h4>About</h4>
          <p>
            Our platform helps local movie businesses create and share events
            with the community. Browse, join, and track movie events easily.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/events">Events</a>
            </li>
            <li>
              <a href="/register">Become Staff</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: suhaimkhalid007@gmail.com</p>
          <p>Phone: +44 123 456 789</p>
          <p>Address: 123 Movie St, London, UK</p>
        </div>

        <div className="footer-socials">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a
              href="https://www.instagram.com/suhaimkhalid/"
              aria-label="Instagram"
            >
              Instagram
            </a>

            <a
              href="https://www.linkedin.com/in/suhaimkhalid"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Movie Events Platform. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};
