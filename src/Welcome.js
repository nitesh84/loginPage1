import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import axios from 'axios';
import styled from 'styled-components';
import 'react-quill/dist/quill.snow.css';

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
    console.log('save clicked');
    const formData = new FormData();
    console.log('data', username, JSON.stringify(value));
    formData.append('username', username);
    formData.append('content', JSON.stringify(value));
    console.log('formData:', formData, username);
    for (const entry of formData.entries()) {
      console.log('entries', entry);
    }
    try {
      console.log(formData.get('username'));
      await axios.post('http://localhost:5000/api/save-content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
