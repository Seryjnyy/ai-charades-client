import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useRouteError,
} from "react-router-dom";
import About from "./About/About";
import RequireAuth from "./Auth/RequireAuth";
import Dashboard from "./Dashboard/Dashboard";
import LandingPage from "./Landing/LandingPage";
import RootLayout from "./Layouts/RootLayout";
import GameRoom from "./Game/GameRoom";

function ErrorBoundary() {
  let error = useRouteError();

  // TODO : implement
  return (
    <div>
      <div>Dang!</div>

      <div> Go Back!</div>
    </div>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={"/"} element={<RootLayout />}>
      <Route
        path={"/gameroom"}
        element={
          <RequireAuth redirectTo={"/"}>
            <GameRoom />
          </RequireAuth>
        }
        // errorElement={<ErrorBoundary />}
      ></Route>
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
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
