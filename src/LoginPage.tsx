import React from 'react';
import logo from './asset/logo.png';
import './asset/login.css';

const LoginPage: React.FC = () => {
    return (
        <div>
            <img src={logo} className="App-logo" alt="logo" />
            <div className="mainContainer">
                <br />
                <div className="titleContainer">
                    <p className="welcomeText">Welcome to SanRenXing!</p>
                </div>
                <br />
                <div className="inputContainer">
                    <input
                        placeholder="User Name"
                        className="inputBox"
                    />
                    <label className="errorLabel">{ }</label>
                </div>
                <br />
                <div className="inputContainer">
                    <input
                        placeholder="Password"
                        className="inputBox"
                    />
                    <label className="errorLabel">{ }</label>
                </div>
                <br />
                <br />
                <div className="buttonContainer">
                    <button className="login">Login</button>
                    <button className="signUp">Sign up</button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
