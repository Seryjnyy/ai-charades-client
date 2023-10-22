import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import GameRoom from "./GameRoom";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Dashboard />}></Route>
                    <Route path={"/gameroom"} element={<GameRoom />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
