import React from 'react'
import './Sidebar.css'

import { assets } from './../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (

    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p className='text-side'>Add items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p className='text-side'>List items</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p className='text-side'>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
