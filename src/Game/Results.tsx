import { useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "./SocketContext";
import { Box, Button, Typography } from "@mui/material";
import { ResultDisplayAnimated } from "./ResultDisplayAnimated";
import { useAuth } from "../Auth/UserAuthContext";

export default function Results() {
  const { roomstate, nextResult } = useWebSocket();
  const { user } = useAuth();

  if (roomstate == undefined || user == undefined) {
    return <div>Results : Something went wrong :/</div>;
  }

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
  }, [roomstate]);

  const handleNextAndAnim = () => {
    if (
      roomstate.resultState.resultPlace + 1 <
      roomstate.resultState.results.length
    ) {
      nextResult();
    }
  };

  return (
    <Box sx={{ mx: "auto", maxWidth: 400 }}>
      <Typography variant="h2">Results</Typography>
      {roomstate.resultState.results
        .slice(0, roomstate.resultState.resultPlace + 1)
        .reverse()
        .map((result, index) => {
          if (index > roomstate.resultState.resultPlace) {
            return;
          }
          return (
            <div key={"result" + index}>
              <ResultDisplayAnimated
                controls={controls}
                result={result}
                index={roomstate.resultState.resultPlace - index}
                resultsLength={roomstate.resultState.results.length}
                animated={index == 0}
              />

              {index == 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {roomstate.resultState.resultPlace <
                    roomstate.resultState.results.length - 1 &&
                    roomstate.resultState.currentRevealer == user.userID && (
                      <Button onClick={handleNextAndAnim} sx={{ mb: 4 }}>
                        next
                      </Button>
                    )}
                </Box>
              ) : (
                ""
              )}
            </div>
          );
        })}
      <Button onClick={() => navigate("/dashboard")} sx={{ mb: 2 }}>
        Leave
      </Button>
    </Box>
  );
}
