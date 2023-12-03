import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    Paper,
    Typography,
} from "@mui/material";
import { useWebSocket } from "./SocketContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../Auth/UserAuthContext";

const SelectedTopics = () => {
    const { roomstate, removeTopic } = useWebSocket();

    if (roomstate == undefined) {
        return <div>something went wrong in lobby selected topics</div>;
    }

    const removeSelectedTopic = (topic: string) => {
        if (!roomstate.lobbyState.selectedTopics.includes(topic)) return;

        removeTopic(topic);
    };

    return (
        <Paper
            sx={{
                display: "flex",
                justifyContent: "start",
                flexWrap: "wrap",
                minHeight: 40,
                p: 0.5,
                m: 0,
            }}
            elevation={2}
        >
            {roomstate.lobbyState.selectedTopics.map((topic, index) => {
                return (
                    <Chip
                        key={topic + index}
                        variant="outlined"
                        label={
                            topic
                            // + " " +
                            // roomState?.availableTopics.find(
                            //     (item) => item.topic == topic
                            // )?.itemsInTopic
                        }
                        sx={{ mr: 0.4, my: 0.4 }}
                        onDelete={() => {
                            removeSelectedTopic(topic);
                        }}
                    />
                );
            })}
        </Paper>
    );
};

const SelectTopics = () => {
    const { roomstate, addTopic } = useWebSocket();
    const { user } = useAuth();

    if (roomstate == undefined) {
        return <div>something went wrong in lobby select topics</div>;
    }

    const selectTopic = (topic: string) => {
        if (roomstate.lobbyState.selectedTopics.includes(topic)) return;

        addTopic(topic);
    };

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                {/* <Typography>Add topics</Typography> */}
                <AddIcon sx={{ width: 32, height: 32 }} />
            </AccordionSummary>
            <AccordionDetails>
                {roomstate.lobbyState.availableTopics.map((topic, index) => (
                    <Chip
                        key={"topic" + index}
                        variant="outlined"
                        label={topic.topic + " " + topic.itemCount}
                        sx={{ mr: 0.4, my: 0.4 }}
                        onClick={
                            roomstate.creator == user?.userID
                                ? () => selectTopic(topic.topic)
                                : undefined
                        }
                        // onClick={roomstate.creator == user?.userID ? () => selectTopic(topic.topic)}
                    />
                ))}
            </AccordionDetails>
        </Accordion>
    );
};

export default function LobbyTopics() {
    const { roomstate } = useWebSocket();

    if (roomstate == undefined) {
        return <div>something went wrong in lobby topics</div>;
    }

    return (
        <Box
            sx={{ mb: 4, border: 1, borderRadius: 1, borderColor: "darkgray" }}
        >
            <Box sx={{ ml: 2 }}>
                <Typography variant="h3">Topics</Typography>
                <Typography sx={{ color: "grey" }}>
                    {roomstate.lobbyState.selectedTopics
                        .map(
                            (topic) =>
                                roomstate.lobbyState.availableTopics.find(
                                    (item) => item.topic == topic
                                )?.itemCount
                        )
                        .reduce((accumulator, currentValue) => {
                            return accumulator! + currentValue!;
                        }, 0)}
                </Typography>
            </Box>

            <SelectedTopics />
            <SelectTopics />
        </Box>
    );
}
