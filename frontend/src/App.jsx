import { SocketProvider } from './SocketContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AppContent from './AppContent';
import './App.css';

function App() {
    return (
        <LanguageProvider>
            <NotificationProvider>
                <SocketProvider>
                    <AppContent />
                </SocketProvider>
            </NotificationProvider>
        </LanguageProvider>
    );
}

export default App;
