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

interface ResultsProps {
    results: Result[] | undefined;
}

export default function Results({ results }: ResultsProps) {
    if (results == undefined) {
        return <div>Results : Something went wrong :/</div>;
    }

    const navigate = useNavigate();

    return (
        <Box sx={{ mx: "auto", maxWidth: 400 }}>
            <Typography variant="h2">Results</Typography>
            {results.map((result, index) => {
                console.log(result.prompter);
                const prompterAvatarSeed = genConfig(
                    result.prompter.userAvatarSeed
                );

                console.log(result.guesser);
                const guesserAvatarSeed = genConfig(
                    result.guesser.userAvatarSeed
                );

                return (
                    <Paper
                        key={"result" + index}
                        sx={{ display: "flex", flexDirection: "column", mb: 3 }}
                    >
                        <Box sx={{ mx: 2 }}>
                            <Typography
                                align="center"
                                color={"grey"}
                                sx={{ fontSize: 12 }}
                            >
                                {index + 1}/{results.length}
                            </Typography>
                            <Typography sx={{ py: 0.4 }} align="center">
                                {result.topic}
                            </Typography>
                        </Box>
                        <Divider />

                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Box
                                sx={{
                                    ml: "auto",
                                    mr: 1,
                                    mb: 3,
                                    width: "fit-content",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "fit-content",
                                        ml: "auto",
                                    }}
                                >
                                    <Typography color={"grey"} sx={{ mr: 0.8 }}>
                                        {result.prompter.username}
                                    </Typography>
                                    <Avatar
                                        style={{
                                            width: "1.8rem",
                                            height: "1.8rem",
                                        }}
                                        {...prompterAvatarSeed}
                                    />
                                </Box>
                                <Paper
                                    sx={{
                                        width: "fit-content",
                                        p: 1.3,
                                        mr: 1.5,
                                        ml: "auto",
                                        mt: 1,
                                        borderRadius: 3,
                                    }}
                                    elevation={6}
                                >
                                    <Typography sx={{ fontSize: 14 }}>
                                        {result.prompt}
                                    </Typography>
                                </Paper>
                            </Box>

                            <Box sx={{ mr: "auto", ml: 1, mb: 3 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "fit-content",
                                        mr: "auto",
                                    }}
                                >
                                    {/* <Avatar
                                    style={{ width: "1.8rem", height: "1.8rem" }}
                                    {...config}
                                /> */}
                                    <AvatarMUI
                                        sx={{
                                            maxWidth: "1.8rem",
                                            maxHeight: "1.8rem",
                                            backgroundColor: "lightblue",
                                        }}
                                    >
                                        <ComputerIcon fontSize="small" />
                                    </AvatarMUI>
                                    <Typography color={"grey"} sx={{ ml: 0.8 }}>
                                        AI
                                    </Typography>
                                </Box>
                                <Paper
                                    sx={{
                                        width: "fit-content",
                                        p: 1.3,
                                        ml: 1.5,
                                        mr: 1,
                                        mt: 1,
                                        borderRadius: 3,
                                    }}
                                    elevation={6}
                                >
                                    <img src={result.imageURI} />
                                </Paper>
                            </Box>

                            <Box sx={{ mr: "auto", ml: 1, mb: 2 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "fit-content",
                                        mr: "auto",
                                    }}
                                >
                                    <Avatar
                                        style={{
                                            width: "1.8rem",
                                            height: "1.8rem",
                                        }}
                                        {...guesserAvatarSeed}
                                    />
                                    <Typography color={"grey"} sx={{ ml: 0.8 }}>
                                        {result.guesser.username}
                                    </Typography>
                                </Box>
                                <Paper
                                    sx={{
                                        width: "fit-content",
                                        p: 1.3,
                                        ml: 1.5,
                                        mr: 1,
                                        mt: 1,
                                        borderRadius: 3,
                                    }}
                                    elevation={6}
                                >
                                    <Typography sx={{ fontSize: 14 }}>
                                        Is that {result.guess}?
                                    </Typography>
                                </Paper>
                            </Box>
                        </Box>
                    </Paper>
                );
            })}
            <Button onClick={() => navigate("/dashboard")}>Leave</Button>
        </Box>
    );
}
