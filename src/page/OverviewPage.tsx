import * as React from "react";
import { useNavigate } from "react-router-dom";
import LoginContext from "../context/LoginContext";
import { request } from "../util/AxiosHelper";
import { FaSearch } from "react-icons/fa";
import "../asset/overview.css"

const OverviewPage: React.FC = () => {
    const { userId } = React.useContext(LoginContext);
    const [input, setInput] = React.useState("");
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
        <div className="search-bar-container">
            <div className="input-wrapper">
                <FaSearch id="search-icon" />
                <input
                    placeholder="Type to search..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>
        </div>
    );
}

export default OverviewPage;