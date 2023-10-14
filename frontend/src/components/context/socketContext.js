import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
//import { useCustom } from "./chatContext.js";
//import { useCustom } from "./chatContext.js";
//import { useCustom } from "../context/chatContext.js";

// Create a context for the socket
const SocketContext = createContext();

// Custom hook to access the socket context
export function useSocket() {
  return useContext(SocketContext);
}

// Provide the socket context at the top-level of your component tree
export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [selectedChatCompare, setSelectedChatCompare] = useState();
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  // const [sent, setSent] = useState(false);
  const [room, setRoom] = useState("");
  // const { setNotifications } = useCustom();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    // Create and configure the socket connection
    const newSocket = io("http://localhost:3001");

    newSocket.emit("setup", user);
    newSocket.on("connected", () => setSocketConnected(true));

    // Initialize socket listeners and emit events as needed here
    //console.log(selectedChat);
    // newSocket.emit("setup", selectedChat);
    //newSocket.on("connected", () => setSocketConnected(true));

    // Set the socket in the state
    setSocket(newSocket);

    // Clean up the socket when the component unmounts
    return () => {
      newSocket.disconnect();
    };
    /* eslint-disable */
  }, []);

  //console.log("socketContext");
  return (
    <SocketContext.Provider
      value={{
        socket,
        setSocketConnected,
        socketConnected,
        selectedChatCompare,
        setSelectedChatCompare,
        typing,
        setTyping,
        istyping,
        setIsTyping,
        room,
        setRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
