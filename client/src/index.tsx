import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { IconContext } from "react-icons";
import { TransactionProvider } from "context";
import { ToastContainer } from "react-toastify";

ReactDOM.render(
  <React.StrictMode>
    <IconContext.Provider value={{ className: "global-class-name" }}>
      <TransactionProvider>
        <App />
        <ToastContainer />
      </TransactionProvider>
    </IconContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
