import React, { useContext, useEffect, useState } from 'react'
import './Placeorder.css'
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  // useEffect(()=>{
  //   console.log(data);
  // },[data]) 

  // const placeOrder = async (event) => {
  //   event.preventDefault();
  //   let orderItems = [];
  //   food_list.map((item) => {
  //     if (cartItems[item._id] > 0) {
  //       let itemInfo = item;
  //       itemInfo["quantity"] = cartItems[item._id];
  //       orderItems.push(itemInfo);
  //     }
  //   })
  //   let orderData = {
  //     address: data,
  //     items: orderItems,
  //     amount: getTotalCartAmount() + 2,
  //   }
  //   const storedToken = localStorage.getItem("token");
  //   if (!storedToken) {
  //     alert("You need to be logged in to place an order.");
  //     return;
  // }
  //   let response = await axios.post(url + "/api/order/place", orderData, { headers: { Authorization: `Bearer ${storedToken}` } });

  //   if (response.data.success) {
  //     const { session_url } = response.data;
  //     window.location.replace(session_url);
  //   }
  //   else {
  //     alert("Error");
  //   }
  // };
  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];   //gets quantity stored in key value pair of product id and its quantity.
        orderItems.push(itemInfo);
      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    }

    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        alert("You need to be logged in to place an order.");
        return;
      }
      
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { Authorization: `Bearer ${storedToken}` } });
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Error placing order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Token from context:", token);
    if(!token){
      navigate('/cart')
    }
    else if(getTotalCartAmount()===0){
      navigate('/cart')
    }
}, [token]);



  return (
    <>
      <hr className='header-line' />
      <form onSubmit={placeOrder} action="" className='place-order'>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
            <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
          </div>
          <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
          <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
          <div className="multi-fields">
            <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
            <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
          </div>
          <div className="multi-fields">
            <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
            <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
          </div>
          <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>

            <div className="cart-total-details">
              <b>Subtotal</b>
              <b>{`$${getTotalCartAmount()}`}</b>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Delivery Fee</b>
              <b>{`$${getTotalCartAmount() === 0 ? 0 : 2}`}</b>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{`$${getTotalCartAmount() === 0 ? 0 : 2 + getTotalCartAmount()}`}</b>
            </div>
          </div>
          <button type="submit" className='but'>PROCEED TO PAYMENT</button>
        </div>
      </form>
    </>
  )
}

export default PlaceOrder
