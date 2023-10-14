import React from "react";
import "./chat.css";
import { useCustom } from "../context/chatContext.js";
const Messages = React.lazy(() => import("../messages/messages.js"));
const Input = React.lazy(() => import("../input/input.js"));

function Chat() {
  const { selectedChat } = useCustom();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const avatar =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  //console.log("selectedChat", selectedChat);
  return (
    <>
      {!selectedChat ? (
        <div className='empty'>
          <p>Start Chat</p>
        </div>
      ) : (
        <div className='chat'>
          <div className='personChat'>
            <img
              src={
                selectedChat
                  ? selectedChat.users[0]._id === user._id
                    ? selectedChat.users[1].pic.toString("base64")
                    : selectedChat.users[0].pic.toString("base64")
                  : avatar
              }
              alt='pic'
            />

            <h3>
              {selectedChat.users[0]._id === user._id
                ? selectedChat.users[1].username
                : selectedChat.users[0].username}
            </h3>
            {/* options */}
          </div>
          <Messages />
          <Input />
        </div>
      )}
    </>
  );
}
export default Chat;

/* data:image/png;base64,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 */
