import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { SocketProvider  } from './SocketContext';
import ChildrenView from './pages/ChildrenView';
import ChildDashboard from './pages/ChildDashboard';
import ParentDashboard from './pages/ParentDashboard';
import './App.css';

function App() {
  return (
    <SocketProvider>
        <BrowserRouter>
        <div className="app">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/child" element={<ChildrenView />} />
                <Route path="/child/:id" element={<ChildDashboard />} />
                <Route path="/parent" element={<ParentDashboard />} />
            </Routes>
        </div>
        </BrowserRouter>
    </SocketProvider>
  );
}

function Home() {
    return (
        <div className="home">
            <h1>מערכת נקודות לילדים</h1>
            <div className="home-buttons">
                <Link to="/child" className="home-button child-button">
                    <span className="icon">🎮</span>
                    <span>ממשק ילדים</span>
                </Link>
                <Link to="/parent" className="home-button parent-button">
                    <span className="icon">👨‍👩‍👧‍👦</span>
                    <span>ממשק הורים</span>
                </Link>
            </div>
        </div>
    );
}

export default App;
