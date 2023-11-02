import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import About from "./About/About";
import RequireAuth from "./Auth/RequireAuth";
import Dashboard from "./Dashboard/Dashboard";
import GameRoom from "./Game/GameRoom";
import LandingPage from "./Landing/LandingPage";
import RootLayout from "./Layouts/RootLayout";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={"/"} element={<RootLayout />}>
            <Route index path={"/"} element={<LandingPage />}></Route>
            <Route path={"/about"} element={<About />}></Route>
            <Route
                path={"/dashboard"}
                element={
                    <RequireAuth redirectTo={"/"}>
                        <Dashboard />
                    </RequireAuth>
                }
            ></Route>

            <Route
                path={"/gameroom"}
                element={
                    <RequireAuth redirectTo={"/"}>
                        <GameRoom />
                    </RequireAuth>
                }
            ></Route>
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
