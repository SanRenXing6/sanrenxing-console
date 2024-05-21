import React from 'react';
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
import { retriveImage } from '../util/ImageHelper';
import LoadingPage from './LoadingPage';
import { useTranslation } from 'react-i18next';


const LoginPage: React.FC = () => {

    const { t } = useTranslation();

    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const [passwordError, setPasswordError] = React.useState('');
    const [name, setName] = React.useState('');
    const [nameError, setNameError] = React.useState('');
    const [isLogin, setIsLogin] = React.useState(true);
    const SUCCESS_REGISTER_MESSAGE = t('messages.successSignUp');

    // TODO: learn how to deal with global values when navigate back and forth
    React.useEffect(() => {
        localStorage.setItem('userId', '');
        localStorage.setItem('profileId', '');
        localStorage.setItem('imageUrl', '');
        setAuthToken('');
        // eslint-disable-next-line
    }, [])

    const navigate = useNavigate();

    const login = async () => {
        const validated = checkFormValues();
        if (validated) {
            setIsLoading(true);
            await request("POST",
                "/auth/login",
                {
                    email: email,
                    password: password
                },
                {}
            )
                .then(async (response) => {
                    const data = response?.data;
                    setAuthToken(data?.token);
                    const imageUrl = await retriveImage(data?.imageId);
                    localStorage.setItem('userId', data?.userId);
                    localStorage.setItem('imageUrl', imageUrl);
                    setIsLoading(false);
                    if (data?.profileId && data?.profileId.length > 0) {
                        navigate('/overview');
                    } else {
                        navigate('/profile', { state: { userId: data?.userId, email: email } });
                    }
                }).catch((error) => {
                    setIsLoading(false);
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
            setEmailError(t('errors.mustInputValue'));
            validated = false;
        } else if (!validateEmail(email)) {
            setEmailError(t('errors.emailNotValid'))
            validated = false;
        } else {
            setEmailError("");
        }
        if (checkIfStringEmpty(password)) {
            setPasswordError(t('errors.mustInputValue'));
            validated = false;
        } else {
            setPasswordError("");
        }
        if (!isLogin && checkIfStringEmpty(name)) {
            setNameError(t('errors.mustInputValue'));
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

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            if (isLogin) {
                login()
            } else {
                signUp()
            }
        }
    }

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <div className="mainContainer">
            <img src={logo} className="appLogo" alt="logo" />
            <ToastContainer />
            <br />
            <div className="titleContainer">
                <p className="welcomeText">{t('titles.pageTitle')}</p>
            </div>
            <br />
            {isLogin ? (
                <div>
                    <div className="formItem">
                        <label className="inputLabel">{t('labels.email')}:</label>
                        <div className="inputContainer">
                            <input
                                className="inputBox"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={e => handleKeyDown(e)}
                            />
                        </div>
                        <label className="errorLabel">{emailError}</label>
                    </div>
                    <div className="formItem">
                        <label className="inputLabel">{t('labels.password')}:</label>
                        <div className="inputContainer">
                            <input
                                className="inputBoxWithButton"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => handleKeyDown(e)}
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
                        <button className="login" onClick={() => login()}>{t('buttons.login')}</button>
                        <button className="signUp" onClick={() => {
                            setIsLogin(false);
                            clearAllStates();
                        }}>{t('buttons.signUp')}</button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="formItem">
                        <label className="inputLabel">{t('labels.name')}:</label>
                        <div className="inputContainer">
                            <input
                                className="inputBox"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onKeyDown={e => handleKeyDown(e)}
                            />
                        </div>
                        <label className="errorLabel">{nameError}</label>
                    </div>
                    <div className="formItem">
                        <label className="inputLabel">{t('labels.email')}:</label>
                        <div className="inputContainer">
                            <input
                                className="inputBox"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={e => handleKeyDown(e)}
                            />
                        </div>
                        <label className="errorLabel">{emailError}</label>
                    </div>
                    <div className="formItem">
                        <label className="inputLabel">{t('labels.password')}:</label>
                        <div className="inputContainer">
                            <input
                                className="inputBoxWithButton"
                                type={showPassword ? "text" : "password"}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => handleKeyDown(e)}
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
                        <button className={isLogin ? "signUp" : "login"} onClick={() => signUp()}>
                            {t('buttons.signUp')}
                        </button>
                        <button className="back" onClick={() => {
                            setIsLogin(true);
                            clearAllStates();
                        }}>{t('buttons.back')}</button>
                    </div>
                </div>
            )
            }
        </div >
    );
}

export default LoginPage;
