import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { IconButton } from "@mui/material";
import { useThemeMode } from "./ThemeModeContext";

export default function ThemeModeSelector() {
    const { mode, setMode } = useThemeMode();

    return (
        <IconButton
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            color="inherit"
        >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
    );
}
