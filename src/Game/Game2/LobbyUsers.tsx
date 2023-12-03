import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Avatar, { genConfig } from "react-nice-avatar";
import { useAuth } from "../../Auth/UserAuthContext";
import { useWebSocket } from "./SocketContext";
import crownLogo from "../../assets/crown.svg";
import PersonIcon from "@mui/icons-material/Person";

export default function LobbyUsers() {
    const { roomstate } = useWebSocket();
    const { user } = useAuth();

    if (roomstate == undefined) {
        return <div>something went wrong in lobby users</div>;
    }

    return (
        <Box
            sx={{ mb: 4, border: 1, borderRadius: 1, borderColor: "darkgray" }}
        >
            <Box sx={{ ml: 2 }}>
                <Typography variant="h3">Users</Typography>
                <Typography sx={{ color: "grey" }}>
                    {roomstate.users.length}/{2}
                </Typography>
            </Box>
            {roomstate.users.map((groupUser, index) => {
                let isUs = groupUser.userID == user!.userID;
                let isCreator = false;

                if (groupUser.userID == roomstate.creator) isCreator = true;

                const config = genConfig(groupUser.userAvatarSeed);

                return (
                    <Paper
                        key={groupUser.userID + index}
                        elevation={2}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 1.3,
                            justifyContent: "space-between",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                position={"relative"}
                                sx={{
                                    width: "fit-content",
                                    height: "fit-content",
                                    mr: 4,
                                }}
                            >
                                <Avatar
                                    style={{
                                        width: "4rem",
                                        height: "4rem",
                                    }}
                                    {...config}
                                />
                                {isUs ? (
                                    <Box
                                        position={"absolute"}
                                        sx={{
                                            height: 25,
                                            width: 25,
                                            right: -8,
                                            bottom: -8,
                                            borderRadius: 6,
                                            backgroundColor: "black",
                                        }}
                                    >
                                        <PersonIcon />
                                    </Box>
                                ) : (
                                    ""
                                )}
                            </Box>
                            <Typography>{groupUser.username}</Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "end",
                            }}
                        >
                            {isCreator ? (
                                <Box
                                    sx={{
                                        maxWidth: 21,
                                        maxHeight: 21,
                                        minWidth: 21,
                                        minHeight: 21,
                                    }}
                                >
                                    <img src={crownLogo} alt="Crown" />
                                </Box>
                            ) : (
                                <></>
                            )}
                        </Box>
                    </Paper>
                );
            })}
        </Box>
    );
}
