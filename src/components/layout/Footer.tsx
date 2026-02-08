import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const links = {
  marketplace: [
    { label: 'Browse Catalog', href: '/auctions' },
    // { label: 'Upcoming Auctions', href: '/auctions/upcoming' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Selling Services', href: '/selling-services' },
    // { label: 'Buyer Protection', href: '/buyer-protection' },
  ],
  categories: [
    { label: 'Electronics', href: '/category/electronics' },
    { label: 'Apparel', href: '/category/apparel' },
    { label: 'Home & Kitchen', href: '/category/home-kitchen' },
    { label: 'Sports & Fitness', href: '/category/sports-fitness' },
    { label: 'Toys & Games', href: '/category/toys-games' },
  ],
  support: [
    { label: 'Help Center', href: '/support/help-center' },
    { label: 'Shipping & Logistics', href: '/support/shipping-logistics' },
    { label: 'Returns & Refunds', href: '/support/returns-refunds' },
    { label: 'Contact Us', href: '/support/contact-us' },
    { label: 'FAQ', href: '/support/faq' },
  ],
};

const currentYear = new Date().getFullYear();

const SocialIcon = ({ name, href, children }: { name: string; href: string; children: React.ReactNode }) => (
  <a
    aria-label={name}
    href={href}
    className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/60 text-slate-300 transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
  >
    {children}
  </a>
);

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with your subscription logic or API call
    if (email.trim()) {
      // eslint-disable-next-line no-alert
      alert(`Thanks for subscribing, ${email}!`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top CTA banner */}
      {/* <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-700/20 via-sky-500/10 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
                Join 50,000+ businesses on Sales Bid
              </h3>
              <p className="mt-2 text-slate-400 text-sm md:text-base">
                Get weekly highlights on live listings, hot categories, and insider tips.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full md:w-80 h-11 rounded-xl border border-slate-800 bg-slate-900/70 px-4 text-sm text-white placeholder:text-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 focus-visible:border-sky-500/40"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section> */}

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* Replace with your logo if preferred */}
              <div className="h-10 w-10 rounded-lg bg-sky-600 grid place-items-center text-white font-bold">B</div>
              <span className="text-lg font-semibold tracking-tight text-white">Sales Bid</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              A premier B2B marketplace connecting buyers with liquidation, overstock, and returned
              inventory from top retailers and manufacturers.
            </p>
            <div className="flex items-center gap-3">
              <SocialIcon name="Twitter" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.36 8.5 8.5 0 0 1-2.7 1.03 4.25 4.25 0 0 0-7.24 3.88A12.07 12.07 0 0 1 3.15 4.8a4.25 4.25 0 0 0 1.32 5.67 4.22 4.22 0 0 1-1.93-.53v.05c0 2.06 1.47 3.78 3.42 4.17-.36.1-.75.15-1.14.15-.28 0-.55-.03-.81-.08.55 1.72 2.16 2.97 4.07 3a8.53 8.53 0 0 1-5.28 1.82c-.34 0-.67-.02-1-.06A12.05 12.05 0 0 0 8.29 20c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.36-.01-.54A8.3 8.3 0 0 0 22.46 6z"/></svg>
              </SocialIcon>
              <SocialIcon name="LinkedIn" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V23h-4zM8.5 8h3.8v2.05h.05c.53-1 1.82-2.05 3.74-2.05 4 0 4.74 2.63 4.74 6.05V23h-4v-6.5c0-1.55-.03-3.55-2.17-3.55-2.17 0-2.5 1.7-2.5 3.45V23h-4z"/></svg>
              </SocialIcon>
              <SocialIcon name="Instagram" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.4.4.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.5.3 1.2.4 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.4-.2.6-.5 1-1.5 1.5-.5.5-.9.8-1.5 1-.5.2-1.2.3-2.4.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.5-.3-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.4.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .5-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7 .1 5.7.2 4.8.3 4 .6c-.9.3-1.7.7-2.4 1.4C.9 2.6.5 3.4.2 4.3c-.3.8-.4 1.7-.5 3C-.4 8.6-.4 9 0 12s.4 3.4.7 4.7c.3 1.3.4 2.2.7 3 .3.9.7 1.7 1.4 2.4.7.7 1.5 1.1 2.4 1.4.8.3 1.7.4 3 .5 1.3.1 1.7.1 4.7.1s3.4 0 4.7-.1c1.3-.1 2.2-.2 3-.5.9-.3 1.7-.7 2.4-1.4.7-.7 1.1-1.5 1.4-2.4.3-.8.4-1.7.5-3 .1-1.3.1-1.7.1-4.7s0-3.4-.1-4.7c-.1-1.3-.2-2.2-.5-3-.3-.9-.7-1.7-1.4-2.4C21.4.9 20.6.5 19.7.2 18.9-.1 18 .1 16.7 0 15.4 0 15 0 12 0z"/><path d="M12 5.8A6.2 6.2 0 1 0 18.2 12 6.2 6.2 0 0 0 12 5.8m0 10.2A4 4 0 1 1 16 12a4 4 0 0 1-4 4z"/><circle cx="18.5" cy="5.5" r="1.3"/></svg>
              </SocialIcon>
              <SocialIcon name="Facebook" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.3V12h2.3V9.7c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .2 2 .2v2.2H15c-1.1 0-1.5.7-1.5 1.5V12h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12z"/></svg>
              </SocialIcon>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-slate-200">Marketplace</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {links.marketplace.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="inline-flex items-center gap-2 text-slate-400 transition hover:text-sky-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-slate-200">Categories</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {links.categories.map((l) => (
                <li key={l.label}>
                  {/* Clicking this link routes to auctions page with category as query param */}
                  <Link
                    to={`/auctions?category=${encodeURIComponent(l.label)}`}
                    className="inline-flex items-center gap-2 text-slate-400 transition hover:text-sky-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-slate-200">Support</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {links.support.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="inline-flex items-center gap-2 text-slate-400 transition hover:text-sky-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Apps */}
          {/* <div className="space-y-4">
            

            
              <h4 className="text-sm font-semibold tracking-wide text-slate-200">Contact</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">Flat 301, Amsri Plaza, SD Road, Ragimental Bazar, Hyderabad, Telanagana- 500003</li>
                <li className="flex items-center gap-2">Phone: +918919583205, 9701090085</li>
                <li className="flex items-center gap-2">Email: salesbid9@gmail.com</li>
              </ul>
          </div> */}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-slate-400">
            © {currentYear} Sales Bid. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="#" className="text-slate-400 hover:text-sky-400">Privacy Policy</a>
            <span className="text-slate-700">•</span>
            <a href="#" className="text-slate-400 hover:text-sky-400">Terms of Service</a>
            <span className="text-slate-700">•</span>
            <a href="#" className="text-slate-400 hover:text-sky-400">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;