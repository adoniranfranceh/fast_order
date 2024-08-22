import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import { CustomersPage, CustomerDetailsPage, OrderDetails } from "../components/index.js"
import MyNavbar from "../components/Navbar";

const AppRoutes = () => (
  <Router>
    <MyNavbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clientes" element={<CustomersPage />} />
      <Route path="/cliente/:id" element={<CustomerDetailsPage />} />
      <Route path="/pedido/:id" element={<OrderDetails />} />
    </Routes>
  </Router>
);

export default AppRoutes;
