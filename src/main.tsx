import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { LocaleProvider } from "./state/LocaleContext";
import { MonetizationProvider } from "./state/MonetizationContext";
import { ReactionProductProvider } from "./state/ReactionProductContext";
import { ThemeProvider } from "./state/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LocaleProvider>
        <MonetizationProvider>
          <ReactionProductProvider>
            <App />
          </ReactionProductProvider>
        </MonetizationProvider>
      </LocaleProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
