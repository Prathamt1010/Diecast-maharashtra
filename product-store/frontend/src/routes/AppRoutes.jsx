import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ================= ADMIN =================
import Login from "../pages/Login/login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";
import Categories from "../pages/Categories/Categories";
import Layout from "../components/Layout";

// ================= CUSTOMER =================
import CustomerHome from "../pages/CustomerHome/CustomerHome";
import CustomerNavbar from "../components/CustomerNavbar/CustomerNavbar";
 import CustomerProducts from "../pages/CustomerProducts/CustomerProducts";
import CustomerProductDetails from "../pages/CustomerProductDetails/CustomerProductDetails";
// Uncomment when these components are created
import CustomerCategories from "../pages/CustomerCategories/CustomerCategories";
import Testimonials from "../pages/Testimonials/Testimonials";

import { useAuth } from "../context/AuthContext";


// =========================================
// PRIVATE ROUTE
// =========================================

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// =========================================
// APP ROUTES
// =========================================

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===================================== */}
        {/* CUSTOMER PUBLIC ROUTES */}
        {/* ===================================== */}

        {/* Customer Home */}
        <Route
          path="/"
          element={<CustomerHome />}
        />

        {/* Customer Shop */}
        <Route
          path="/shop"
          element={
            <>
             

              <CustomerProducts />

              
            </>
          }
        />

        {/* Customer Categories */}
        <Route
          path="/shop/categories"
          element={
            <>
             

              <CustomerCategories />

              
            </>
          }
        />

        {/* Customer Product Details */}
        <Route
          path="/shop/products/:id"
          element={
            <>
             

              <CustomerProductDetails />

             
            </>
          }
        />


        {/* ===================================== */}
        {/* ADMIN PUBLIC ROUTE */}
        {/* ===================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ===================================== */}
        {/* ADMIN PRIVATE ROUTES */}
        {/* ===================================== */}

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* Private Admin Dashboard */}
          <Route
            path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />

          {/* Private Admin Products */}
          <Route
            path="/products"
            element={<PrivateRoute><Products /></PrivateRoute>}
          />

          {/* Private Admin Categories */}
          <Route
            path="/categories"
            element={<PrivateRoute><Categories /></PrivateRoute>}
          />
<Route
  path="/testimonials"
  element={<Testimonials />}
/>


        </Route>

        


        {/* ===================================== */}
        {/* DEFAULT ROUTE */}
        {/* ===================================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;