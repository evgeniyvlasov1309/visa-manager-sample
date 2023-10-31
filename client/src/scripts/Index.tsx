import App from "@scripts/App";
import "@styles/index.scss";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
const container = document.getElementById("app");

if (container) {
    render(
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>,
        container
    );
}
