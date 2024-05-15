import * as React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import '../asset/App.css';
import { AppHeader } from '../component/AppHeader';
import LoginPage from './LoginPage';
import OverviewPage from './OverviewPage';
import i18n from '../asset/i18n';
import ProfileFormPage from './ProfileFormPage';

const HomePage = () => {

  React.useEffect(() => {
    const language = navigator.language;
    i18n.changeLanguage(language);
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <AppHeader />
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/profile" element={<ProfileFormPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default HomePage;
