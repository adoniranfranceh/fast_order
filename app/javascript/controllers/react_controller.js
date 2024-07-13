import { Controller } from "@hotwired/stimulus"
import React from "react";
import ReactDom from "react-dom";
import HelloWorld from "../components/HelloWorld"

// Connects to data-controller="react"
export default class extends Controller {
  connect() {
    console.log("connected")

    const e = React.createElement;
    const root = ReactDom.createRoot(document.getElementById("root"));
    root.render(e(HelloWorld), root);
  }
}
