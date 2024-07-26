import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hello from "../components/Hello";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Hello />} />
    </Routes>
  </Router>
);

export default AppRoutes;
