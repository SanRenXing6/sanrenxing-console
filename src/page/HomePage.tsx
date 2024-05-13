import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import '../asset/App.css';
import { AppHeader } from '../component/AppHeader';
import LoginPage from './LoginPage';
import OverviewPage from './OverviewPage';
import AddProfilePage from './Profile/AddProfilePage';
import LoginContext from '../context/LoginContext';
import { useState } from 'react';

const HomePage = () => {
  const [userId, setUserId] = useState("");
  const [profileId, setProfileId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  return (
    <div className="App">
      <LoginContext.Provider value={{ userId, setUserId, profileId, setProfileId, imageUrl, setImageUrl }}>
        <BrowserRouter>
          <AppHeader />
          <div className="App-body">
            <Routes>
              <Route path="/" element={<Navigate replace to="/login"/>}/>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/profile" element={<AddProfilePage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </LoginContext.Provider>
    </div>
  );
}

export default HomePage;
