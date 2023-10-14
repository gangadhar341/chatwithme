import "./login_css/register.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
//import { useSocket } from "../context/socketContext.js";

function Register() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(true);
  const [eye, setEye] = useState(false);
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);

  //const { socket, setSocketConnected } = useSocket();

  function eyeClicked(e) {
    if (eye === false) {
      setEye(true);
    } else {
      setEye(false);
    }
  }
  function checked(e) {
    if (e.target.value === "true") {
      setCheck(false);
    } else {
      setCheck(true);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    /*  const user = {
      username: username,
      email: email,
      password: password,
      check: check,
    };
    //console.log(user); */
    if (username !== username.toLocaleLowerCase()) {
      toast.error("please enter user name in lower case", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (!email.includes("@gmail.com")) {
      toast.error("please enter correct email", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:3001/api/user/register",
        { username, email, password },
        config
      );
      setLoading(false);
      toast.success("Register success full", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      /*   const user = localStorage.getItem("userInfo");
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true)); */
      navigate("/home");

      setEmail("");
      setPassword("");
      setCheck(true);
    }
  }
  return (
    <>
      {isLoading ? (
        <span className='loader'></span>
      ) : (
        <div className='container'>
          <div className='wrapper'>
            <form onSubmit={handleSubmit}>
              <h1>Register</h1>
              <div className='input-box'>
                <input
                  type='text'
                  required
                  maxLength={20}
                  onChange={(e) => setUserName(e.target.value)}
                  value={username}
                />
                <label>Username</label>
              </div>
              <div className='input-box'>
                <input
                  type='text'
                  required
                  maxLength={30}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <label>E-mail</label>
              </div>
              <div className='input-box'>
                <span className='icon' onClick={eyeClicked}>
                  {eye ? (
                    <i className='bi bi-eye'></i>
                  ) : (
                    <i className='bi bi-eye-slash'></i>
                  )}
                </span>
                <input
                  type={eye ? "text" : "password"}
                  required
                  maxLength={20}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <label>Password</label>
              </div>
              <div className='check-div'>
                <label>
                  <input
                    type='checkbox'
                    onChange={checked}
                    checked={check}
                    value={check}
                  />{" "}
                  I agree to the <span>terms&conditions</span>
                </label>
              </div>
              <div className='register-div'>
                <input
                  type='submit'
                  className='btn'
                  disabled={check ? false : true}
                />
              </div>
            </form>
          </div>
          <div className='log'>
            <p>
              Already you have an Account?{" "}
              <span>
                <Link to='/'>Login</Link>
              </span>
            </p>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
}
export default Register;
