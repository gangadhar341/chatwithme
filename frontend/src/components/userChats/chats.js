import React, { useCallback, useEffect, useState } from "react";
import { useCustom } from "../context/chatContext.js";
import "./chats.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSocket } from "../context/socketContext.js";

function Chats() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [isLoading, setLoading] = useState(false);
  const { setSelectedChat, chats, setChats, notifications, setNotifications } =
    useCustom();
  const { socket, istyping, room } = useSocket();

  //console.log(messages[messages.length - 1].content);
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const res = await axios.get("http://localhost:3001/api/chat", config);
        setChats(() => res.data);
        setLoading(false);
      } catch (error) {
        toast.error("server error", {
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

    fetchChats();
    /* eslint-disable */
  }, [setChats]);

  const updateNoti = useCallback((newNoti) => {
    // console.log("updating", newNoti);
    // console.log("noti in chats", notifications);
    //setNotifications([...notifications, newNoti]);
    setNotifications((prevNotifications) => {
      //console.log(prevNotifications);

      if (prevNotifications.length > 0) {
        const notificationIndex =
          prevNotifications[0].fullNotification.findIndex(
            (notification) =>
              notification._id === newNoti.fullNotification[0]._id
          );
        //console.log(notificationIndex);

        // If the notification is found, update it
        if (notificationIndex !== -1) {
          prevNotifications[0].fullNotification[notificationIndex] = newNoti;

          /// console.log(prevNotifications);

          return prevNotifications;
        } else {
          //console.log(newNoti);
          const temp = [newNoti];
          return temp;
        }
      } else {
        // console.log(newNoti);
        const temp = [newNoti];
        return temp;
      }
      //console.log("inside chats", prevNotifications);
    });
  }, []);

  useEffect(() => {
    //console.log("hii");
    socket.on("notify", updateNoti);

    return () => {
      // console.log("unmount");
      socket.off("notify", updateNoti);
    };
  });

  return (
    <>
      <div className='chatsContainer'>
        {isLoading ? (
          <span className='loader'></span>
        ) : (
          chats.map((chat) => {
            return (
              <div
                className='chats'
                key={chat._id}
                onClick={() => {
                  setSelectedChat(chat);
                }}
              >
                <div className='userChat'>
                  <img
                    src={
                      /* chat.profile.toString("base64") */
                      chat.users[0]._id === user._id
                        ? chat.users[1].pic.toString("base64")
                        : chat.users[0].pic.toString("base64")
                    }
                    alt='pic'
                  />
                  <div className='chatInfo'>
                    <h3>
                      {chat.users[0]._id === user._id
                        ? chat.users[1].username
                        : chat.users[0].username}
                    </h3>

                    <p>
                      {room === chat._id ? (
                        istyping ? (
                          <span className='typing'>typing...</span>
                        ) : chat.latestMessage ? (
                          JSON.stringify(chat.latestMessage.content).length >
                          10 ? (
                            JSON.stringify(chat.latestMessage.content).slice(
                              0,
                              10
                            ) + "..."
                          ) : (
                            chat.latestMessage.content
                          )
                        ) : (
                          "no messages"
                        )
                      ) : chat.latestMessage ? (
                        JSON.stringify(chat.latestMessage.content).length >
                        10 ? (
                          JSON.stringify(chat.latestMessage.content).slice(
                            0,
                            10
                          ) + "..."
                        ) : (
                          chat.latestMessage.content
                        )
                      ) : (
                        "no messages"
                      )}
                    </p>
                  </div>
                  <div className='notifiNtime'>
                    {notifications && notifications.length > 0 ? (
                      notifications.flatMap((ele) => {
                        // console.log("inside flatMap", ele.fullNotification);
                        if (
                          ele.fullNotification &&
                          !ele.fullNotification.length > 0
                        )
                          return;
                        return ele.fullNotification.map((element, index) => {
                          // console.log("inside map", element);
                          if (
                            element.content &&
                            element.content.length > 0 &&
                            element.chat._id === chat._id &&
                            element.sender._id !== user._id
                          ) {
                            return (
                              <span key={index} className='firstSpan'>
                                {element.content.length}
                              </span>
                            );
                          } else {
                            return null;
                          }
                        });
                      })
                    ) : (
                      <></>
                    )}
                    <span className='time'>
                      {new Intl.DateTimeFormat("en-US", {
                        timeZone: "Asia/Kolkata",
                        hour12: true,
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(chat.updatedAt))}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <ToastContainer />
    </>
  );
}
export default React.memo(Chats);

/*  {notifications && notifications.length > 0 ? (
                      notifications.map((element, index) => {
                        if (
                          element.fullNotification.length > 0 &&
                          element.fullNotification[index].chat._id ===
                            chat._id &&
                          element.fullNotification[index].sender._id !==
                            user._id
                        ) {
                          return (
                            <span key={index} className='firstSpan'>
                              {element.fullNotification[index].content.length}
                            </span>
                          );
                        } else {
                          return null;
                        }
                      })
                    ) : (
                      <></>
                    )} */
