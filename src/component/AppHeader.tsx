import * as React from 'react';
import '../asset/header.css';
import logo from '../asset/headerLogo.png';
import { setAuthToken } from '../util/AxiosHelper';
import defaultUserIcon from "../asset/profile.png";
import { useNavigate } from 'react-router-dom';

export const AppHeader: React.FC = () => {
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
        localStorage.setItem('userId', '');
        localStorage.setItem('imageUrl', '');
        navigate("/");
    }

    return (
        <div className="App-header" >
            <div className="headerLeft">
                <img src={logo} className="headerLogo" alt="logo" />
                <text className="headerText">San Ren Xing</text >
            </div>
            <div className="headerRight">
                {hasUser &&
                    <>
                        <button className="logoutBtn" onClick={() => logout()}>log out</button>
                        <img className="profileImg" src={image} alt="Loaded from server" />
                    </>
                }
            </div>
        </div>
    )
}