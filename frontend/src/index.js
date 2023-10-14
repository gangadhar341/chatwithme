import React from "react";
import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./components/context/chatContext.js";
import "./index.css";
/* import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js"; */
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import App from "./App.js";
import SocketProvider from "./components/context/socketContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChatProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
  </ChatProvider>
);
