// import React from "react";
// import ReactDOM from "react-dom";
// import "./style-sheets/index.css";
// import App from "./App";

// ReactDOM.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>,
//     document.getElementById("root")
// );

//import { createRoot } from "react-dom/client";
import { render } from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

const rootElement = document.getElementById("root");
//const root = createRoot(rootElement);
const root = document.getElementById("root");

// 👇️ wrap App in Router

root.render(
    <Router>
        <App />
    </Router>
);
