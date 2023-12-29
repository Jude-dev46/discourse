import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export const SocketProvider = ({ id, children }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io("http://192.168.0.2:8000", { query: { id } });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
