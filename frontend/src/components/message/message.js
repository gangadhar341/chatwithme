import axios from "axios";
import "./message.css";
import { useEffect, useRef } from "react";
import { useCustom } from "../context/chatContext.js";
import { useSocket } from "../context/socketContext.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Message() {
  const loggedUser = JSON.parse(localStorage.getItem("userInfo"));
  // console.log("up loggedUser", loggedUser);
  const { selectedChat, setMessages, messages, setNotifications } = useCustom();
  const { socket } = useSocket();
  const scroll = useRef();

  useEffect(() => {
    const allMessages = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${loggedUser.token}`,
          },
        };

        const res = await axios.get(
          `http://localhost:3001/api/message/${selectedChat._id}`,
          config
        );

        setMessages(() => res.data);
        //console.log(selectedChat._id);
        socket.emit("join chat", selectedChat._id);
      } catch (error) {
        toast.error("error in chats getAllMessages", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };
    if (selectedChat) {
      allMessages();
      //setSelectedChatCompare = selectedChat;
    }
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    const deleteNotifications = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };

      await axios.delete(
        `http://localhost:3001/api/notification/${selectedChat._id}`,

        config
      );

      //console.log("deletenoti in msg");
    };

    deleteNotifications();
    //eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    const getAllNotifications = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
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
        //console.log("getAllNoti in msg");

        setNotifications(() => [data]);

        //console.log("chats all noti", data);
        // console.log("notifications", notifications);
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
        //console.log("error in chats getAllNotifications", error);
      }
    };

    getAllNotifications();
    //eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    //console.log("hii");
    const newMsg = (newMessageRecieved) => {
      //console.log(newMessageRecieved.chat._id === selectedChat._id);

      if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
        //console.log("if executed");
        //setMessages([...messages, newMessageRecieved]);

        const createNotifiction = async (newMessageRecieved) => {
          //console.log("creating", newMessageRecieved);
          //console.log("creating", loggedUser);
          const config = {
            headers: {
              Authorization: `Bearer ${loggedUser.token}`,
            },
          };
          try {
            const { data } = await axios.post(
              "http://localhost:3001/api/notification",
              {
                chatId: newMessageRecieved.chat._id,
                newMessage: newMessageRecieved.content,
                sender: newMessageRecieved.sender._id,
              },
              config
            );

            socket.emit("newNotification", data);

            setNotifications((prevNotifications) => {
              //console.log(prevNotifications);
              //const updatedNotifications = [data];
              //console.log("Updated notifications:", updatedNotifications);
              //return updatedNotifications; */
              //console.log(prevNotifications);
              if (prevNotifications.length > 0) {
                const notificationIndex =
                  prevNotifications[0].fullNotification.findIndex(
                    (notification) =>
                      notification._id === data.fullNotification[0]._id
                  );

                // If the notification is found, update it
                if (notificationIndex !== -1) {
                  prevNotifications[0].fullNotification[notificationIndex] =
                    data;

                  //console.log(prevNotifications);
                  return prevNotifications;
                } else {
                  const firstNotifications = [data];
                  return firstNotifications;
                }
              } else {
                const firstNotifications = [data];
                return firstNotifications;
              }
            });

            //console.log(data);
          } catch (error) {
            toast.error("error in creating notification, server error", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            //console.log(error);
          }
        };
        //console.log("jii");
        createNotifiction(newMessageRecieved);
      } else {
        setMessages([...messages, newMessageRecieved]);
        return;
      }
    };
    //console.log("notifications", notifications);

    socket.on("message recieved", newMsg);

    return () => {
      // console.log("message off");
      socket.off("message recieved", newMsg);
    };
  });

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {messages ? (
        messages.map((c) => {
          return (
            <div
              ref={scroll}
              className={loggedUser._id !== c.sender._id ? "message" : "owner"}
              key={c._id}
            >
              <div className='messageContainer'>
                <p>{c.content}</p>

                <span>
                  {new Intl.DateTimeFormat("en-US", {
                    timeZone: "Asia/Kolkata",
                    hour12: true,
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(c.updatedAt))}
                </span>
                {/*   {sent ? <img src='read.png' alt='' /> : <></>} */}
              </div>
            </div>
          );
        })
      ) : (
        <div>Start Chat</div>
      )}
      {/* {selectedChat._id === room ? (
        istyping ? (
          <div className='type'>typing...</div>
        ) : (
          <></>
        )
      ) : (
        <></>
      )} */}

      <ToastContainer />
    </>
  );
}
export default Message;
