import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import React from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
  borderRadius: 2,
};

export default function HowToPlay() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>How to play?</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="help-modal-title"
        aria-describedby="help-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography id="help-modal-title" variant="h5" component="h2">
              How to play?
            </Typography>
            <Button
              sx={{ maxWidth: 30, minWidth: 30, maxHeight: 30, minHeight: 30 }}
              onClick={() => setOpen(false)}
            >
              X
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ opacity: "70%" }}>
              First Create or Join a room.
            </Typography>
            <Typography sx={{ mt: 2 }} fontWeight={"fontWeightMedium"}>
              In the Lobby
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="1. Invite your friend."
                  secondary={
                    "Click the share button for the invite code and send it to them."
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="2. Configure the game settings to your liking."
                  secondary={
                    "Select topic categories, round amount, the AI model for image generation, and who gets to reveal the answers."
                  }
                />
              </ListItem>
            </List>
            <Typography sx={{ mt: 2 }} fontWeight={"fontWeightMedium"}>
              In the Game
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="1. Create prompts for images that will explain the given topics."
                  secondary={
                    "The prompt will be used by the AI to generate an image the other player will have to guess."
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="2. Guess what the images are meant to represent."
                  secondary={
                    "You will get AI generated images and you will have to guess what they are meant to be."
                  }
                />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
