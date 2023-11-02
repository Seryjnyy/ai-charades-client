import React from "react";
import { Outlet } from "react-router-dom";
import { UserAuthContext } from "../Auth/UserAuthContext";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import NavBar from "../NavBar";
import { ThemeModeContext } from "../theme/ThemeModeContext";

const theme = createTheme({
    palette: {
        mode: "dark",
    },
});

export default function RootLayout() {
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
