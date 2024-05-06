import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../asset/App.css';
import AuthPage from './LoginPage';
import OverviewPage from './OverviewPage';
import AddProfilePage from './Profile/AddProfilePage';

function HomePage() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/profile" element={<AddProfilePage />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default HomePage;
