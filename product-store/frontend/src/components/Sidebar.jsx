
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  MessageSquareQuote,
  LogOut,
} from "lucide-react";

import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="admin-sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <img
          src="/logo.webp"
          alt="Diecast Maharashtra"
        />

        <div className="sidebar-logo-text">
          <h2>Diecast Maharashtra</h2>
          <span>ADMIN PANEL</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <NavLink to="/dashboard">
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/products">
          <Package size={19} />
          <span>Products</span>
        </NavLink>

        <NavLink to="/categories">
          <Tags size={19} />
          <span>Categories</span>
        </NavLink>

        <NavLink to="/testimonials">
          <MessageSquareQuote size={19} />
          <span>Testimonials</span>
        </NavLink>

      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="sidebar-logout">
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;

