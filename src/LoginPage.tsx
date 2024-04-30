import React from 'react';
import logo from './asset/logo.png';
import './asset/login.css';

const LoginPage: React.FC = () => {

    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');

    const login = () => {
        console.log(userName)
        fetch('http://localhost:8080/login', {
            method: 'POST',
            body: JSON.stringify({
                username: userName,
                password: password
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch(error => {
                console.log("error")
            })
    }

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
                    <label className="inputLabel">
                        UserName:
                        <input
                            className="inputBox"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                        />
                    </label>
                    <label className="errorLabel">{ }</label>
                </div>
                <br />
                <div className="inputContainer">
                    <label className="inputLabel">
                        Password:
                        <input
                            className="inputBox"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </label>
                    <label className="errorLabel">{ }</label>
                </div>
                <br />
                <br />
                <div className="buttonContainer">
                    <button className="login" onClick={() => login()}>Login</button>
                    <button className="signUp">Sign up</button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
