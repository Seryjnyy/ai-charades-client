import { Box, Paper, Stack, Typography } from "@mui/material";

export default function About() {
  return (
    <Stack sx={{ maxWidth: 400, mx: "auto" }} gap={3}>
      <Paper sx={{ p: 1 }}>
        <Typography variant="h2">About</Typography>
        <Typography>
          AI will be here for a while. Best bet is to learn how to work with it
          rather than fear it.
          <br />
          Level-up your prompting skill with this game.
        </Typography>
      </Paper>

      <Paper sx={{ p: 1 }}>
        <Typography variant="h2">How to play?</Typography>
        <Typography>
          Choose your name, character and insert your access key to start
          playing. Create a room and invite a friend. Pick the topics you want
          to play with and start the game. You will be given topics that you
          have to explain to the AI in order for it to generate a image that the
          other player will understand. When both players are finished with
          prompting you will move onto guessing what the topic was from the
          image that the other player prompted.
        </Typography>
      </Paper>

      <Paper>
        <Typography variant="h2">More details</Typography>
        <Typography>
          The game uses OpenAIs DALL-E for image generation. As of right now,
          only DALLE-2 is available to use. So the images created might feel
          underwhelming if you have used Bing image creation
        </Typography>
      </Paper>

      <Paper
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="body2">
            @{new Date().getFullYear()} Jakub Wojcik
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          {/* <Button
                        onClick={() => {
                            window.open(
                                "https://www.buymeacoffee.com/jakubwojcik",
                                "_blank"
                            );
                        }}
                    >
                        <img src={buymeacoffee} />
                    </Button> */}
        </Box>
      </Paper>
    </Stack>
  );
}
