import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../context/shopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function LoginPopup({ setShowLogin }) {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState('Sign Up');
  const [loading, setLoading] = useState(false);

  // Single state object for all form fields
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [agree, setAgree] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for Sign Up
    if (currState === 'Sign Up' && !agree) {
      toast.warning('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = currState === 'Login' ? '/api/user/login' : '/api/user/register';
      const response = await axios.post(`${url}${endpoint}`, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        toast.success(currState === 'Login' ? 'Logged in!' : 'Account created!');
        setShowLogin(false);
      } else {
        toast.error(response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
            className="close-icon"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === 'Sign Up' && (
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              value={data.name}
              onChange={onChangeHandler}
              required
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={data.email}
            onChange={onChangeHandler}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={onChangeHandler}
            required
            minLength={6}
          />

          {currState === 'Sign Up' && (
            <div className="login-popup-agree">
              <input
                type="checkbox"
                id="agree-checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />
              <label htmlFor="agree-checkbox">
                I agree to the <span>Terms of Service</span> and{' '}
                <span>Privacy Policy</span>.
              </label>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : currState === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        <div className="login-popup-toggle">
          {currState === 'Sign Up' ? (
            <p>
              Already have an account?{' '}
              <span onClick={() => setCurrState('Login')}>Login here</span>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <span onClick={() => setCurrState('Sign Up')}>Sign up here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default LoginPopup;