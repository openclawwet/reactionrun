import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { LocaleProvider } from "./state/LocaleContext";
import { MonetizationProvider } from "./state/MonetizationContext";
import { ReactionProductProvider } from "./state/ReactionProductContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocaleProvider>
      <MonetizationProvider>
        <ReactionProductProvider>
          <App />
        </ReactionProductProvider>
      </MonetizationProvider>
    </LocaleProvider>
  </React.StrictMode>,
);
