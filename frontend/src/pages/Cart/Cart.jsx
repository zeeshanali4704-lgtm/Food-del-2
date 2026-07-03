import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../components/context/shopContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  // ✅ Context se sab kuch le lo – ab getTotalCartAmount bhi include hai
  const { cartItems, food_list, removeFromCart, getTotalCartAmount,url } = useContext(StoreContext);

  const navigate = useNavigate()
  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState(null);
  const [error, setError] = useState('');

  // Predefined promo codes
  const promoCodes = {
    'DISCOUNT10': 0.10, // 10% off
    'FLAT20': 20,       // $20 off
    'SAVE15': 15        // $15 off
  };

  // ✅ Ab subtotal context ke function se calculate hoga
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;

  // Apply promo code
  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setError('Please enter a promo code.');
      return;
    }
    if (appliedCode) {
      setError('Promo code already applied.');
      return;
    }
    if (promoCodes[code] !== undefined) {
      let discountValue = promoCodes[code];
      if (typeof discountValue === 'number' && discountValue < 1) {
        discountValue = subtotal * discountValue;
      }
      setDiscount(discountValue);
      setAppliedCode(code);
      setError('');
      setPromoCode('');
    } else {
      setError('Invalid promo code.');
    }
  };

  // Remove promo
  const removePromo = () => {
    setDiscount(0);
    setAppliedCode(null);
    setError('');
  };

  const finalTotal = subtotal - discount + deliveryFee;

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Item</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {Object.values(cartItems).every((qty) => qty === 0) ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          food_list.map((item) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={item._id} className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className="remove-icon">
                    x
                  </p>
                </div>
              );
            }
            return null;
          })
        )}
      </div>

      {/* Cart Total Section */}
      <div className="cart-total">
        <h2>Cart Total</h2>
        <div className="cart-total-details">
          <p>Subtotal</p>
          <p>${subtotal}</p>
        </div>
        <hr />
        <div className="cart-total-details">
          <p>Delivery Fee</p>
          <p>${deliveryFee}</p>
        </div>
        {discount > 0 && (
          <>
            <hr />
            <div className="cart-total-details discount">
              <p>Discount ({appliedCode})</p>
              <p>-${discount.toFixed(2)}</p>
            </div>
          </>
        )}
        <hr />
        <div className="cart-total-details">
          <b>Total</b>
          <b>${finalTotal.toFixed(2)}</b>
        </div>

        {/* Promo Code Section */}
        <div className="promo-section">
          <div className="promo-input">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={appliedCode !== null}
            />
            <button
              onClick={applyPromo}
              disabled={appliedCode !== null}
            >
              Apply
            </button>
          </div>
          {error && <p className="promo-error">{error}</p>}
          {appliedCode && (
            <p className="promo-success">
              Promo code applied!{' '}
              <span onClick={removePromo} className="promo-remove">
                (remove)
              </span>
            </p>
          )}
          {!appliedCode && subtotal > 0 && (
            <p className="promo-hint">Try: DISCOUNT10, FLAT20, SAVE15</p>
          )}
        </div>

        <button onClick={()=>navigate('/order')} className="checkout-btn">PROCEED TO CHECKOUT</button>
      </div>
    </div>
  );
}

export default Cart;