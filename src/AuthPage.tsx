import React from 'react';
import logo from './asset/logo.png';
import './asset/login.css';
import { request } from './AxiosHelper';
import { checkIfStringEmpty, validateEmail } from './util/StringHelper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastFailure, toastSuccesss } from './util/ToastHelper';

const AuthPage: React.FC = () => {

    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');
    const [name, setName] = React.useState('');
    const [nameError, setNameError] = React.useState('');
    const [isLogin, setIsLogin] = React.useState(true);
    const SUCCESS_REGISTER_MESSAGE = "Successfully registered user!";
    const SUCCESS_LOGIN_MESSAGE = "Successfully logged in!";

    const login = () => {
        const validated = checkFormValues();
        if (validated) {
            request("POST",
                "/auth/login",
                {
                    email: email,
                    password: password
                })
                .then(() => {
                    toastSuccesss(SUCCESS_LOGIN_MESSAGE)
                    // TODO: jump to main page
                }).catch((error) => {
                    const errorMessage = error.response.data;
                    toastFailure(errorMessage);
                });
        }

    }

    const signUp = () => {
        const validated = checkFormValues();
        if (validated) {
            request("POST",
                "/auth/register",
                {
                    name: name,
                    email: email,
                    password: password
                })
                .then(() => {
                    setIsLogin(true);
                    clearAllErrors();
                    toastSuccesss(SUCCESS_REGISTER_MESSAGE)
                }).catch((error) => {
                    const errorMessage = error.response.data;
                    toastFailure(errorMessage);
                });
        }
    }

    const checkFormValues = () => {
        var validated = true;
        if (checkIfStringEmpty(email)) {
            setEmailError("Email must not be null!");
            validated = false;
        } else if (!validateEmail(email)) {
            setEmailError("Email " + email + " is not valid!")
            validated = false;
        } else {
            setEmailError("");
        }
        if (checkIfStringEmpty(password)) {
            setPasswordError("Password must not be null!");
            validated = false;
        } else {
            setPasswordError("");
        }
        if (!isLogin && checkIfStringEmpty(name)) {
            setNameError("Name must not be null!");
            validated = false;
        } else {
            setNameError("");
        }
        return validated;
    }

    const clearAllStates = () => {
        setName('');
        setEmail('');
        setPassword('');
        clearAllErrors();
    }

    const clearAllErrors = () => {
        setNameError('');
        setEmailError('');
        setPasswordError('');
    }

    return (
        <div>
            <img src={logo} className="App-logo" alt="logo" />
            <ToastContainer />
            <div className="mainContainer">
                <br />
                <div className="titleContainer">
                    <p className="welcomeText">Welcome to SanRenXing!</p>
                </div>
                <br />
                {isLogin ? (
                    <div>
                        <div className="formItem">
                            <label className="inputLabel">Email:</label>
                            <input
                                className="inputBox"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <label className="errorLabel">{emailError}</label>
                        </div>
                        <div className="formItem">
                            <label className="inputLabel">Password:</label>
                            <input
                                className="inputBox"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <label className="errorLabel">{passwordError}</label>
                        </div>
                        <br />
                        <div className="buttonContainer">
                            <button className="login" onClick={() => login()}>Login</button>
                            <button className="signUp" onClick={() => {
                                setIsLogin(false);
                                clearAllStates();
                            }}>Sign up</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="formItem">
                            <label className="inputLabel">Name:</label>
                            <input
                                className="inputBox"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <label className="errorLabel">{nameError}</label>
                        </div>
                        <div className="formItem">
                            <label className="inputLabel">Email:</label>
                            <input
                                className="inputBox"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <label className="errorLabel">{emailError}</label>
                        </div>
                        <div className="formItem">
                            <label className="inputLabel">Password:</label>
                            <input
                                className="inputBox"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <label className="errorLabel">{passwordError}</label>
                        </div>
                        <br />
                        <div className="buttonContainer">
                            <button className={isLogin ? "signUp" : "login"} onClick={() => signUp()}>Sign up</button>
                        </div>
                    </div>
                )
                }

            </div>
        </div >
    );
}

export default AuthPage;
