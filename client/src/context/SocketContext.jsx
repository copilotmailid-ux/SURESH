import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to port 5000 using current hostname so mobile works over LAN
    const serverUrl =
      window.location.port === '3000'
        ? `http://${window.location.hostname}:5000`
        : window.location.origin;

    const socketInstance = io(serverUrl, {
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('[WebSocket] Connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[WebSocket] Disconnected');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
