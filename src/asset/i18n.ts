import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en: {
                translation: {
                    titles: {
                        pageTitle: 'Welcome to SanRenXing!',
                        sanRenXing: 'San Ren Xing',
                    },
                    labels: {
                        email: 'Email',
                        password: 'Password',
                        name: 'Name',
                        needs: 'Needs',
                        skills: 'Skills',
                        feedbacks: 'Feedbacks',
                        rate: 'Rate',
                    },
                    buttons: {
                        login: 'Log in',
                        signUp: 'Sign up',
                        back: 'Back',
                        logOut: 'Log out',
                        save: 'Save',
                        skip: 'Skip',
                    },
                    messages: {
                        typeToSearch: 'Type to search...',
                        description: 'Description',
                        loading: 'Loading',
                        required: 'Required!',
                        successSignUp: 'Successfully signed up!',
                        selfIntroduction: 'Self introduction',
                        describeNeeds: 'Describe what do you need'
                    },
                    errors: {
                        mustInputValue: 'Required value!',
                        emailNotValid: 'Email is not valid!'
                    }
                }
            },
            zh: {
                translation: {
                    titles: {
                        pageTitle: '欢迎来到三人行！',
                        sanRenXing: '三人行',
                    },
                    labels: {
                        email: '邮箱',
                        password: '密码',
                        name: '名字',
                        needs: '需求',
                        skills: '技能',
                        feedbacks: '反馈',
                        rate: '评级',
                    },
                    buttons: {
                        login: '登陆',
                        signUp: '注册',
                        back: '返回',
                        logOut: '退出登陆',
                        save: '保存',
                        skip: '跳过',
                    },
                    messages: {
                        typeToSearch: '输入搜索',
                        description: '个人简介',
                        loading: '加载中',
                        required: '请输入值！',
                        successSignUp: '注册完成！',
                        selfIntroduction: '请简单介绍一下你自己',
                        describeNeeds: '请描述你的需求'
                    },
                    errors: {
                        mustInputValue: '请输入值!',
                        emailNotValid: '邮箱不合法!'
                    }
                }
            }
        }
    });

export default i18n;