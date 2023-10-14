import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const myContext = createContext();
function ChatProvider({ children }) {
  const [selectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  //console.log("chatContext", selectedChat);

  useEffect(() => {
    const getAllNotifications = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      //console.log(user._id);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/notification",
          config
        );

        setNotifications([data]);

        //console.log("chats all noti", data);
        //console.log("notifications", notifications);
      } catch (error) {
        toast.error("error in chats getAllNotifications", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // console.log("error in chats getAllNotifications", error);
      }
    };

    getAllNotifications();
    //eslint-disable-next-line
  }, [selectedChat]);

  return (
    <>
      <myContext.Provider
        value={{
          selectedChat: selectedChat,
          setSelectedChat: setSelectedChat,
          chats,
          setChats,
          messages,
          setMessages,
          notifications,
          setNotifications,
        }}
      >
        {children}
      </myContext.Provider>
      <ToastContainer />
    </>
  );
}

export function useCustom() {
  return useContext(myContext);
}

export default ChatProvider;
