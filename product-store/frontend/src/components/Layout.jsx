import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";

const Layout = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.startsWith("/products")) {
      return "Products";
    }

    if (location.pathname.startsWith("/categories")) {
      return "Categories";
    }

    return "Dashboard";
  };

  return (
    <div className="admin-layout">

      <Sidebar />

      <main className="admin-main">

        <Header title={getPageTitle()} />

        <div className="admin-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
};

export default Layout;