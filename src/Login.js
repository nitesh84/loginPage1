import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isEqual } from 'lodash';
import styled from 'styled-components';
import './global.css'

const EntireContainer = styled.div`
  background: linear-gradient(to bottom right, #ff8a00, #e52e71);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 18vw;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 10px;
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
        `http://localhost:5000/checkUser?username=${username}&password=${password}`,
        {
          method: 'GET',
          // headers: {
          //   'Content-Type': 'application/json',
          // },
          // body: JSON.stringify({ username, password }),
        }
      );

      console.log(response, response.ok);
      if (response.ok) {
        const result = await response.text();
        if (isEqual(result, 'User exists and password is correct')) {
          localStorage.setItem('user', username);
          navigate(`/welcome/${username}`);
        } else {
          setSubmit(true);
          console.error('An error occurred');
        }
      }
    } catch (error) {
      setSubmit(true);
      console.error('An error occurred', error);
    }
  };

  return (
    <EntireContainer>
      <LoginContainer>
        <Title>Login Page</Title>
        <Form onSubmit={handleSubmit}>
          <Label>
            Username:
            <Input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setSubmit(false);
              }}
              placeholder="Username"
            />
          </Label>
          <br />
          <Label>
            Password:
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Label>
          <br />
          <Button className='button' type="submit">Submit</Button>
          {submit && (
            <ErrorMessage>
              Either username or password is wrong
            </ErrorMessage>
          )}
        </Form>
      </LoginContainer>
    </EntireContainer>
  );
};
