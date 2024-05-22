import * as React from 'react';
import '../asset/header.css';
import logo from '../asset/headerLogo.png';
import { setAuthToken } from '../util/AxiosHelper';
import defaultUserIcon from "../asset/profile.png";
import { useNavigate } from 'react-router-dom';
import LanguageSelect from './LanguageSelect';
import { useTranslation } from 'react-i18next';
import { IoMailOutline } from "react-icons/io5";
import { IoMailUnreadOutline } from "react-icons/io5";


export const AppHeader: React.FC = () => {
    const { t } = useTranslation();
    const imageUrl = localStorage.getItem('imageUrl');
    const userId = localStorage.getItem('userId');
    const hasImage = imageUrl && imageUrl?.length > 0;
    const hasUser = userId && userId?.length > 0;
    const image = hasImage ? imageUrl : defaultUserIcon;
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!userId || userId?.length === 0) {
            navigate("/")
        }
    }, [userId])

    const logout = () => {
        setAuthToken('');
        localStorage.clear();
        navigate("/");
    }

    return (
        <div className="App-header" >
            <div className="headerLeft">
                <img src={logo} className="headerLogo" alt="logo" />
                <text className="headerText">{t('titles.sanRenXing')}</text >
            </div>
            <div className="headerRight">
                <LanguageSelect />
                <button type="button" className="icon-button" >
                    <IoMailOutline className="icon" />
                </button>
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