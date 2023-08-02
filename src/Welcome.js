import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import axios from 'axios';
import styled from 'styled-components';
import 'react-quill/dist/quill.snow.css';
import { API_BASE_URL } from './config';

const Wrapper = styled.div`

  nav {
    background-color: #f2f2f2;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h1 {
    font-size: 24px;
    margin: 0;
  }

  .button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px;
  }

  .quill-container {
    margin-top: 20px;
  }

  .save{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
`;

export const Welcome = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState();

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  const saveQuill = async () => {
    const formData = new FormData();
    console.log(username,JSON.stringify({ username }))
  formData.append('username', username);
  formData.append('content', JSON.stringify(value));
  console.log("data:",JSON.stringify(value));
  try {
    // const response = await fetch(`${API_BASE_URL}api/save-content`, {
    //   method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
    //   body: JSON.stringify({ username }),
    // });
    
    const response = await fetch(`${API_BASE_URL}api/save-content`, {
      method: 'POST', 
       headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData, // Send the FormData object as the request body
    });


  
    if (response.ok) {
      console.log('Data saved successfully!');
    } else {
      console.error('Error saving data:', response.status, response.statusText);
      // If you want to get more information about the error, you can use:
      const errorData = await response.json();
      console.error('Error saving data:', errorData);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
  
}

  const fetchContent = async () => {
    try {
      // const response = await axios.get(`http://localhost:5000/api/get-content?username=${username}`);
      const response = await axios.get(`${API_BASE_URL}api/get-content?username=${username}`);
      const { content } = response.data;
      console.log('fetch content', content);
      setValue(content);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line
  }, []);

  return (
    <Wrapper>
      <nav>
        <h1>Welcome {username}</h1>
        <button className="button" onClick={() => {
          localStorage.removeItem('user');
          navigate('/login');
        }}>Logout</button>
      </nav>

      <div className="quill-container">
        <ReactQuill theme="snow" value={value} onChange={setValue} modules={modules} formats={formats} placeholder="Write something" />
      </div>
      <button className="button save" onClick={saveQuill}>Save</button>
    </Wrapper>
  );
};
