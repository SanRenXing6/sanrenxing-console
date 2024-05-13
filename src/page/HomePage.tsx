import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import '../asset/App.css';
import { AppHeader } from '../component/AppHeader';
import LoginPage from './LoginPage';
import OverviewPage from './OverviewPage';
import AddProfilePage from './Profile/AddProfilePage';
import { useState } from 'react';

const HomePage = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AppHeader />
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/profile" element={<AddProfilePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default HomePage;
