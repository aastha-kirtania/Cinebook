import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Film, Search, Ticket } from "lucide-react";
import { useRef, useState } from "react";

export function Navbar() {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const pathname = routerState.location.pathname;
  const search = routerState.location.searchStr ?? "";

  const navLinks = [
    { label: "MOVIES", href: "/" as const },
    { label: "MY BOOKINGS", href: "/my-bookings" as const },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        to: "/",
        search: { search: searchQuery.trim() } as Record<string, string>,
      });
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/" && !search.includes("section"))
      return true;
    if (href === "/my-bookings" && pathname === "/my-bookings") return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cinema-border bg-cinema-card/95 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" data-ocid="nav.link">
          <div className="w-8 h-8 bg-cinema-gold rounded-sm flex items-center justify-center shadow-gold">
            <Ticket className="w-4 h-4 text-cinema-bg" strokeWidth={2.5} />
          </div>
          <span className="brand-mark text-2xl text-cinema-text">
            CINE<span className="text-cinema-gold">BOOK</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href.split("?")[0]}
              data-ocid="nav.link"
              className={`text-xs font-semibold tracking-[0.12em] transition-colors ${
                isActive(link.href)
                  ? "text-cinema-gold"
                  : "text-cinema-muted hover:text-cinema-text"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                ref={inputRef}
                data-ocid="nav.search_input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="bg-cinema-inner border border-cinema-border rounded-sm px-3 py-1.5 text-sm text-cinema-text placeholder-cinema-muted outline-none focus:border-cinema-gold w-48 transition-all"
                onBlur={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
              />
            </form>
          ) : (
            <button
              type="button"
              data-ocid="nav.button"
              onClick={openSearch}
              className="p-2 text-cinema-muted hover:text-cinema-gold transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          <Link
            to="/my-bookings"
            className="md:hidden p-2 text-cinema-muted hover:text-cinema-gold transition-colors"
            data-ocid="nav.link"
          >
            <Film className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
