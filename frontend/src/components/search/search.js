import { useEffect, useState } from "react";
import "./search.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCustom } from "../context/chatContext.js";

const avatar =
  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

function Search() {
  //console.log("search");
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  //const inputref = useRef();
  const { chats, setChats, setSelectedChat } = useCustom();
  const loggeduser = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const getAllUsers = async (value) => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${loggeduser.token}`,
          },
        };
        const res = await axios.get(
          `http://localhost:3001/api/user?search=${value}`,
          config
        );

        setData(() => res.data);
      } catch (err) {
        toast.error("oops.. something went wrong,refresh once", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        //console.log("search", err);
      }
      if (value === "") {
        setData([]);
      }
    };

    const timer = setTimeout(() => {
      if (value !== "") getAllUsers(value);
      //console.log("getAllUsers");
    }, 500);
    return () => clearTimeout(timer);

    /* eslint-disable */
  }, [value]);

  const accessChat = async (userId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${loggeduser.token}`,
      },
    };

    const { data } = await axios.post(
      `http://localhost:3001/api/chat`,
      { userId },
      config
    );
    //console.log(data);
    if (!chats.find((c) => c._id === data._id)) {
      setChats([data, ...chats]);
      setSelectedChat(() => data);
    } else {
      setSelectedChat(() => data);
      setData(() => []);
    }
    //console.log("sarch access", res);
    setValue(() => "");
  };

  return (
    <>
      <div className='search'>
        <div className='searchForm'>
          <input
            type='text'
            value={value}
            placeholder='Find a user'
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        {data ? (
          data.map((user) => {
            // console.log("serch.js", user._id);
            return (
              <div
                className='userChat'
                key={user._id}
                onClick={() => accessChat(user._id)}
              >
                <img src={user.pic.toString("base64") || avatar} alt='pic' />
                <div className='chatInfo'>
                  <h3>{user.username}</h3>
                </div>
              </div>
            );
          })
        ) : (
          <p>user not found</p>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
export default Search;
