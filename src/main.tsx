import React from "react";
import { BrowserRouter } from "react-router";

import ReactDOM from "react-dom/client";

import App from "./App";
import "./main.css";

document.body.setAttribute("theme-mode", "dark");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
