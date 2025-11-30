import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

    useEffect(() => {
    const backendUrl = localStorage.getItem('backendUrl') || 'http://localhost:3000';
    const newSocket = io(backendUrl);

    newSocket.on("connect", () => {
        console.log("Connected to WebSocket server");
        setConnected(true);
    });

    newSocket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
        setConnected(false);
    });

    setSocket(newSocket);

    return () => newSocket.close();
    }, []);

    return (
    <SocketContext.Provider value={{ socket, connected }}>
        {children}
    </SocketContext.Provider>
    );
};
