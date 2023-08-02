import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isEqual } from 'lodash';
import styled from 'styled-components';
import './global.css'

import { API_BASE_URL } from './config';
import Footer from './Footer';

const EntireContainer = styled.div`
  background: linear-gradient(to bottom right, #ff8a00, #e52e71);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const LoginContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 18vw;
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;


const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 10px;
  margin-left: 10px;
  border-radius:10px;
  border:0px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #ff8a00;
  color: white;
  border: none;
  margin-bottom:10px;

  &:hover {
    background-color: #e52e71;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
  color: red;
  font-size: 20px;
  font-weight: bold;
`;

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submit, setSubmit] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the login data to the backend API
      const response = await fetch(
        `${API_BASE_URL}/api/checkUser?username=${username}&password=${password}`,
        {
          method: 'GET',
          // headers: 
          // }, 
          // body: JSON.stringify({ username, password }),{
          //   'Content-Type': 'application/json', q
        }
      );

      console.log("here reached",response, response.ok);
      if (response.ok) {          
        const result = await response.text();
        console.log("test",result,isEqual(result,"User exists and password is correct"))
        if (isEqual(result, 'User exists and password is correct')) {
          localStorage.setItem('user', username);
          navigate(`/welcome/${username}`);
        } else {
          setSubmit(true);
          console.log("insde if")
          console.error('An error occurred');
        }
      }
    } catch (error) {
      setSubmit(true);
      console.log("outside if",);
          console.error('An error occurred', error);
    }
  };

  return (
    <EntireContainer>
      <CenteredContainer>
      <LoginContainer>
        <Title>Login Page</Title>
        <Form onSubmit={handleSubmit}>
       
            <Input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setSubmit(false);
              }}
              placeholder="Username"
            />
          
          <br />
          
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          
          <br />
          <Button className='button' type="submit">Login</Button>
          <Button className='button'  onClick={(e)=>{
              e.preventDefault();
              navigate("/");
          }}>NEW USER</Button>
          {submit && (
            <ErrorMessage>
              Either username or password is wrong
            </ErrorMessage>
          )}
        </Form>
      </LoginContainer>
      </CenteredContainer>
      {/* Footer is here */}
      <Footer/>
    </EntireContainer>
  );
};
