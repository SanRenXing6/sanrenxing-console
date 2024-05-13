import * as React from 'react';
import '../asset/header.css';
import logo from '../asset/headerLogo.png';
import LoginContext from '../context/LoginContext';
import { setAuthToken } from '../util/AxiosHelper';
import defaultUserIcon from "../asset/profile.png";
import { useLocation, useNavigate } from 'react-router-dom';

export const AppHeader: React.FC = () => {
    const { setUserId, imageUrl, setImageUrl } = React.useContext(LoginContext);
    const location = useLocation();
    const image = imageUrl || defaultUserIcon;
    const navigate = useNavigate();
    const showProfile = location?.pathname !== "/login";

    const logout = () => {
        navigate("/");
        setUserId('');
        setImageUrl('');
        setAuthToken('');
    }

    return (
        <div className="App-header" >
            <div className="headerLeft">
                <img src={logo} className="headerLogo" alt="logo" />
                <text className="headerText">San Ren Xing</text >
            </div>
            <div className="headerRight">
                {showProfile &&
                    <>
                        <button className="logoutBtn" onClick={() => logout()}>log out</button>
                        <img className="profileImg" src={image} alt="Loaded from server" />
                    </>
                }
            </div>
        </div>
    )
}