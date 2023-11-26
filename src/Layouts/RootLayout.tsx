import React from "react";
import { Outlet } from "react-router-dom";
import { UserAuthContext } from "../Auth/UserAuthContext";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import NavBar from "../NavBar";
import { ThemeModeContext } from "../theme/ThemeModeContext";

export default function RootLayout() {
    // let { mode } = useThemeMode();

    const theme = createTheme({
        spacing: 6,
        palette: {
            mode: "dark",
        },
        typography: {
            fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
            fontSize: 14,
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 500,
        },
    });

    // const theme = createTheme({
    //     palette: {
    //         mode: "dark",
    //     },
    // });

    return (
        <div>
            <UserAuthContext>
                <ThemeModeContext>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        {/* <Container maxWidth={"lg"} sx={{ backgroundColor: "red" }}> */}
                        <NavBar />
                        <Outlet />
                        {/* </Container> */}
                    </ThemeProvider>
                </ThemeModeContext>
            </UserAuthContext>
        </div>
    );
}
