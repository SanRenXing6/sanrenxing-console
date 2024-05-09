import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../asset/App.css';
import { AppHeader } from '../component/AppHeader';
import AuthPage from './LoginPage';
import OverviewPage from './OverviewPage';
import AddProfilePage from './Profile/AddProfilePage';
import LoginContext from '../context/LoginContext';
import { useState } from 'react';

const HomePage = () => {
  const [userId, setUserId] = useState("");
  return (
    <div className="App">
      <LoginContext.Provider value={{ userId, setUserId }}>
        <AppHeader />
        <div className="App-body">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthPage />} />
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
