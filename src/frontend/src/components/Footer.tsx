import { Link } from "@tanstack/react-router";
import { Ticket } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cinema-border bg-cinema-card mt-16">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-cinema-gold rounded-sm flex items-center justify-center shadow-gold">
                <Ticket
                  className="w-3.5 h-3.5 text-cinema-bg"
                  strokeWidth={2.5}
                />
              </div>
              <span className="brand-mark text-xl text-cinema-text">
                CINE<span className="text-cinema-gold">BOOK</span>
              </span>
            </div>
            <p className="text-cinema-muted text-sm leading-relaxed max-w-xs">
              Your premier destination for movie ticket booking. Reserve the
              best seats for the latest blockbusters.
            </p>
          </div>

          <div>
            <h4 className="text-cinema-text text-xs font-bold tracking-widest uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-cinema-muted text-sm hover:text-cinema-gold transition-colors"
                >
                  Now Showing
                </Link>
              </li>
              <li>
                <Link
                  to="/my-bookings"
                  className="text-cinema-muted text-sm hover:text-cinema-gold transition-colors"
                >
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-cinema-text text-xs font-bold tracking-widest uppercase mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Help Center", href: "/help-center" },
                { label: "Refund Policy", href: "/refund-policy" },
                { label: "Contact Us", href: "/contact-us" },
                { label: "Terms of Service", href: "/terms" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-cinema-muted text-sm hover:text-cinema-gold transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-cinema-border pt-6 flex items-center justify-start">
          <p className="text-cinema-muted text-xs">
            Copyright {year} CineBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
