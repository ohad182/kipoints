import { createcontext, useContext, useState } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'info', duration = 3000) => {
        setNotification({ message, type, duration });
    };

    const hideNotification = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    duration={notification.duration}
                    onClose={hideNotification}
                />
            )}
        </NotificationContext.Provider>
    );
};