import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import Toolbar from './components/Toolbar';
import ChildrenView from './pages/childrenView/ChildrenView';
import ChildDashboard from './pages/childDashboard/ChildDashboard';
import ParentDashboard from './pages/parentDashboard/ParentDashboard';

function AppContent() {
    const { t } = useLanguage();

    useEffect(() => {
        document.title = t('appTitle');
    }, [t]);

    return (
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <div className="app">
                <Toolbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/child" replace />} />
                    <Route path="/child" element={<ChildrenView />} />
                    <Route path="/child/:id" element={<ChildDashboard />} />
                    <Route path="/parent" element={<ParentDashboard />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default AppContent;
