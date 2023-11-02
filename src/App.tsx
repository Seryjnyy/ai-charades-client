import {
    BrowserRouter,
    Route,
    RouterProvider,
    Routes,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import GameRoom from "./Game/GameRoom";
import { UserAuthContext } from "./Auth/UserAuthContext";
import LandingPage from "./Landing/LandingPage";
import RequireAuth from "./Auth/RequireAuth";
import NavBar from "./NavBar";
import { useThemeMode } from "./theme/ThemeModeContext";
import { ThemeProvider } from "@emotion/react";
import { Box, Container, CssBaseline, createTheme } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import About from "./About/About";

function App() {
    let { mode } = useThemeMode();

    // const theme = createTheme({
    //   spacing: 8,
    //   palette: {
    //     mode: mode,
    //     customGreen: {
    //       main: green[300],
    //       dark: green[800],
    //       light: green[200]
    //     }
    //   },
    //   typography:{
    //     "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
    //     "fontSize": 14,
    //     "fontWeightLight": 300,
    //     "fontWeightRegular": 400,
    //     "fontWeightMedium": 500
    //   },

    // })

    const theme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path={"/"} element={<LandingPage />}>
                <Route path={"/about"} element={<About />}></Route>
                {/* <Route
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
                ></Route> */}
            </Route>
        )
    );

    return (
        <>
            <UserAuthContext>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {/* <Container maxWidth={"lg"} sx={{ backgroundColor: "red" }}> */}
                    <NavBar />
                    {/* </Container> */}
                </ThemeProvider>
            </UserAuthContext>
        </>
    );
}

export default App;
