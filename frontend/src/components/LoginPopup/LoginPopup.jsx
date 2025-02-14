import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from './../../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({setShowLogin}) => {
  const {url,setToken} = useContext(StoreContext)
  const [currState,setCurrState] = useState("Sign up");
  const [data,setData] = useState({
    name:"",
    email:"",
    password:""
  })
  const onChangeHandler = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }
  const onLogin = async(event)=>{
    event.preventDefault();
    if (!data.email || !data.password || (currState === "Sign up" && !data.name)) {
      alert("Please fill in all required fields.");
      return;
    }
    let newUrl = url;
    if(currState==="Login"){
      newUrl+="/api/user/login"
    }else {
      newUrl += "/api/user/register"; // Use the register endpoint
    }
    try{
      const response = await axios.post(newUrl,data);

      if(response.data.success){
        setToken(response.data.token);
        localStorage.setItem("token",response.data.token);
        setShowLogin(false)
      }
      else{
        alert(response.data.message)
      }
    }catch (error) {
      console.error("Error during login/register:", error);
      alert("An error occurred. Please try again.");
    }

  }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} action="login-popup-container">
        <div className="login-popup-title">
          <h1 className='signup'>{currState}</h1>
          <img className="cross" onClick={()=>setShowLogin(false)}src={assets.cross_icon} alt="" />

        </div>
        <div className="login-popup-inputs">
          {currState==="Login"?<></>:<input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder='your Name' required />}
          
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Your Email'/>

          <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder='password' required />
        </div>
        <button type="submit" className='create'>{currState==="Sign up"?"Create account":"Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required/>
          <p>By continuing , i agree to the terms of use & privacy policy.</p>
        </div>
        {currState==="Login"?
        <p className='new-acc'>Create a new account? <span onClick={()=>setCurrState("Sign up")}>Click here</span></p>:
        <p className='already_account'>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>}
      </form>
    </div>
  )
}

export default LoginPopup
