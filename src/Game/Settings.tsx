import { Box, Chip, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface SettingsProps {
    nextResultPermission: string;
    handleChangeSetting: (setting: string) => void;
    roundCount: number;
    handleChangeRoundCount: (count: number) => void;
}

export default function Settings({
    nextResultPermission,
    handleChangeSetting,
    roundCount,
    handleChangeRoundCount,
}: SettingsProps) {
    return (
        <div>
            <Box>
                <Typography sx={{ fontSize: 14 }}>
                    Next result control
                </Typography>
                <Paper
                    elevation={2}
                    sx={{ p: 0.6, borderRadius: 2, width: "fit-content" }}
                >
                    <Chip
                        label="host"
                        variant="outlined"
                        size="small"
                        color={
                            nextResultPermission == "host"
                                ? "primary"
                                : "default"
                        }
                        onClick={() => handleChangeSetting("host")}
                        sx={{ mr: 1 }}
                    />
                    <Chip
                        label="author of prompt"
                        variant="outlined"
                        size="small"
                        color={
                            nextResultPermission == "author"
                                ? "primary"
                                : "default"
                        }
                        onClick={() => handleChangeSetting("author")}
                    />
                </Paper>
            </Box>
            <Box>
                <Typography sx={{ fontSize: 14 }}>Rounds</Typography>
                <Paper
                    elevation={2}
                    sx={{ p: 0.6, borderRadius: 2, width: "fit-content" }}
                >
                    {[2, 4, 6, 8, 10, 12].map((count) => (
                        <Chip
                            label={"" + count}
                            variant="outlined"
                            size="small"
                            color={roundCount == count ? "primary" : "default"}
                            onClick={() => handleChangeRoundCount(count)}
                            sx={{ mr: 1 }}
                        />
                    ))}
                </Paper>
            </Box>
        </div>
    );
}
