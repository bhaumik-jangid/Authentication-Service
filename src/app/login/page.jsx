"use client";
import React, { useEffect, useState } from 'react';
import '@/app/login/style.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
  const router = useRouter();
  const [response, setResponse] = useState({
    message: '',
    status: 0,
  });
  const [user, setUser] = useState({
    email: '',
    password: '',
    isDev: true,
  })
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [resendResponse, setResendResponse] = useState({
    message: '',
    status: 0,
  });;
  const [showResend, setShowResend] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault();
    setShowResend(false);
    try {
      setLoading(true);
      const res = await  axios.post('/api/dev/login', user);
      setResponse({ message: res.data.message, status: res.status });
      setTimeout(() => router.push('/profile'), 1000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Extract error message from API response
        setResponse({ message: error.response.data.message, status: error.response.status });
        if (error.response.status === 401) {
          setShowResend(true);
        }
      } else {
        // Handle unexpected errors
        setResponse({ message: 'An unexpected error occurred. Please check your network and try again.', status: 500 });
      }
    } finally {
      setLoading(false);
      console.log(response.status);
    }
  }

  const resendVerificationEmail = async () => {
    try {
      setSendLoading(true);

      const res = await axios.post('/api/auth/sendMail', { email: user.email, emailType: "DEV_VERIFY" });
      setResendResponse({ message: res.data.message, status: res.status });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Extract error message from API response
        setResendResponse({ message: error.response.data.message, status: error.response.status });
        if (error.response.status === 400) {
          setShowResend(false);
          setResponse({ message: 'Already verified, You can now login', status: 200 });
        }
      } else {
        // Handle unexpected errors
        setResendResponse({ message: 'An unexpected error occurred. Please check your network and try again.', status: 500 });
      }
    } finally {
      setSendLoading(false);
    }
  }

  useEffect(() => {
    setShowResend(false);
    setResponse({ message: '', status: 0 });
    setResendResponse({ message: '', status: 0 });
  }, [user.email, user.password]);

  useEffect(() => {
    if(sendLoading){
      setResendResponse({ message: '', status: 0 });
    }
  }, [sendLoading]);

  return (
    <div className="form-container">
      <form onSubmit={onLogin} className="form">
        <div className="form-header">
          <h1 className='text-blue-700'>Login Form</h1>
        </div>
        <div>
          {(response.status === 401 || response.status === 200) && <p className="response sucess">{response.message}</p>}
          {(response.status === 400 || response.status === 500) && <p className="response error">{response.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            className="form-input"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Create Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            className="form-input"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            required
          />
        </div>
        <div className="form-footer">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </div>
        {showResend && (
          <>
            <div className="resend-container">
              <p className='response'>Haven't received a verification email? Send a new one.</p>
              <button
                type="button"
                className="resend-button"
                onClick={resendVerificationEmail}
                disabled={sendLoading}
              >
                {sendLoading ? "Sending..." : "Send"}
              </button>
            </div>
            <div>
              {(resendResponse.status === 401 || resendResponse.status === 200) && <p className="response sucess">{resendResponse.message}</p>}
              {(resendResponse.status === 400 || resendResponse.status === 500) && <p className="response error">{resendResponse.message}</p>}
            </div>
          </>
        )}
        {!showResend && (
          <div className="form-footer padding visit">
            <Link href='/signup'>Visit signin page</Link>
          </div>
        )}
      </form>
    </div>
  );
}
