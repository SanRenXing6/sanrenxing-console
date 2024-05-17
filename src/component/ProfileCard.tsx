import * as React from "react";
import "../asset/profile.css";
import userProfileImg from "../asset/profile.png";
import { request } from "../util/AxiosHelper";

interface Props {
    data: any
}

const ProfileCard: React.FC<Props> = ({ data }) => {
    const [userName, setUserName] = React.useState("");
    console.log(data);
    React.useEffect(() => {
        request(
            "GET",
            `/users/${data?.userId}`,
            {}
        ).then((response) => {
            setUserName(response?.data?.name || "user")
        })
    }, [data?.userId])
    return (
        <div className="profile-card">
            <div className="profile-picture">
                <img src={userProfileImg}></img>
            </div>
            <div className="profile-info">
                <div className="profile-name">{userName}</div>
                <div className="profile-description">{data?.description}</div>
            </div>
        </div>
    );
}

export default ProfileCard;