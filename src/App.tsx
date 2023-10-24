import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import GameRoom from "./Game/GameRoom";
import { UserAuthContext } from "./Auth/UserAuthContext";
import LandingPage from "./Landing/LandingPage";
import RequireAuth from "./Auth/RequireAuth";
import "./App.css";
import NavBar from "./NavBar";

function App() {
    return (
        <UserAuthContext>
            <BrowserRouter>
                <NavBar />
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
