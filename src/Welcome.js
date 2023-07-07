import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { setUnauthenticated } from './authSlice';

export const Welcome = () => {
  const {username}=useParams();
  const navigate=useNavigate();
  const dispatch=useDispatch();
  return (
    <>
        <h1>Welcome {username}</h1>
        <button onClick={()=>{
          navigate('/login');
          dispatch(setUnauthenticated);
        }}>Logout</button>
    </>
  )
}
