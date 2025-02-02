'use client';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import "./style.css";

export default function ProfilePage() {
    const router = useRouter();
    const [response, setResponse] = useState({ status: 999, message: "" });
    const [data, setData] = useState("Nothing");

    const getUserDetails = async () => {
        try {
            const res = await axios.post('/api/dev/profile');
            console.log(res.data);
            setData(res.data.data);
        } catch (error) {
            if (
              error.response?.status === 400
            ) {
              document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              console.log("User does not exist. Redirecting to login...");
              router.push('/login');
            } else {
              console.error(error.message);
            }
        }
    }

    const logout = async () => {
        try {
            await axios.post('/api/dev/logout');
            router.push('/login');
        } catch (error) {
            console.error(error.message);
        }
    }

    const deleteUser = async () => {
        try {
          if (!data) {
            setResponse({ status: 400, message: "Invalid user ID" });
            return;
          }
      
          const id = { id: data };
      
          const res = await axios.post("/api/dev/delete", id, {
            validateStatus: (status) => status < 500,
          });
      
          setResponse({ message: res.data.message, status: res.status });
          if(res.status === 200) {
            setTimeout(() => router.push("/login"), 2000);
          }
        } catch (error) {
          console.error("Unexpected Error:", error);
          
          if (axios.isAxiosError(error) && error.response) {
            // Extract error message from API response
            setResponse({
              message: error.response.data.error || "An error occurred. Please try again.",
              status: error.response.status,
            });
          } else {
            // Handle unexpected errors
            setResponse({
              message: "Server error",
              status: 500,
            });
          }
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const dashboard = () => {
      router.push('/dashboard');
    }

  return (
    <>
        <div className='constainer'>
            <div className='profile-box'>
              <div className='profile-content-box heading'>
                <h1>Profile</h1>
              </div>
              <div className='profile-content-box response'>
                  {response.status == 200 && (
                        <h2 className='success-text'>
                          {response.message}
                        </h2>
                  )}
                  {response.status >= 400 && (
                        <h2 className='error-text'>
                          {response.message}
                        </h2>
                  )}
              </div>
              <div className='profile-content-box'>
                  <div className='detail-div'>
                    <h3>Id: </h3>
                    <p>{data._id}</p>
                  </div>
                  <div className='detail-div'>
                    <h3>Username: </h3>
                    <p>{data.username}</p>
                  </div>
                  <div className='detail-div'>
                    <h3>Email: </h3>
                    <p>{data.email}</p>
                  </div>
                  <div className='detail-div'>
                    <h3>Email Verified: </h3>
                    <p>{data.isVerified ? "Yes" : "No"}</p>
                  </div>
                  <div className='detail-div'>
                    <h3>Email Verify Token: </h3>
                    <p>{data.emailVerifyToken}</p>
                  </div>
                  <div className='detail-div'>
                    <h3>Email Verify Token Expire: </h3>
                    <p>{data.emailVerifyTokenExpire}</p>
                  </div>
              </div>
              <div className='profile-content-box btn-style'>
                  <button onClick={logout} className='btn'>Logout</button>
                  <button onClick={getUserDetails} className='btn'>getUserDetails</button>
                  <button onClick={deleteUser} className='btn'>Delete User</button>
                  <button onClick={dashboard} className='btn'>Dashboard</button>
              </div>
            </div>
        </div>

    </>
  )
}