// import React, { useContext, useEffect, useState } from 'react'
// import './MyOrders.css'
// import { StoreContext } from '../../context/StoreContext'
// import { assets } from '../../../assets/assets'
// import axios from 'axios'

// const MyOrders = () => {
//   const { url, token } = useContext(StoreContext)

//   const [data, setData] = useState([])

//   const fetchOrders = async () => {
//     try {
//       console.log("token in my order",token);
//       const response = await axios.post(
//         url + '/api/order/userorders',
//         {},
//         { headers: { token } }
//       )
//       setData(response.data.data)
//       console.log(response.data)
//     } catch (error) {
//       console.error('Error fetching orders:', error)
//     }
//   }

//   useEffect(() => {
//     if (token) {
//       fetchOrders()
//     }
//   }, [token]) // Add token as a dependency

//   return (
//     <div className='my-orders'>
//       <h2>My orders</h2>
//       <div className='container'>
//         {data.map((order, index) => {
//           return (
//             <div key={index} className='my-orders-order'>
//               <img src={assets.parcel_icon} alt='' />
//               <p>
//                 {order.items.map((item, index) => {
//                   if (index === order.items.length - 1) {
//                     return item.name + 'x' + item.quantity
//                   } else {
//                     return item.name + 'x' + item.quantity + ','
//                   }
//                 })}
//               </p>
//               <p>${order.amount}.00</p>
//               <p>Items:{order.items.length}</p>
//               <p>
//                 <span>&#x25cf;</span>
//                 <b>{order.status}</b>
//               </p>
//               <button onClick={fetchOrders}>Track Order</button>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default MyOrders


import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../../assets/assets';
import axios from 'axios';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    if (!token) {
      setError('Token not found!');
      setLoading(false);
      return;
    }

    try {
      console.log('Token in My Orders:', token);
      const response = await axios.post(
        url + '/api/order/userorders',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setData(response.data.data); // Populate the orders if successful
        console.log('Orders data:', response.data.data);
      } else {
        setError('No orders found!');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Something went wrong while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 ? (
          <div>No orders found</div>
        ) : (
          data.map((order, index) => {
            return (
              <div key={index} className="my-orders-order">
                <img src={assets.parcel_icon} alt="" />
                <p>
                  {order.items.map((item, index) => {
                    return index === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `;
                  })}
                </p>
                <p>${order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <p>
                {/*  */}
                  <span>&#x25cf;</span>
                  <b>{order.status}</b>
                </p>
                <button >Order Status</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;
