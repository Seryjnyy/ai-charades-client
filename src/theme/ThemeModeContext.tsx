import React, { createContext, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";

interface ThemeContextType {
    mode: string;
    setMode: React.Dispatch<React.SetStateAction<string>>;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeModeContext({ children }) {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [mode, setMode] = useState<string>(
        prefersDarkMode ? "dark" : "light"
    );

    return (
        <ThemeContext.Provider value={{ mode, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeMode() {
    return useContext(ThemeContext);
}
