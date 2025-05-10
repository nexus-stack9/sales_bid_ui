import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div>
            <h2 className="text-2xl font-bold font-display mb-3">Sales Bid</h2>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Sales Bid is a modern marketplace for surplus, salvage, and returned inventory.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold font-display mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/90">
              {[
                { to: "/auctions", text: "Browse Auctions" },
                { to: "/how-it-works", text: "How It Works" },
                { to: "/sell", text: "Sell With Us" },
                { to: "/help", text: "Help Center" }
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="transition hover:text-accent hover:underline hover:underline-offset-4"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold font-display mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-white/90">
              {[
                { to: "/terms", text: "Terms of Service" },
                { to: "/privacy", text: "Privacy Policy" },
                { to: "/cookies", text: "Cookie Policy" },
                { to: "/accessibility", text: "Accessibility" }
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="transition hover:text-accent hover:underline hover:underline-offset-4"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold font-display mb-4">Stay Updated</h3>
            <p className="text-sm text-primary-foreground/80 mb-3">
              Subscribe to our newsletter for exclusive deals and updates.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-md bg-white/90 px-4 py-2 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
              <button
                type="submit"
                className="w-full rounded-md bg-accent py-2 text-sm font-semibold text-white hover:bg-accent/90 transition focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} Sales Bid. All rights reserved.</p>
          <div className="flex space-x-5 mt-4 md:mt-0">
            {[
              { label: "Facebook", icon: "facebook" },
              { label: "Instagram", icon: "instagram" },
              { label: "Twitter", icon: "twitter" },
              { label: "LinkedIn", icon: "linkedin" }
            ].map(({ label, icon }) => (
              <a
                href="#"
                key={icon}
                className="hover:text-white transition"
                aria-label={label}
              >
                <i className={`fab fa-${icon} text-lg`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
