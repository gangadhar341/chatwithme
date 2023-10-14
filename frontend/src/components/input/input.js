import { useEffect, useRef } from "react";
import "./input.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useCustom } from "../context/chatContext.js";
import { useSocket } from "../context/socketContext.js";

function Input() {
  const inputRef = useRef("");

  const { selectedChat, setMessages, messages } = useCustom();
  const { socket, socketConnected, typing, setTyping, setIsTyping, setRoom } =
    useSocket();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  //console.log(selectedChat._id);

  useEffect(() => {
    socket.on("typing", (room) => {
      setIsTyping(true);
      setRoom(room);
    });
    socket.on("stop typing", (room) => {
      setIsTyping(false);
      setRoom(room);
    });

    // eslint-disable-next-line
  }, []);

  const typingHandler = async () => {
    //console.log(socketConnected);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      //console.log("typing");
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const sendMessage = async () => {
    socket.emit("stop typing", selectedChat._id);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/message",
        {
          content: inputRef.current.value,
          chatId: `${selectedChat._id}`,
        },
        config
      );
      //console.log(data);
      inputRef.current.value = "";
      //console.log("input");
      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (err) {
      toast.error("server error", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      //console.log("err in inpu", err);
    }
  };
  return (
    <>
      <div className='inputDiv'>
        <textarea
          placeholder='Type somthing...'
          ref={inputRef}
          onChange={typingHandler}
        />
        <div className='send'>
          <span onClick={sendMessage}>
            {/* <i class='bi bi-send'></i> */}
            <img src='send.png ' alt='send' />
          </span>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
export default Input;
