// Navigation — Captain's Charter Weather
// Dark nautical top nav with radar logo, tactical typography
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/florida", label: "Florida" },
  { href: "/bahamas", label: "Bahamas" },
  { href: "/advisories", label: "Advisories" },
  { href: "/crossing-planner", label: "Crossing Planner" },
  { href: "/about", label: "About" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,14,20,0.97)" : "rgba(10,14,20,0.7)",
        borderBottom: scrolled ? "1px solid #1A2D42" : "1px solid transparent",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="relative w-8 h-8 flex-shrink-0">
                <svg viewBox="0 0 32 32" width="32" height="32">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
                  <circle cx="16" cy="16" r="9" fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
                  <circle cx="16" cy="16" r="4" fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
                  <line x1="16" y1="2" x2="16" y2="30" stroke="rgba(0,212,255,0.15)" strokeWidth="0.75" />
                  <line x1="2" y1="16" x2="30" y2="16" stroke="rgba(0,212,255,0.15)" strokeWidth="0.75" />
                  <circle cx="16" cy="16" r="2" fill="#00D4FF" style={{ filter: "drop-shadow(0 0 4px #00D4FF)" }} />
                </svg>
              </div>
              <div>
                <div className="font-tactical text-white leading-none" style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.08em" }}>
                  Captain's Charter Weather
                </div>
                <div className="font-data text-xs" style={{ color: "#7B9BB5", fontSize: "0.6rem", letterSpacing: "0.1em" }}>
                  MARINE INTELLIGENCE · FL &amp; BAHAMAS
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}>
                <span className="nav-link cursor-pointer" style={{ color: location === link.href ? "#00D4FF" : undefined }}>
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/book-briefing">
              <span
                className="font-tactical text-xs font-bold uppercase tracking-widest px-4 py-2 transition-all duration-200 cursor-pointer"
                style={{ background: "transparent", border: "1px solid rgba(0,212,255,0.4)", color: "#00D4FF", letterSpacing: "0.1em", display: "inline-block" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,212,255,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                Book a Briefing
              </span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5" style={{ background: "#00D4FF" }} />
            <span className="block w-5 h-0.5" style={{ background: "#00D4FF" }} />
            <span className="block w-5 h-0.5" style={{ background: "#00D4FF" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden" style={{ background: "rgba(10,14,20,0.98)", borderTop: "1px solid #1A2D42" }}>
          <div className="container py-4 flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}>
                <span
                  className="nav-link block py-2 cursor-pointer"
                  style={{ color: location === link.href ? "#00D4FF" : undefined }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/book-briefing">
              <span
                className="font-tactical text-xs font-bold uppercase tracking-widest px-4 py-2 cursor-pointer"
                style={{ background: "transparent", border: "1px solid rgba(0,212,255,0.4)", color: "#00D4FF", display: "inline-block" }}
                onClick={() => setMobileOpen(false)}
              >
                Book a Briefing
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
