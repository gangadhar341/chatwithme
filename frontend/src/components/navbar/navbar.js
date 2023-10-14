import "./navbar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//const url = "http://localhost:3001/api/chat/updatepic";

const avatar =
  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

function Navbar() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function logouthandler() {
    localStorage.removeItem("userInfo");
    toast.success("successfully logout", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    navigate("/");
  }

  const createPost = async (newImage) => {
    //console.log(newImage);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      //console.log("newImage", newImage);
      //console.log("userId", user._id);
      await axios.put(
        "http://localhost:3001/api/user/updatepic",
        { userId: `${user._id}`, newImage: `${newImage}` },
        config,
        { credentials: "include" }
      );

      const updatedUser = { ...user, pic: newImage };

      // Update localStorage with the updated user information
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      //console.log(res);
      setLoading(false);
    } catch (error) {
      toast.error("somthing went wrong", {
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

  function convertToBase64(file) {
    if (!file) return;
    setLoading(true);
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        //setPostImage(fileReader.result)
        //setPostImage({ ...postImage, myFile: fileReader.result });
        //console.log(fileReader.result);
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  /*  const handleSubmit = (e) => {
    e.preventDefault();
    createPost(postImage);
    console.log("Uploaded");
  }; */

  const handleFileUpload = async (e) => {
    //if (e.target.files.length <= 0) return;
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    //console.log("base64", base64);

    /*  setPostImage({ ...postImage, myFile: base64 });

    console.log(postImage); */

    if (!base64) return;
    setUser({ ...user, pic: base64 });
    createPost(base64)
      .then((res) => console.log())
      .catch((err) => console.log(err));

    setLoading(false);
  };
  return (
    <>
      <div className='navbar'>
        {/* <div className='name'>name</div> */}
        <div className='user'>
          <label htmlFor='file-upload' className='custom-file-upload'>
            {loading ? (
              <div className='ring'>...</div>
            ) : (
              <img src={user.pic.toString("base64") || avatar} alt='' />
            )}
          </label>

          <input
            type='file'
            lable='Image'
            name='myFile'
            id='file-upload'
            accept='.jpeg, .png, .jpg'
            onChange={(e) => handleFileUpload(e)}
          />

          <span>{user.username}</span>
        </div>
        <div className='logout'>
          <button onClick={logouthandler}>Logout</button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
export default Navbar;
