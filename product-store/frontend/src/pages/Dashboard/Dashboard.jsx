import React from "react";
import {
  Package,
  CheckCircle,
  Tags,
  AlertCircle,
} from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Products",
      value: "24",
      icon: Package,
    },
    {
      title: "Active Products",
      value: "20",
      icon: CheckCircle,
    },
    {
      title: "Total Categories",
      value: "4",
      icon: Tags,
    },
    {
      title: "Uncategorized",
      value: "2",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="dashboard-page">

      {/* Page heading */}

      <div className="dashboard-top">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p>
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
      </div>


      {/* Statistics */}

      <div className="dashboard-stats">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>

              <div className="stat-card-top">
                <div className="stat-icon">
                  <Icon size={20} />
                </div>
              </div>

              <h3>{stat.value}</h3>

              <p>{stat.title}</p>

            </div>
          );
        })}

      </div>


      {/* Dashboard content */}

      <div className="dashboard-grid">

        {/* Recent Products */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">
            <h2>Recent Products</h2>

            <a href="/products">
              View all
            </a>
          </div>

          <div className="dashboard-card-body">

            <div className="recent-product">

              <div className="recent-product-image">
                <Package size={22} />
              </div>

              <div className="recent-product-info">
                <h4>Hot Wheels Premium Car</h4>
                <p>Premium</p>
              </div>

              <span className="recent-product-price">
                ₹599
              </span>

            </div>


            <div className="recent-product">

              <div className="recent-product-image">
                <Package size={22} />
              </div>

              <div className="recent-product-info">
                <h4>Matchbox Ford Mustang</h4>
                <p>Matchbox</p>
              </div>

              <span className="recent-product-price">
                ₹499
              </span>

            </div>


            <div className="recent-product">

              <div className="recent-product-image">
                <Package size={22} />
              </div>

              <div className="recent-product-info">
                <h4>Limited Edition BMW</h4>
                <p>Limited Edition</p>
              </div>

              <span className="recent-product-price">
                ₹899
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;