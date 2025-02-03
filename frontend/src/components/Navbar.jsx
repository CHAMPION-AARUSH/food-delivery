import React, { useContext, useState } from 'react'
import './navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home")

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    console.log(localStorage.getItem("token"))
    // Remove the token from localStorage
    localStorage.removeItem("token");
    
    // Update the context state
    setToken(null); // or setToken("") if you want to clear the token completely
  
    // Optionally navigate after logging out
    navigate("/");
    console.log(localStorage.getItem("token"))
  
    // If needed, you can also redirect to the login page or home after logging out
  }
  
  return (
    <div>
      <div className='navbar'>
        <Link to='/'><img src={assets.logo} alt="logo" /></Link>
        <ul className='navbar-menu'>
          <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
          <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
          <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile-app</a>
          <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact us</a>
        </ul>
        <div className='navbar-right'>
          <img src={assets.search_icon} alt="" />
          <div className='navbar-search-icon'>
            <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </div>
          {!token ? <button onClick={() => setShowLogin(true)}>sign in</button> :
            <div className='navbar-profile'>
              <img src={assets.profile_icon} alt="" />
              <ul className="nav-profile-dropdown">
                <li onClick={()=>navigate('/myorders')}>
                  <img src={assets.bag_icon} alt="" />
                  <p>orders</p>
                </li>
                <hr />
                <li>
                  <img onClick={logout} src={assets.logout_icon} alt="" />
                  <p onClick={logout}>Logout</p>
                </li>
              </ul>
            </div>
          }
        </div>

      </div>
    </div>
  )
}

export default Navbar
