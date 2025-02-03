
import { assets } from '../../assets/assets'
import './Navbar.css'
import React from 'react'

const Navbar = () => {
  return (
    <div>
      <div className="navbar">
        <img src={assets.logo} alt="" className="logo" />
        
        <img src={assets.profile_image} alt="" className="profile" />
      </div>
    </div>
  )
}

export default Navbar
