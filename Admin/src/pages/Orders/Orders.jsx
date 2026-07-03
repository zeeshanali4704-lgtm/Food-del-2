import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

function Orders({ url }) {
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    }
  };

  // Update order status
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });

      if (response.data.success) {
        toast.success("Order Status Updated");
        fetchAllOrders();
      } else {
        toast.error("Status Update Failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>

      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="parcel" />

            <div>
              <p className="order-item-food">
                {order.items
                  ?.map((item) => `${item.name} x ${item.quantity}`)
                  .join(", ")}
              </p>

              <p className="order-item-name">
                {order.address?.firstName} {order.address?.lastName}
              </p>

              <div className="order-item-address">
                <p>{order.address?.street}</p>

                <p>
                  {order.address?.city}, {order.address?.state},{" "}
                  {order.address?.country}, {order.address?.zipcode}
                </p>
              </div>

              <p className="order-item-phone">
                {order.address?.phone}
              </p>
            </div>

            <p>Items: {order.items?.length}</p>

            <p>${order.amount}</p>

            <select
              value={order.status}
              onChange={(event) => statusHandler(event, order._id)}
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;