import {
    Box,
    Button,
    Divider,
    Paper,
    Typography,
    Avatar as AvatarMUI,
} from "@mui/material";
import { Result } from "../GameRoom";
import Avatar, { genConfig } from "react-nice-avatar";
import ComputerIcon from "@mui/icons-material/Computer";
import { useNavigate } from "react-router-dom";
import { ResultDisplayAnimated } from "./ResultDisplayAnimated";
import { useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "../../Auth/UserAuthContext";

interface ResultsProps {
    results: Result[] | undefined;
    resultPlace: number;
    handleNext: () => void;
    nextResultPermissionSetting: string;
    host: string;
}

// TODO : still has issue warning:  Internal React error: Expected static flag was missing.
// something with hooks apparently
// only present on chrome non incognito browser, unsure why its like that
// not causing issues that can be seen so fine for now
// actually causing issue with game state in gameroom, it becomes undefined when going into results
// for some reason
export default function Results({
    results,
    resultPlace,
    handleNext,
    nextResultPermissionSetting,
    host,
}: ResultsProps) {
    if (results == undefined) {
        return <div>Results : Something went wrong :/</div>;
    }

    const { user } = useAuth();

    const authorPermission = (author: string) => {
        if (user?.userID == author) {
            return true;
        }

        return false;
    };

    const hostPermission = (_: string) => {
        if (user?.userID == host) {
            return true;
        }

        return false;
    };

    const hasNextPermission =
        nextResultPermissionSetting == "host"
            ? hostPermission
            : authorPermission;

    const navigate = useNavigate();

    const controls = useAnimation();

    // useEffect(() => {
    //     controls.set("hidden");
    //     controls.start("visible");
    // }, []);

    useEffect(() => {
        // Restarts animation for all clients this way, as opposed to having it in handleNext func
        controls.set("hidden");
        controls.start("visible");
        console.log("resultPlace");
    }, [resultPlace]);

    const handleNextAndAnim = () => {
        handleNext();
    };

    return (
        <Box sx={{ mx: "auto", maxWidth: 400 }}>
            <Typography variant="h2">Results</Typography>
            {results
                .slice(0, resultPlace + 1)
                .reverse()
                .map((result, index) => {
                    if (index > resultPlace) {
                        return;
                    }
                    return (
                        <div key={"result" + index}>
                            <ResultDisplayAnimated
                                controls={controls}
                                result={result}
                                index={resultPlace - index}
                                resultsLength={results.length}
                                animated={index == 0}
                            />

                            {index == 0 ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    {resultPlace < results.length - 1 &&
                                    hasNextPermission(
                                        result.prompter.userID
                                    ) ? (
                                        <Button
                                            onClick={handleNextAndAnim}
                                            sx={{ mb: 4 }}
                                        >
                                            next
                                        </Button>
                                    ) : (
                                        ""
                                    )}
                                </Box>
                            ) : (
                                ""
                            )}
                        </div>
                    );
                })}
            <Button onClick={() => navigate("/dashboard")}>Leave</Button>
        </Box>
    );
}
