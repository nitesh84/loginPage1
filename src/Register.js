import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const StyledLabel = styled.label`
  margin-top: 10px;
`;

const StyledInput = styled.input`
  padding: 5px;
  margin: 5px;
  border: 1px solid #ccc;
`;

const StyledSubmitButton = styled.button`
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;

const StyledLink = styled(Link)`
  color: blue;
  font-style: italic;
  text-decoration: underline;

  cursor: pointer;
  transition: color 0.2s ease; 

  &:hover {
    color: #007bff; 
    text-decoration: none; 
  }

`;

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [failed, setFailed] = useState(false);
  const [failedmessage, setFailedMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    debounce(async () => {
      try {
        // Send the login data to the backend API
        if(username ==="" || password===""){
          setFailed(true)
          setFailedMessage("Username or password cant be empty");
          return ;
        }
        
        const response = await fetch(`${API_BASE_URL}api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log(data.message);

        if (response.ok) {
          console.log('User saved successfully', response);
          navigate('/login');
        } else if (response.status === 409) {
          setFailed(true);
          setFailedMessage('User Already Exists');
          console.error('User Already Exists');
        } else {
          setFailed(true);
          setFailedMessage('Something went wrong, please try again');
          console.error('An error occurred');
        }
      } catch (error) {
        console.error('An error occurred', error);
      }
    }, 500),
    [username, password, navigate]
  );

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <RegisterContainer>
      <Title>Register Page</Title>
      <StyledForm onSubmit={handleFormSubmit}>
        <StyledLabel>
          Username
          <StyledInput
            type="text"
            value={username}
            onChange={handleChangeUsername}
            placeholder="Username"
          />
        </StyledLabel>
        <StyledLabel>
          Password
          <StyledInput
            type="password"
            value={password}
            onChange={handleChangePassword}
            placeholder="Password"
          />
        </StyledLabel>
        <StyledLink to="/login">Already a user</StyledLink>
        <StyledSubmitButton type="submit">Submit</StyledSubmitButton>
        {failed && <ErrorMessage>{failedmessage}</ErrorMessage>}
      </StyledForm>
    </RegisterContainer>
  );
}

export default App;
