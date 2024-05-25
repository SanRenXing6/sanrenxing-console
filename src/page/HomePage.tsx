import * as React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import '../asset/App.css';
import { AppHeader } from '../component/AppHeader';
import LoginPage from './LoginPage';
import OverviewPage from './OverviewPage';
import i18n from '../asset/i18n';
import ProfileFormPage from './ProfileFormPage';
import { ModalProvider } from '../context/ModalContext';

const HomePage = () => {

  React.useEffect(() => {
    const language = navigator.language;
    i18n.changeLanguage(language);
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <ModalProvider>
          <AppHeader />
          <div className="App-body">
            <Routes>
              <Route path="/" element={<Navigate replace to="/overview" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/profile" element={<ProfileFormPage />} />
            </Routes>
          </div>
        </ModalProvider>
      </BrowserRouter>
    </div>
  );
}

export default HomePage;
