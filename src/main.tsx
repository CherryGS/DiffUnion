import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import ReactDOM from "react-dom/client";

import App from "./App";
import "./main.css";

document.body.setAttribute("theme-mode", "dark");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
