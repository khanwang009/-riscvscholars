import { Link, Outlet, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "./ui";

export default function Layout() {
  const location = useLocation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Scholars & Labs", href: "/directory" },
    { name: "Collaboration", href: "/collaboration" },
    { name: "About & Policy", href: "/about" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-black bg-surface">
      {/* Header */}
      <header className="border-b border-border px-8 py-4 flex justify-between items-center bg-surface sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-accent font-bold text-xs underline">R</span>
            </div>
            <span className="tracking-tighter font-bold text-xl uppercase font-serif text-black">
              RISC-V Scholars
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-[11px] font-bold uppercase tracking-widest text-primary">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`transition-colors py-2 ${
                location.pathname === link.href
                  ? "border-b-2 border-accent"
                  : "hover:border-b-2 hover:border-border/50"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link to="/submit-request">
            <button className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
              Submit Request
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="p-6 bg-surface border-t border-border flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 gap-4 mt-auto">
        <div>© {new Date().getFullYear()} RISC-V SCHOLARS / Academic Stewardship</div>
        <div className="flex space-x-6">
          <Link to="/about" className="hover:text-primary transition-colors">Source Policy</Link>
          <Link to="/about" className="hover:text-primary transition-colors">Editorial Guidelines</Link>
          <Link to="/submit-request" className="hover:text-primary transition-colors">Submit Request</Link>
        </div>
      </footer>
    </div>
  );
}
