import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ReactDOM from "react-dom/client";
import "./index.css";
import OrderStatus from "./Components/OrderStatus";
import ConfirmationFromTransactionPoint from "./Components/ConfirmationFromTransactionPoint";
import OrderConfirm from "./Components/OrderConfirm";
import MainPage from "./Pages/MainPage";
import ShipmentsConfirm from "./Components/ShipmentsConfirm";
import { BrowserRouter as Router } from "react-router-dom";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Router>

    <App />
    {/* <ConfirmationFromTransactionPoint /> */}
    {/* <OrderConfirm />s */}
    {/* <OrdersConfirm /> */}
    {/* <Landing /> */}
    {/* <Home /> */}
    {/* <ShipmentsConfirm /> */}
   
  </Router>
);
