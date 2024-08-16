import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import { CustomersPage } from "../components/index.js"
import MyNavbar from "../components/Navbar";

const AppRoutes = () => (
  <Router>
    <MyNavbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clientes" element={<CustomersPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
