import React, { useEffect } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

const Chat = React.lazy(() => import("../chat/chat.js"));
const Sidebar = React.lazy(() => import("../sidebar/sidebar.js"));

function Home() {
  const navigate = useNavigate();

  //console.log("home");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className='home'>
        <div className='home-container'>
          <Sidebar />
          <Chat />
        </div>
      </div>
    </>
  );
}
export default Home;
