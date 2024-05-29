import * as React from "react";
import { useTranslation } from "react-i18next";
import "../asset/profile.css";
import userProfileImg from "../asset/profile.png";
import { request } from "../util/AxiosHelper";
import { retriveImage } from "../util/ImageHelper";
import { FaStar } from "react-icons/fa";
import { getRandomInt } from "../util/NumberHelper";
import WebRTC from "./WebRTC";
import { refreshToken } from "../util/AuthHelper";
import { dealWithResponseError } from "../util/ErrorHelper";

interface Props {
    data: any
}

const ProfileCard: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();
    const [userName, setUserName] = React.useState(data?.userName);
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
        // TODO: clean up line 33-43 after deleting old profile data without user name
        if (!(data?.userName)) {
            request(
                "GET",
                `/users/${data?.userId}`,
                {}
            ).then((response) => {
                setUserName(response?.data?.name || "user")
            }).catch(error => {
                dealWithResponseError(error);
            });
        }

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
                <img className="profile-img" src={imageUrl || userProfileImg}></img>
                <WebRTC
                    userId={data?.userId}
                    userName={userName}
                />
                <div className="profile-rate">
                    {getStars(userRate)}
                </div>
            </div>
            <div className="profile-right">
                <div className="profile-name">{userName}</div>
                <div className="profile-description">{data?.description}</div>
                <div className="profile-card-label">{t('labels.needs')}</div>
                <div className="profile-needs">{data?.needs}</div>
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