import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import GameRoom from "./Game/GameRoom";
import { UserAuthContext } from "./Auth/UserAuthContext";
import LandingPage from "./Landing/LandingPage";
import RequireAuth from "./Auth/RequireAuth";
import NavBar from "./NavBar";
import { useThemeMode } from "./theme/ThemeModeContext";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";

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

    const theme = createTheme({});

    return (
        <UserAuthContext>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <NavBar />
                    <Routes>
                        <Route path={"/"} element={<LandingPage />}></Route>
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
                    </Routes>
                </ThemeProvider>
            </BrowserRouter>
        </UserAuthContext>
    );
}

export default App;
