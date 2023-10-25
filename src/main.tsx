import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import "./index.css";
import { ThemeModeContext } from "./theme/ThemeModeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeModeContext>
            <App />
        </ThemeModeContext>
    </React.StrictMode>
);
