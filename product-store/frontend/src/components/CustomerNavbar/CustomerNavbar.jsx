import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";

import "./customerNavbar.css";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/shop/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const navLinkClass = ({ isActive }) =>
  isActive ? "customer-nav-link active" : "customer-nav-link";

const mobileLinkClass = ({ isActive }) =>
  isActive ? "customer-mobile-link active" : "customer-mobile-link";

const CustomerNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  // Lock page scroll while the full-screen mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="customer-navbar">
      {/* Logo */}
      <Link to="/" className="customer-navbar-logo" onClick={closeMenu}>
        <span className="customer-logo-mark">
          {!logoFailed ? (
            <img
              src="/images/logo.jpeg"
              alt=""
              className="customer-logo-image"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="customer-logo-fallback" aria-hidden="true">
              🚗
            </span>
          )}
        </span>

        <span className="customer-logo-text">
          <span className="customer-logo-title">Diecast</span>
          <span className="customer-logo-subtitle">Maharashtra</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="customer-desktop-nav" aria-label="Primary">
        {NAV_ITEMS.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClass}>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Desktop Actions */}
      <div className="customer-navbar-actions">
        <Link to="/shop" className="customer-navbar-shop-btn">
          <span>Shop now</span>
        </Link>
      </div>

      {/* Mobile Actions */}
      <div className="customer-mobile-actions">
        <button
          className="customer-menu-button"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`customer-mobile-menu${menuOpen ? " show" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="customer-mobile-nav" aria-label="Primary">
          {NAV_ITEMS.map(({ to, label, end }, index) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMenu}
              className={mobileLinkClass}
              style={{ "--i": index }}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span>{label}</span>
              <ArrowUpRight size={22} strokeWidth={2.2} />
            </NavLink>
          ))}
        </nav>

        <Link
          to="/shop"
          className="customer-mobile-shop-btn"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
        >
          <span>Shop now</span>
        </Link>
      </div>
    </header>
  );
};

export default CustomerNavbar;