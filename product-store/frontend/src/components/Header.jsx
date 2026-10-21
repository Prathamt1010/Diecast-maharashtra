import React from "react";
import { Bell } from "lucide-react";
import "./header.css";

const Header = ({ title = "Dashboard" }) => {
  return (
    <header className="admin-header">

      <div className="header-left">
        <h1>{title}</h1>
        <p>Manage your Diecast Maharashtra store</p>
      </div>

      <div className="header-right">

        {/* <button className="header-notification">
          <Bell size={19} />
        </button> */}

        <div className="admin-profile">

          <div className="admin-avatar">
            A
          </div>

          <div className="admin-profile-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

        </div>

      </div>

    </header>
  );
};

export default Header;