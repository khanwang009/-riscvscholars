import { Link, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, Globe2 } from "lucide-react";
import { Button } from "./ui";

const navLinks = [
  { name: "Home", href: "/", matchPath: "/" },
  { name: "Scholars & Labs", href: "/directory", matchPath: "/directory" },
  { name: "Research Lines", href: "/research-lines", matchPath: "/research-lines" },
  { name: "Collaboration", href: "/collaboration", matchPath: "/collaboration" },
  { name: "Explainers", href: "/about#source-policy", matchPath: "/about" },
  { name: "About", href: "/about", matchPath: "/about" },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans text-black bg-surface">
      <header className="border-b border-border bg-surface/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-accent font-bold text-sm">RV</span>
              </div>
              <div>
                <div className="tracking-tight font-bold text-xl uppercase font-serif text-black">
                  RISC-V Scholars
                </div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                  Scholar-facing collaboration gateway
                </div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-3">
              <Link to="/claim-profile">
                <Button variant="ghost" className="border border-border">
                  Claim a Profile
                </Button>
              </Link>
              <Link to="/submit-request">
                <Button className="gap-2">
                  Submit Request <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <nav className="flex flex-wrap gap-4 sm:gap-6 text-[11px] font-bold uppercase tracking-widest text-primary">
              {navLinks.map((link) => {
                const isActive =
                  link.matchPath === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.matchPath);

                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`transition-colors py-1 border-b-2 ${
                      isActive
                        ? "border-accent text-black"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 text-[11px] text-gray-600">
              <Globe2 className="w-4 h-4 text-primary" />
              <span>
                Public-source profiles, curated introductions, low-ops academic intake.
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-serif text-xl text-primary mb-2">RISC-V Scholars</div>
            <p className="text-sm text-gray-600 leading-relaxed">
              A source-based gateway for Chinese labs to understand overseas RISC-V institutions
              and begin structured collaboration requests.
            </p>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500 mb-3">
              Explore
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/directory" className="hover:text-primary transition-colors">
                Scholars & Labs
              </Link>
              <Link to="/research-lines" className="hover:text-primary transition-colors">
                Research Lines
              </Link>
              <Link to="/collaboration" className="hover:text-primary transition-colors">
                Collaboration Flow
              </Link>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500 mb-3">
              Policies & Intake
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/about#source-policy" className="hover:text-primary transition-colors">
                Source Policy
              </Link>
              <Link to="/about#correction-policy" className="hover:text-primary transition-colors">
                Correction Path
              </Link>
              <Link to="/claim-profile" className="hover:text-primary transition-colors">
                Claim a Profile
              </Link>
              <Link to="/submit-request" className="hover:text-primary transition-colors">
                Submit Request
              </Link>
              <Link to="/admin" className="hover:text-primary transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
