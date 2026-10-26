
// import React from "react";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";

// // Admin pages
// import Login from "../pages/Login/login";
// import Dashboard from "../pages/Dashboard/Dashboard";
// import Products from "../pages/Products/Products";
// import Categories from "../pages/Categories/Categories";
// import Testimonials from "../pages/Testimonials/Testimonials";
// import Layout from "../components/Layout";

// // Customer pages
// import CustomerHome from "../pages/CustomerHome/CustomerHome";
// import CustomerProducts from "../pages/CustomerProducts/CustomerProducts";
// import CustomerProductDetails from "../pages/CustomerProductDetails/CustomerProductDetails";
// import CustomerCategories from "../pages/CustomerCategories/CustomerCategories";

// // Protect admin routes

// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated, admin, token } = useAuth();

//   if (!isAuthenticated || !token || !admin) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };


// // Redirect authenticated admins away from login
// const PublicLoginRoute = () => {
//   const { isAuthenticated } = useAuth();

//   return isAuthenticated
//     ? <Navigate to="/dashboard" replace />
//     : <Login />;
// };

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* CUSTOMER PUBLIC ROUTES */}
//         <Route path="/" element={<CustomerHome />} />
//         <Route path="/shop" element={<CustomerProducts />} />
//         <Route
//           path="/shop/categories"
//           element={<CustomerCategories />}
//         />
//         <Route
//           path="/shop/products/:id"
//           element={<CustomerProductDetails />}
//         />

//         {/* ADMIN LOGIN */}
//         <Route
//           path="/login"
//           element={<PublicLoginRoute />}
//         />

//         {/* ADMIN PRIVATE ROUTES */}
//         <Route
//           path="/admin"
//           element={
//             <PrivateRoute>
//               <Layout />
//             </PrivateRoute>
//           }
//         >
//           <Route
//             path="dashboard"
//             element={<Dashboard />}
//           />
//           <Route
//             path="products"
//             element={<Products />}
//           />
//           <Route
//             path="categories"
//             element={<Categories />}
//           />
//           <Route
//             path="testimonials"
//             element={<Testimonials />}
//           />
//         </Route>

//         {/* UNKNOWN ROUTES */}
//         <Route
//           path="*"
//           element={<Navigate to="/" replace />}
//         />

//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;



import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

// Admin pages
import Login from "../pages/Login/login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";
import Categories from "../pages/Categories/Categories";
import Testimonials from "../pages/Testimonials/Testimonials";
import Layout from "../components/Layout";

// Customer pages
import CustomerHome from "../pages/CustomerHome/CustomerHome";
import CustomerProducts from "../pages/CustomerProducts/CustomerProducts";
import CustomerProductDetails from "../pages/CustomerProductDetails/CustomerProductDetails";
import CustomerCategories from "../pages/CustomerCategories/CustomerCategories";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, admin, token } = useAuth();

  if (!isAuthenticated || !token || !admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicLoginRoute = () => {
  const { isAuthenticated, admin, token } = useAuth();

  // Redirect only when all authentication data exists
  if (isAuthenticated && admin && token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Login />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer public routes */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/shop" element={<CustomerProducts />} />
        <Route
          path="/shop/categories"
          element={<CustomerCategories />}
        />
        <Route
          path="/shop/products/:id"
          element={<CustomerProductDetails />}
        />

        {/* Admin login */}
        <Route path="/login" element={<PublicLoginRoute />} />

        {/* Admin protected routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="testimonials" element={<Testimonials />} />
        </Route>

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

