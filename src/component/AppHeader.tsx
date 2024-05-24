import * as React from 'react';
import '../asset/header.css';
import logo from '../asset/headerLogo.png';
import { setAuthToken } from '../util/AxiosHelper';
import defaultUserIcon from "../asset/profile.png";
import { useLocation, useNavigate } from 'react-router-dom';
import LanguageSelect from './LanguageSelect';
import { useTranslation } from 'react-i18next';
import { IoMailUnreadOutline } from "react-icons/io5";
import { useModal } from '../context/ModalContext';
import { useMessage } from '../context/MessageContext';


export const AppHeader: React.FC = () => {
    const { t } = useTranslation();
    const imageUrl = localStorage.getItem('imageUrl');
    const userId = localStorage.getItem('userId');
    const hasImage = imageUrl && imageUrl?.length > 0;
    const hasUser = userId && userId?.length > 0;
    const image = hasImage ? imageUrl : defaultUserIcon;
    const navigate = useNavigate();
    const { openModal } = useModal();
    const { messages } = useMessage();
    const location = useLocation();
    const isOverviewPage = location.pathname === "/overview";

    React.useEffect(() => {
        if (!userId || userId?.length === 0) {
            navigate("/login")
        }
    }, [userId])

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
                {isOverviewPage && messages && messages?.length > 0 &&
                    <button type="button" className="icon-button" onClick={openModal}>
                        <IoMailUnreadOutline className="icon" />
                    </button>
                }
                {hasUser &&
                    <>
                        <button className="logoutBtn" onClick={() => logout()}>{t('buttons.logOut')}</button>
                        <img className="profileImg" src={image} alt="Loaded from server" />
                    </>
                }
            </div>
        </div>
    )
}