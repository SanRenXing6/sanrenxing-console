import * as React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import '../asset/App.css';
import { AppHeader } from '../component/AppHeader';
import LoginPage from './LoginPage';
import OverviewPage from './OverviewPage';
import i18n from '../asset/i18n';
import ProfileFormPage from './ProfileFormPage';
import { ModalProvider } from '../context/ModalContext';
import { ChatProvider } from '../context/ChatContext';
import ProfileDetailPage from './ProfileDetailPage';
import { DEFAULT_LANGUAGE } from '../constant';

const HomePage = () => {

  React.useEffect(() => {
    i18n.changeLanguage(DEFAULT_LANGUAGE);
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <ModalProvider>
          <ChatProvider>
            <AppHeader />
            <div className="App-body">
              <Routes>
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/overview" element={<OverviewPage />} />
                <Route path="/profile/form" element={<ProfileFormPage />} />
                <Route path="/profile/detail" element={<ProfileDetailPage />} />
              </Routes>
            </div>
          </ChatProvider>
        </ModalProvider>
      </BrowserRouter>
    </div>
  );
}

export default HomePage;
