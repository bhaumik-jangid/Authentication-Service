"use client";
import React, { useEffect, useState } from 'react';
import './style.css';
import axios from 'axios';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

function Page() {
  const [user, setUser] = useState({
    email: '',
    password: '',
    username: ''
  })
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({
    msg: '',
    status: 404
  });

  const onSignup = async (e) => {
    e.preventDefault();
    setResponse({msg: '', status: 404});
    try {
      setLoading(true);
      const res = await toast.promise(
        axios.post('/api/dev/signup', user),
        {
          loading: "Signing up...",
          success: "Account created!",
        }
      );

      setResponse({msg: res.data.message, status: res.status});

    } catch (error) {
      console.log('signup failed', error);
      if (axios.isAxiosError(error) && error.response) {
        // Extract error message from API response
        setResponse({msg: error.response.data.message, status: error.response.status});
      } else {
        // Handle unexpected errors
        setResponse({msg: "API or Server error", status: 500});
        console.error('An unexpected error happened during signup', error);
      }
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      console.log(response)
    }
  }

  useEffect(() => {
    setResponse({msg: '', status: 404})
  }, [user])
  

  return (
    <div className="form-container">
      <Toaster />
      <form onSubmit={onSignup} className="form">
        <div className="form-header">
          <h1>Register Form</h1>
        </div>
        <div>
          {(response.status === 201) && <p className="response text-green-400">{response.msg} PLease verify your email to use the application</p>}
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            className="form-input"
            value={user.username}
            onChange={(e) => setUser({...user, username: e.target.value})}
            required
          />
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
            {loading ? 'Loading...' : 'Register'}
          </button>
        </div>

        <div className='center-align visit'>
          <Link href='/login'>Visit login page</Link>
        </div>
      </form>
    </div>
  );
}

export default Page;
