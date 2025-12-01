import { Mail } from "lucide-react";
import logoWithName from "@/assets/logo-w-name.svg";
import facebookIcon from "@/assets/facebook.svg";
import twitterIcon from "@/assets/twitter.svg";
import instagramIcon from "@/assets/instagram.svg";

interface FooterLink {
  label: string;
  href: string;
}

const mainLinks: FooterLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy" },
];

const categories: FooterLink[] = [
  { label: "Music Genre", href: "/genres" },
  { label: "Popular Playlists", href: "/playlists" },
  { label: "New Albums", href: "/albums" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          {/* Left - Logo */}
          <div className="footer-logo">
            <img src={logoWithName} alt="VioTune" className="footer-logo__image" />
          </div>

          {/* Right - Links */}
          <div className="footer-links">
            <div className="footer-links__column">
              <h4 className="footer-links__title">Main Links</h4>
              <ul className="footer-links__list">
                {mainLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-links__item">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links__column">
              <h4 className="footer-links__title">Categories</h4>
              <ul className="footer-links__list">
                {categories.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-links__item">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links__column">
              <h4 className="footer-links__title">Main Links</h4>
              <ul className="footer-links__list">
                {mainLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-links__item">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Brand Info */}
        <div className="footer-brand">
          <h3 className="footer-brand__title">Welcome To VioTune!</h3>
          <p className="footer-brand__description">
            At Echo Stream, We Are Passionate About Bringing Music Closer To You.
          </p>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          {/* Newsletter */}
          <div className="footer-newsletter">
            <p className="footer-newsletter__label">Enter your email to receive the latest news.</p>
            <div className="footer-newsletter__form">
              <div className="footer-newsletter__input-wrapper">
                <Mail className="footer-newsletter__icon" />
                <input
                  type="email"
                  placeholder="Example@gmail.com"
                  className="footer-newsletter__input"
                />
              </div>
              <button className="subscribe-btn footer-subscribe-btn">Subscribe</button>
            </div>
          </div>

          {/* Social */}
          <div className="footer-social">
            <h4 className="footer-social__title">Follow Us</h4>
            <div className="footer-social__icons">
              <a href="https://facebook.com" className="footer-social__link" aria-label="Facebook">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a href="https://twitter.com" className="footer-social__link" aria-label="Twitter">
                <img src={twitterIcon} alt="Twitter" />
              </a>
              <a href="https://instagram.com" className="footer-social__link" aria-label="Instagram">
                <img src={instagramIcon} alt="Instagram" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p className="footer-copyright__text">
            © {currentYear} VioTune. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
