import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Paper,
  Typography,
} from "@mui/material";
import { AIModel, useWebSocket } from "./SocketContext";
import { useAuth } from "../../Auth/UserAuthContext";

const ResultControl = () => {
  const { roomstate, changeResultControlSetting } = useWebSocket();
  const { user } = useAuth();

  if (roomstate == undefined) {
    return <div>something went wrong in lobby settings result control</div>;
  }

  const handleResultControlChange = (setting: string) => {
    if (roomstate.settings.nextResultPermission == setting) return;

    changeResultControlSetting(setting);
  };

  const options = ["HOST", "AUTHOR"];

  return (
    <Box>
      <Typography sx={{ fontSize: 14 }}>Next result control</Typography>
      <Box sx={{ p: 0.6, width: "fit-content" }}>
        {options.map((option, index) => (
          <Chip
            key={index}
            label={option}
            variant="outlined"
            size="small"
            color={
              roomstate.settings.nextResultPermission == option
                ? "primary"
                : "default"
            }
            onClick={
              roomstate.creator == user?.userID
                ? () => handleResultControlChange(option)
                : undefined
            }
            sx={{ mr: 1 }}
          />
        ))}
      </Box>
    </Box>
  );
};

const RoundCount = () => {
  const { roomstate, changeRoundCountSetting } = useWebSocket();
  const { user } = useAuth();

  if (roomstate == undefined) {
    return <div>something went wrong in lobby settings round count</div>;
  }

  const handleRoundCountChange = (roundCount: number) => {
    if (roomstate.settings.roundCount == roundCount) return;

    changeRoundCountSetting(roundCount);
  };

  return (
    <Box>
      <Typography sx={{ fontSize: 14 }}>Rounds</Typography>
      <Box sx={{ p: 0.6, width: "fit-content" }}>
        {[2, 4, 6, 8, 10, 12].map((count) => (
          <Chip
            key={count}
            label={"" + count}
            variant="outlined"
            size="small"
            color={
              roomstate.settings.roundCount == count ? "primary" : "default"
            }
            onClick={
              roomstate.creator == user?.userID
                ? () => handleRoundCountChange(count)
                : undefined
            }
            sx={{ mr: 1 }}
          />
        ))}
      </Box>
    </Box>
  );
};

const AIModels = () => {
  const { roomstate, changeAIModelSetting } = useWebSocket();
  const { user } = useAuth();

  if (roomstate == undefined) {
    return <div>something went wrong in lobby settings model control</div>;
  }

  const handleModelChange = (model: AIModel) => {
    console.log("try change to ", model);
    if (roomstate.settings.aiModel == model) return;
    changeAIModelSetting(model);
  };

  const options = [
    { value: "dall-e-3", label: "DALL-E 3", cost: "2.5x" },
    { value: "dall-e-2", label: "DALL-E 2", cost: "1x" },
  ] as const;

  return (
    <Box>
      <Typography sx={{ fontSize: 14 }}>AI Model</Typography>
      <Box sx={{ p: 0.6, width: "fit-content" }}>
        {options.map((option, index) => (
          <Chip
            key={index}
            label={
              <Typography fontSize={12}>
                {option.label} |{" "}
                <Typography
                  component={"span"}
                  fontSize={12}
                  sx={{ opacity: "50%" }}
                >
                  {option.cost}
                </Typography>
              </Typography>
            }
            variant="outlined"
            size="small"
            color={
              roomstate.settings.aiModel == option.value ? "primary" : "default"
            }
            onClick={
              roomstate.creator == user?.userID
                ? () => handleModelChange(option.value)
                : undefined
            }
            sx={{ mr: 1 }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default function LobbySettings() {
  return (
    <Box sx={{ mb: 4, border: 1, borderRadius: 1, borderColor: "darkgray" }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h3">Settings</Typography>
        </Box>
      </Box>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          {/* <Typography>settings</Typography> */}
          <SettingsIcon />
        </AccordionSummary>
        <AccordionDetails sx={{ mt: 0, pt: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <AIModels />
            <RoundCount />
            <ResultControl />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
