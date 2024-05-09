import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import '../asset/header.css';
import logo from '../asset/headerLogo.png';
import LoginContext from '../context/LoginContext';
import { setAuthToken } from '../util/AxiosHelper';

export const AppHeader: React.FC = () => {
    const { userId, setUserId } = React.useContext(LoginContext);

    const logout = () => {
        setUserId('');
        setAuthToken('');
    }

    return (
        <div className="App-header" >
            <div className="headerLeft">
                <img src={logo} className="headerLogo" alt="logo" />
                <text className="headerText">San Ren Xing</text >
            </div>
            {userId && userId?.length > 0 &&
                <div className="headerRight">
                    <button className="logoutBtn" onClick={() => logout()}>log out</button>
                </div>
            }
        </div>
    )
}