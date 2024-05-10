import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
        <AppHeader />
        <div className="App-body">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/profile" element={<AddProfilePage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </LoginContext.Provider>
    </div>
  );
}

export default HomePage;
