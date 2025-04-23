import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div>
         
            <p className="mt-4 text-sm text-primary-foreground/80">
              Sales Bid is a modern marketplace for surplus, salvage, and
              returned inventory.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/auctions" className="hover:underline">
                  Browse Auctions
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:underline">
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/sell"
                  className="hover:text-accent transition-colors duration-200 hover:underline hover:underline-offset-4"
                >
                  Sell With Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:underline">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:underline">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:underline">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4">
              Stay Updated
            </h3>
            <p className="text-sm mb-3 text-primary-foreground/80">
              Subscribe to our newsletter for exclusive deals and updates.
            </p>
            <form className="mt-2">
              <div className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-md bg-secondary py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-primary-foreground/70">
            &copy; {new Date().getFullYear()} Sales Bids. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="text-white/70 hover:text-white">
              <span className="sr-only">Facebook</span>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-white/70 hover:text-white">
              <span className="sr-only">Instagram</span>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.272.644 1.772 1.153.509.5.902 1.104 1.153 1.772.247.636.416 1.363.465 2.427.047 1.024.06 1.379.06 3.808s-.013 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.047-1.379.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808s.013-2.784.06-3.808c.049-1.064.218-1.791.465-2.427.25-.668.644-1.272 1.153-1.772a4.902 4.902 0 011.772-1.153C6.716 2.278 7.443 2.109 8.507 2.06 9.531 2.013 9.886 2 12.315 2zm0 1.622c-2.387 0-2.72.01-3.732.056-.9.042-1.387.191-1.713.318a3.193 3.193 0 00-1.152.752 3.193 3.193 0 00-.752 1.152c-.127.326-.276.813-.318 1.713-.046 1.012-.056 1.345-.056 3.732 0 2.387.01 2.72.056 3.732.042.9.191 1.387.318 1.713.184.505.418.87.752 1.152.333.334.647.567 1.152.752.326.127.813.276 1.713.318 1.012.046 1.345.056 3.732.056s2.72-.01 3.732-.056c.9-.042 1.387-.191 1.713-.318a3.193 3.193 0 001.152-.752c.334-.333.567-.647.752-1.152.127-.326.276-.813.318-1.713.046-1.012.056-1.345.056-3.732 0-2.387-.01-2.72-.056-3.732-.042-.9-.191-1.387-.318-1.713a3.193 3.193 0 00-.752-1.152 3.193 3.193 0 00-1.152-.752c-.326-.127-.813-.276-1.713-.318-1.012-.046-1.345-.056-3.732-.056zm0 2.756a4.622 4.622 0 110 9.244 4.622 4.622 0 010-9.244zm0 7.622a3 3 0 100-6 3 3 0 000 6zm5.884-7.804a1.08 1.08 0 10-2.16 0 1.08 1.08 0 002.16 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-white/70 hover:text-white">
              <span className="sr-only">Twitter</span>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-white/70 hover:text-white">
              <span className="sr-only">LinkedIn</span>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
