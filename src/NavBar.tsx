import { useNavigate } from "react-router-dom";

export default function NavBar() {
    const navigate = useNavigate();

    const navigateTo = (destination: string) => {
        navigate("/" + destination);
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                }}
            >
                <p onClick={() => navigateTo("")}>landing</p>
                <p onClick={() => navigateTo("dashboard")}>dashboard</p>
            </div>
            <hr />
        </>
    );
}
