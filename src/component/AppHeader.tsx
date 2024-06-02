import * as React from 'react';
import '../asset/header.css';
import logo from '../asset/headerLogo.png';
import { request, setAuthToken } from '../util/AxiosHelper';
import defaultUserIcon from "../asset/profile.png";
import { useLocation, useNavigate } from 'react-router-dom';
import LanguageSelect from './LanguageSelect';
import { useTranslation } from 'react-i18next';
import { IoMailUnreadOutline } from "react-icons/io5";
import { useModal } from '../context/ModalContext';
import { dealWithResponseError } from '../util/ErrorHelper';
import { retriveImage } from '../util/ImageHelper';


export const AppHeader: React.FC = () => {
    const { t } = useTranslation();
    const userId = localStorage.getItem('userId');
    const imageId = localStorage.getItem('imageId');
    const hasImage = imageId && imageId?.length > 0;
    const hasUser = userId && userId?.length > 0;
    const navigate = useNavigate();
    const { openTextModal } = useModal();
    const location = useLocation();
    const isOverviewPage = location.pathname === "/overview";
    const [messages, setMessages] = React.useState<any[]>([]);
    const [image, setImage] = React.useState<string>();

    React.useEffect(() => {
        if (!userId || userId?.length === 0) {
            navigate("/login")
        } else {
            request(
                "GET",
                `/messages/${userId}`,
                {}
            ).then((response) => {
                setMessages(response?.data);
            }).catch((error) => {
                dealWithResponseError(error);
            });
            if (hasImage) {
                const fetchImageData = async () => {
                    try {
                        const image = await retriveImage(imageId);
                        setImage(image);
                    } catch (error) {
                        console.error('Error fetching image data:', error);
                    }
                };
                fetchImageData();
            }
        }

    }, [userId, imageId])

    const logout = () => {
        setAuthToken('');
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div className="App-header" >
            <div className="headerLeft">
                <img src={logo} className="headerLogo" alt="logo" />
                <h4 className="headerText">{t('titles.sanRenXing')}</h4 >
            </div>
            <div className="headerRight">
                <LanguageSelect />
                {isOverviewPage && messages && Object.keys(messages)?.length > 0 &&
                    <button type="button" className="icon-button" onClick={openTextModal}>
                        <IoMailUnreadOutline className="icon" />
                    </button>
                }
                {hasUser &&
                    <>
                        <button
                            className="logoutBtn"
                            onClick={() => logout()}>{t('buttons.logOut')}</button>
                        <img
                            className="profileImg"
                            src={hasImage ? image : defaultUserIcon}
                            alt="Loaded from server" />
                    </>
                }
            </div>
        </div>
    )
}