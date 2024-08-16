import React from "react";
import AppRoutes from "../routes";
import { Navbar, Footer } from "./index.js";

const App = () => {
  return (
  <>
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {AppRoutes()}
    </div>
  </>
  )
}

export default App;
