import * as React from "react";
import { useNavigate } from "react-router-dom";
import LoginContext from "../context/LoginContext";
import { request } from "../util/AxiosHelper";

const OverviewPage: React.FC = () => {
    const { userId } = React.useContext(LoginContext);
    const navigate = useNavigate();
    if (!userId || userId?.length === 0) {
        navigate("/");
    }
    React.useEffect(() => {
        request("GET",
            "/users",
            {}
        )
            .then(() => {
            }).catch((error) => {
                console.log(error)
            });

    }, [])
    return (
        <div className="titleContainer">
            <p className="welcomeText">Overview Page</p>
        </div>
    );
}

export default OverviewPage;