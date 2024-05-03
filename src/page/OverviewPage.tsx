import * as React from "react";
import { getAuthToken, request } from "../util/AxiosHelper";

const OverviewPage: React.FC = () => {
    React.useEffect(() => {
        request("GET",
            "/users",
            {},
            { "Authorization": `Bearer ${getAuthToken()}` }
        )
            .then((response) => {
                console.log(response?.data)
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