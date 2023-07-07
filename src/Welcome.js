import React, { useState ,useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import  ReactQuill  from 'react-quill';

import axios from 'axios';
import "react-quill/dist/quill.snow.css"

export const Welcome = () => {
  const {username}=useParams();
  const navigate=useNavigate();
  const [value, setValue]= useState();


  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image','video'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image' , 
  ]


  const saveQuill = async () => {
    console.log("save clicked");
    try {
      const response = await fetch('http://localhost:5000/api/save-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, content: value }),
      });
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  

  const fetchContent = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/get-content?username=${username}`);
      const { content } = response.data;
      setValue(content);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [username]);

  return (
    <>
        <h1>Welcome {username}</h1>
        <button onClick={()=>{
          localStorage.removeItem("user");
          navigate('/login');
        }}>Logout</button>

        <ReactQuill theme="snow"  value={value} onChange={setValue} modules={modules} formats={formats}/>
        <button onClick={saveQuill}>Save</button>

        
    </>
  )
}
