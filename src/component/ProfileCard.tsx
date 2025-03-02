import * as React from "react";
import { useTranslation } from "react-i18next";
import "../asset/profile.css";
import userProfileImg from "../asset/profile.png";
import { retriveImage } from "../util/ImageHelper";
import { FaStar } from "react-icons/fa";
import { getRandomInt } from "../util/NumberHelper";
import { refreshToken } from "../util/AuthHelper";
import { useNavigate } from "react-router-dom";
import WebRTC from "./WebRTC";

interface Props {
    data: any
}

const ProfileCard: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();
    const [userName, setUserName] = React.useState(data?.userName);
    const navigate = useNavigate();
    const [userRate, setUserRate] = React.useState(1);
    const [imageUrl, setImageUrl] = React.useState<string>();

    const getStars = (num: number) => {
        const components = [];
        for (let i = 0; i < num; i++) {
            components.push(<FaStar key={i} />);
        }
        return <div>{components}</div>;
    }

    React.useEffect(() => {
        if (data?.imageId) {
            const fetchImageData = async () => {
                try {
                    const image = await retriveImage(data?.imageId);
                    setImageUrl(image);
                } catch (error) {
                    console.error('Error fetching image data:', error);
                }
            };
            fetchImageData();
        }

        // TODO: use real user rate instead of random number
        setUserRate(getRandomInt(1, 5));

    }, [data?.userId, data?.imageId, refreshToken])

    return (
        <div className="profile-card">
            <div className="profile-left">
                <img className="profile-img" 
                    src={imageUrl || userProfileImg}
                    onClick={() => navigate("/profile/detail",
                        { state: { imgUrl: imageUrl || userProfileImg, data: data } })}>
                    </img>
                <WebRTC
                    userId={data?.userId}
                    userName={userName}
                    userImageUrl={imageUrl || userProfileImg}
                />
                <div className="profile-rate">
                    {getStars(userRate)}
                </div>
            </div>
            <div className="profile-right">
                <div className="profile-name">{data?.userName}</div>
                <br />
                <div className="profile-description">{data?.description}</div>
                <div className="profile-card-label">{t('labels.skills')}</div>
                {
                    data?.skills?.map((skill: any, id: any) => {
                        {
                            return skill?.name && skill.name.length > 0 ?
                                <div className="profile-skill-name" key={id}>• {skill.name}</div>
                                : <></>
                        }

                    })
                }
            </div>
        </div>
    );
}

export default ProfileCard;