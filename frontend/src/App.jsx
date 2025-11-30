import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { SocketProvider  } from './SocketContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { useLanguage } from './contexts/LanguageContext';
import Toolbar from './components/Toolbar';
import ChildrenView from './pages/ChildrenView';
import ChildDashboard from './pages/ChildDashboard';
import ParentDashboard from './pages/ParentDashboard';
import './App.css';

function App() {
  return (
    <LanguageProvider>
        <SocketProvider>
        <BrowserRouter>
        <div className="app">
            <Toolbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/child" element={<ChildrenView />} />
                <Route path="/child/:id" element={<ChildDashboard />} />
                <Route path="/parent" element={<ParentDashboard />} />
            </Routes>
        </div>
        </BrowserRouter>
        </SocketProvider>
    </LanguageProvider>
  );
}

function Home() {
    const { t } = useLanguage();
    return (
        <div className="home">
            <h1>{t('app.title')}</h1>
            <div className="home-buttons">
                <Link to="/child" className="home-button child-button">
                    <span className="icon">🎮</span>
                    <span>{t('home.childButton')}</span>
                </Link>
                <Link to="/parent" className="home-button parent-button">
                    <span className="icon">👨‍👩‍👧‍👦</span>
                    <span>{t('home.parentButton')}</span>
                </Link>
            </div>
        </div>
    );
}

export default App;
