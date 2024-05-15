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
            // TODO: refactor to labels, buttons etc to be more organized
            en: {
                translation: {
                    pageTitle: 'Welcome to SanRenXing!',
                    sanRenXing: 'San Ren Xing',
                    email: 'Email',
                    password: 'Password',
                    name: 'Name',
                    login: 'Log in',
                    signUp: 'Sign up',
                    back: 'Back',
                    logOut: 'Log out',
                    typeToSearch: 'Type to search...',
                    description: 'Description',
                    needs: 'Needs',
                    skills: 'Skills',
                    rate: 'Rate',
                    save: 'Save',
                    skip: 'Skip',
                    loading: 'Loading',
                    required: 'Required!',
                    successSignUp: 'Successfully signed up!',
                    selfIntroduction: 'Self introduction',
                    describeNeeds: 'Describe what do you need'
                }
            },
            zh: {
                translation: {
                    pageTitle: '欢迎来到三人行！',
                    sanRenXing: '三人行',
                    email: '邮箱',
                    password: '密码',
                    name: '名字',
                    login: '登陆',
                    signUp: '注册',
                    back: '返回',
                    logOut: '退出登陆',
                    typeToSearch: '输入搜索',
                    description: '个人简介',
                    needs: '需求',
                    skills: '技能',
                    rate: '评级',
                    save: '保存',
                    skip: '跳过',
                    loading: '加载中',
                    required: '请输入值！',
                    successSignUp: '注册完成！',
                    selfIntroduction: '请简单介绍一下你自己',
                    describeNeeds: '请描述你的需求'
                }
            }
        }
    });

export default i18n;