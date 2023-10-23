import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import GameRoom from "./GameRoom";
import { UserAuthContext } from "./UserAuthContext";
import LandingPage from "./LandingPage";
import RequireAuth from "./RequireAuth";

function App() {
    return (
        <UserAuthContext>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<LandingPage />}></Route>
                    <Route
                        path={"/dashboard"}
                        element={
                            <RequireAuth redirectTo={"/"}>
                                <Dashboard />
                            </RequireAuth>
                        }
                    ></Route>

                    <Route
                        path={"/gameroom"}
                        element={
                            <RequireAuth redirectTo={"/"}>
                                <GameRoom />
                            </RequireAuth>
                        }
                    ></Route>
                </Routes>
            </BrowserRouter>
        </UserAuthContext>
    );
}

export default App;
