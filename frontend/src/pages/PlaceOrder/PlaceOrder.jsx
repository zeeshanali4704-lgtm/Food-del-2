import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../components/context/shopContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PlaceOrder() {
  const navigate = useNavigate();
  const { cartItems, food_list, getTotalCartAmount, token, url } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    for (let key in formData) {
      if (formData[key].trim() === '') {
        alert('Please fill all delivery details.');
        return false;
      }
    }
    return true;
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee;

  if (subtotal === 0) {
    return (
      <div className="place-order-empty">
        <p>Your cart is empty. Please add items before placing an order.</p>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="place-order-success">
        <h2>🎉 Order Placed Successfully!</h2>
        <p>Thank you for your order. We will deliver it soon.</p>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;
    if (loading) return;
    setLoading(true);

    try {
      const orderItems = food_list
        .filter(item => cartItems[item._id] > 0)
        .map(item => ({
          ...item,
          quantity: cartItems[item._id]
        }));

      const orderData = {
        address: formData,
        items: orderItems,
        amount: total,
        paymentMethod
      };

      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }
      });

      if (response.data.success) {
        if (response.data.session_url) {
          window.location.replace(response.data.session_url);
        } else {
          setOrderPlaced(true);
        }
      } else {
        alert(response.data.message || 'Order failed');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
useEffect(() => {
  if (!token) {
    navigate("/cart");
  } else if (getTotalCartAmount() === 0) {
    navigate("/cart");
  }
}, [token, cartItems]);
  return (
    <div className="place-order">
      <div className="place-order-left">
        <h2>Delivery Information</h2>
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="multi-field">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={onChangeHandler}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={onChangeHandler}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={onChangeHandler}
            required
          />
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={formData.street}
            onChange={onChangeHandler}
            required
          />
          <div className="multi-field">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={onChangeHandler}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="multi-field">
            <input
              type="text"
              name="zipcode"
              placeholder="Zip Code"
              value={formData.zipcode}
              onChange={onChangeHandler}
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={onChangeHandler}
              required
            />
          </div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={onChangeHandler}
            required
          />

          <div className="payment-section">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                Cash on Delivery
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                />
                Stripe (Credit / Debit Card)
              </label>
            </div>
          </div>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading
              ? 'Processing...'
              : paymentMethod === 'cod'
              ? 'Place Order (COD)'
              : 'Pay with Stripe'}
          </button>
        </form>
      </div>

      <div className="place-order-right">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {food_list.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={item._id} className="summary-item">
                    <div className="summary-item-info">
                      <p>{item.name}</p>
                      <p>× {cartItems[item._id]}</p>
                    </div>
                    <p>${(item.price * cartItems[item._id]).toFixed(2)}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>
          <hr />
          <div className="summary-totals">
            <div className="summary-row">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className="summary-row">
              <p>Delivery Fee</p>
              <p>${deliveryFee.toFixed(2)}</p>
            </div>
            <div className="summary-row total">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
