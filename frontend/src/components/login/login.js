import "./login_css/login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { useSocket } from "../context/socketContext.js";
import axios from "axios";

function Login() {
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
    setCheck(e.target.checked);
  }
  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.includes("@gmail.com") && email !== email.toLowerCase()) {
      toast.error("please enter correct email", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (password.length <= 3) {
      toast.error("password length must greater than 3", {
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

      try {
        const { data } = await axios.post(
          "http://localhost:3001/api/user",
          { email, password },
          config
        );

        toast.success("Login success full", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        /*  const user = localStorage.getItem("userInfo");
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true)); */
        //newSocket.emit("setup", user);
        // newSocket.on("connected", () => setSocketConnected(true));
        setLoading(false);
        navigate("/home");

        setEmail("");
        setPassword("");
        setCheck(true);
      } catch (err) {
        setLoading(false);
        console.log(err);
        toast.error("Invalid email or password", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  }
  return (
    <>
      {isLoading ? (
        <span className='loader'></span>
      ) : (
        <div className='container'>
          <div className='wraper'>
            <form onSubmit={handleSubmit}>
              <h1>Login</h1>
              <div className='form-wraper'>
                <span className='icon'>
                  <i className='bi bi-envelope'></i>
                </span>
                <input
                  type='text'
                  id='email'
                  name='email'
                  required
                  maxLength={30}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <label htmlFor='email'>Email</label>
              </div>
              <div className='form-wraper'>
                {/*  */}
                <span className='icon' onClick={eyeClicked}>
                  {eye ? (
                    <i className='bi bi-eye'></i>
                  ) : (
                    <i className='bi bi-eye-slash'></i>
                  )}
                </span>
                <input
                  type={eye ? "text" : "password"}
                  id='password'
                  name='password'
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <label htmlFor='password'>Password</label>
              </div>
              <div className='check-box'>
                <label htmlFor='check'>
                  <input
                    type='checkbox'
                    id='check'
                    name='check'
                    maxLength={20}
                    checked={check}
                    onChange={checked}
                    value={check}
                  />{" "}
                  Remember me
                </label>
                <span>Forgot password?</span>
              </div>
              <div className='btndiv'>
                <button
                  type='submit'
                  /* disabled={check ? false : true} */
                  className='login-btn'
                >
                  Login
                </button>
              </div>
            </form>
          </div>
          <div className='register'>
            <p>
              Don't have an account?{" "}
              <span>
                <Link to='/register'>Register Here</Link>
              </span>
            </p>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
}
export default Login;
