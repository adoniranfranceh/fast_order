import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import { CollaboratorsPage, CustomersPage, CustomerDetailsPage, OrdersPage, OrderDetails } from "../components/index.js"
import MyNavbar from "../components/Navbar";

const AppRoutes = () => (
  <Router>
    <MyNavbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clientes" element={<CustomersPage />} />
      <Route path="/cliente/:id" element={<CustomerDetailsPage />} />
      <Route path="/pedidos" element={<OrdersPage />} />
      <Route path="/pedido/:id" element={<OrderDetails />} />
      <Route path="/colaboradores/" element={<CollaboratorsPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
