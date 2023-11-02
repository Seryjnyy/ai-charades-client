import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Result } from "../GameRoom";
import { ResultDisplayAnimated } from "./ResultDisplayAnimated";
import { MotionValue } from "framer-motion/dom";
import { motion } from "framer-motion";

interface ResultsProps {
    results: Result[] | undefined;
}

export default function ResultsAnimated({ results }: ResultsProps) {
    if (results == undefined) {
        return <div>Results : Something went wrong :/</div>;
    }

    const navigate = useNavigate();

    const container = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0,
                staggerChildren: 7,
            },
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
        <Box sx={{ mx: "auto", maxWidth: 400 }}>
            <Typography variant="h2">Results</Typography>
            <motion.div variants={container} initial="hidden" animate="visible">
                {results.map((result, index) => (
                    <motion.div variants={item}>
                        <ResultDisplayAnimated
                            result={result}
                            index={index}
                            resultsLength={results.length}
                        />
                    </motion.div>
                ))}
            </motion.div>
            <Button onClick={() => navigate("/dashboard")}>Leave</Button>
        </Box>
    );
}
