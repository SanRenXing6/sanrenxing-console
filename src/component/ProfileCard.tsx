import * as React from "react";
import "../asset/profile.css";
import userProfileImg from "../asset/profile.png";
import { request } from "../util/AxiosHelper";
import { retriveImage } from "../util/ImageHelper";

interface Props {
    data: any
}

const ProfileCard: React.FC<Props> = ({ data }) => {
    const [userName, setUserName] = React.useState("");
    const [imageUrl, setImageUrl] = React.useState<string>();
    React.useEffect(() => {
        request(
            "GET",
            `/users/${data?.userId}`,
            {}
        ).then((response) => {
            setUserName(response?.data?.name || "user")
        });
        const fetchImageData = async () => {
            try {
                const image = await retriveImage(data?.imageId);
                setImageUrl(image);
            } catch (error) {
                console.error('Error fetching image data:', error);
            }
        };
        fetchImageData();

    }, [data?.userId, data?.imageId])
    return (
        <div className="profile-card">
            <div className="profile-picture">
                <img src={imageUrl || userProfileImg}></img>
            </div>
            <div className="profile-info">
                <div className="profile-name">{userName}</div>
                <div className="profile-description">{data?.description}</div>
                <div className="profile-skill-label">Skills</div>
                {

                    data?.skills?.map((skill: any) => {
                        return <div className="profile-skill-name">{skill.name}</div>
                    })
                }
            </div>
        </div>
    );
}

export default ProfileCard;