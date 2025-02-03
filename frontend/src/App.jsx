import { useState } from 'react'
import Navbar from './components/Navbar';
import './index.css'
import { Routes,Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import PlaceOrder from './components/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './components/Verify/Verify';
import MyOrders from './components/MyOrders/Myorders';

function App() {
  const [count, setCount] = useState(0)
  const [showLogin,setShowLogin] = useState(false)
  return (
    <>
      {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>} 
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/placeorder' element={<PlaceOrder/>} />
          <Route path='/order' element={<PlaceOrder/>}/>
          <Route path="/verify" element={<Verify/>}/>
          <Route path='/myorders' element={<MyOrders/>}/>
        </Routes>
      </div>
      <Footer/>
    
    </>
  )
}

export default App
