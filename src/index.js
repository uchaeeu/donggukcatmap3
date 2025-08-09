import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";

// 전역 스타일 import (global.css 경로 맞춰서)
import "./styles/global.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

