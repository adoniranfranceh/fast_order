import React from "react";
import AppRoutes from "../routes";
import { Navbar, Footer } from "./index.js";

const App = () => {
  return (
  <>
    <Navbar />
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {AppRoutes()}
    </div>
    <Footer />
  </>
  )
}

export default App;
