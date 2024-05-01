import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../asset/App.css';
import AuthPage from './AuthPage';
import OverviewPage from './OverviewPage';

function HomePage() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/overview" element={<OverviewPage />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default HomePage;
