import React, { useContext } from 'react';
import logo from '../asset/logo.png';
import '../asset/login.css';
import { request, setAuthToken } from '../util/AxiosHelper';
import { checkIfStringEmpty, validateEmail } from '../util/StringHelper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { toastFailure, toastSuccesss } from '../util/ToastHelper';
import { useNavigate } from 'react-router-dom';
import LoginContext from '../context/LoginContext';

const AuthPage: React.FC = () => {

    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const { setUserId } = useContext(LoginContext);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const [passwordError, setPasswordError] = React.useState('');
    const [name, setName] = React.useState('');
    const [nameError, setNameError] = React.useState('');
    const [isLogin, setIsLogin] = React.useState(true);
    const SUCCESS_REGISTER_MESSAGE = "Successfully signed up!";

    const navigate = useNavigate();

    const login = () => {
        const validated = checkFormValues();
        if (validated) {
            request("POST",
                "/auth/login",
                {
                    email: email,
                    password: password
                },
                {}
            )
                .then((response) => {
                    const data = response?.data;
                    setAuthToken(data?.token);
                    setUserId(data?.userId);
                    if (data?.hasProfile) {
                        navigate('/overview');
                    } else {
                        navigate('/profile', { state: { userId: data?.userId } });
                    }
                }).catch((error) => {
                    const errorMessage = error?.response?.data;
                    toastFailure(errorMessage);
                });
        }

    }

    const signUp = () => {
        const validated = checkFormValues();
        if (validated) {
            request(
                "POST",
                "/auth/register",
                {
                    name: name,
                    email: email,
                    password: password
                },
                {}
            )
                .then(() => {
                    setIsLogin(true);
                    clearAllErrors();
                    toastSuccesss(SUCCESS_REGISTER_MESSAGE)
                }).catch((error) => {
                    const errorMessage = error?.response?.data;
                    toastFailure(errorMessage);
                });
        }
    }

    const checkFormValues = () => {
        var validated = true;
        if (checkIfStringEmpty(email)) {
            setEmailError("Email must not be empty!");
            validated = false;
        } else if (!validateEmail(email)) {
            setEmailError("Email " + email + " is not valid!")
            validated = false;
        } else {
            setEmailError("");
        }
        if (checkIfStringEmpty(password)) {
            setPasswordError("Password must not be empty!");
            validated = false;
        } else {
            setPasswordError("");
        }
        if (!isLogin && checkIfStringEmpty(name)) {
            setNameError("Name must not be empty!");
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
        <div className="mainContainer">
            <img src={logo} className="appLogo" alt="logo" />
            <ToastContainer />
            <br />
            <div className="titleContainer">
                <p className="welcomeText">Welcome to SanRenXing!</p>
            </div>
            <br />
            {isLogin ? (
                <div>
                    <div className="formItem">
                        <label className="inputLabel">Email:</label>
                        <div className="inputContainer">
                            <input
                                className="inputBox"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <label className="errorLabel">{emailError}</label>
                    </div>
                    <div className="formItem">
                        <label className="inputLabel">Password:</label>
                        <div className="inputContainer">
                            <input
                                className="inputBoxWithButton"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button type="button" className="iconButton" onClick={toggleShowPassword}>
                                {showPassword ?
                                    <FaEyeSlash /> :
                                    <FaEye />}
                            </button>
                        </div>
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
                        <div className="inputContainer">
                            <input
                                className="inputBox"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <label className="errorLabel">{nameError}</label>
                    </div>
                    <div className="formItem">
                        <label className="inputLabel">Email:</label>
                        <div className="inputContainer">
                            <input
                                className="inputBox"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <label className="errorLabel">{emailError}</label>
                    </div>
                    <div className="formItem">
                        <label className="inputLabel">Password:</label>
                        <div className="inputContainer">
                            <input
                                className="inputBoxWithButton"
                                type={showPassword ? "text" : "password"}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button
                                className="iconButton"
                                onClick={toggleShowPassword}>
                                {showPassword ?
                                    <FaEyeSlash /> :
                                    <FaEye />}
                            </button>
                        </div>
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
    );
}

export default AuthPage;
