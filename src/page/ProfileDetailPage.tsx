import * as React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import "../asset/profile.css";


const ProfileDetailPage: React.FC = () => {

    const { t } = useTranslation();
    const location = useLocation();
    const imgUrl = location?.state?.imgUrl;
    const data = location?.state?.data;

    return (
        <div className="profile-detail-page">
            <div className="profile-detail-top">
                <img className="profile-detail-top-img" src={imgUrl}></img>
                <div className="profile-detail-top-metadata">
                    <div className="profile-detail-name">{data?.userName}</div>
                    <br />
                    <div className="profile-datail-description">{data?.description}</div>
                    <br />
                </div>
            </div>
            <div className="profile-detail-bottom">
                <div className="profile-detail-label">{t('labels.skills')}</div>
                {
                    data?.skills?.map((skill: any, id: any) => {
                        {
                            return skill?.name && skill.name.length > 0 ?
                                <div className="profile-detail-skill-list" key={id}>• {skill.name}: {skill.rate}</div>
                                : <></>
                        }

                    })
                }
                <br />
                <div className="profile-detail-label">{t('labels.needs')}</div>
                <div className="profile-detail-need">{data?.needs}</div>
                <br />
                <div className="profile-detail-label">{t('labels.feedbacks')}</div>
            </div>
        </div>
    );
}

export default ProfileDetailPage;