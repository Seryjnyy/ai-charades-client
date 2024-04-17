import ComputerIcon from "@mui/icons-material/Computer";
import {
  Avatar as AvatarMUI,
  Box,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { AnimationControls, LazyMotion, domAnimation, m } from "framer-motion";
import Avatar, { genConfig } from "react-nice-avatar";
import { Result } from "./SocketContext";

type ResultProps = {
  result: Result;
  index: number;
  resultsLength: number;
  animated: boolean;
  controls: AnimationControls;
};

function ResultDisplayAnimated({
  result,
  resultsLength,
  index,
  animated,
  controls,
}: ResultProps) {
  const prompterAvatarSeed = genConfig(result.prompter.userAvatarSeed);
  const guesserAvatarSeed = genConfig(result.guesser.userAvatarSeed);

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 1,
        staggerChildren: 2,
      },
    },
  };

  const resultContainer = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div variants={resultContainer} animate={animated ? controls : ""}>
        <Paper sx={{ display: "flex", flexDirection: "column", mb: 3 }}>
          <Box sx={{ mx: 2 }}>
            <Typography align="center" color={"grey"} sx={{ fontSize: 12 }}>
              {index + 1}/{resultsLength}
            </Typography>
            <Typography sx={{ py: 0.4 }} align="center">
              {/* {result.topic} */}
            </Typography>
          </Box>
          <Divider />

          <m.div variants={container} animate={animated ? controls : ""}>
            <Box sx={{ mt: 2, mb: 2 }}>
              <m.div variants={item}>
                <Box
                  sx={{
                    ml: "auto",
                    mr: 1,
                    pl: 1,
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
              </m.div>

              <m.div variants={item}>
                <Box sx={{ mr: "auto", ml: 1, mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "fit-content",
                      mr: "auto",
                    }}
                  >
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
                    <Box sx={{ cursor: "pointer" }}>
                      <img src={result.imageURI} width={"256"} height={"256"} />
                    </Box>
                  </Paper>
                </Box>
              </m.div>

              <m.div variants={item}>
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
              </m.div>
              <m.div variants={item}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    pt: 2,
                    flexDirection: "column",
                  }}
                >
                  <Typography sx={{ opacity: "80%", pr: 1 }}>
                    Topic was
                  </Typography>
                  {result.topic}
                </Box>
              </m.div>
            </Box>
          </m.div>
        </Paper>
      </m.div>
    </LazyMotion>
  );
}

export { ResultDisplayAnimated };
