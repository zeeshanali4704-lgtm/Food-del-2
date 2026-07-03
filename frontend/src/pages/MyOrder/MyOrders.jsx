  import React, { useContext, useEffect, useState } from "react";
  import { StoreContext } from "../../components/context/shopContext";
  import axios from "axios";
  import { assets } from "../../assets/assets";
  import './MyOrder.css'

  const MyOrder = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
const fetchOrders = async () => {
  try {
    const response = await axios.post(
      `${url}/api/order/userorders`,
      {},
      { headers: { token } }
    );

    if (response.data.success) {
      setData(response.data.data);
    }
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};

    useEffect(() => {
      if (token) {
        fetchOrders();
      }
    }, [token]);

    return (
      <div className="my-orders">
        <h2>My Orders</h2>

        <div className="container">
          {data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />

              <p>
                {order.items
                  .map((item) => `${item.name} x ${item.quantity}`)
                  .join(", ")}
              </p>

              <p>${order.amount}.00</p>

              <p>Items: {order.items.length}</p>

              <p>
                <span>&#x25cf;</span> <b>{order.status}</b>
              </p>

              <button onClick={fetchOrders}  >Track Order</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default MyOrder;