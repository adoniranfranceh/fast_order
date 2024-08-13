import React from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./Navbar";
import App from "./App";
import Footer from "./Footer";

document.addEventListener("turbo:load", () => {
  // const navbarElement = document.getElementById("header-root");
  const contentElement = document.getElementById("content-root");
  const footerElement = document.getElementById("footer-root");

  // if (headerElement) {
  //   const headerRoot = createRoot(headerElement);
  //   headerRoot.render(<Header />);
  // }

  if (contentElement) {
    const contentRoot = createRoot(contentElement);
    contentRoot.render(<App />);
  }

  if (footerElement) {
    const footerRoot = createRoot(footerElement);
    footerRoot.render(<Footer />);
  }
});
