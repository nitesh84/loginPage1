import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import {isEqual} from 'lodash'
 
export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submit,setSubmit]=useState(false);
 
  
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);


    try {
      // Send the login data to the backend API
      
      const response = await fetch(`http://localhost:5000/checkUser?username=${username}&password=${password}`, {
      method: 'GET',
      // headers: {
       
      //   'Content-Type': 'application/json',
      // },
      // body: JSON.stringify({ username, password }),
    });

console.log(response,response.ok);
      if (response.ok) {
        const result = await response.text();
        console.log("asdasd",result,isEqual(result, 'User exists and password is correct') );
        if(isEqual(result, 'User exists and password is correct')   ) 
        { 
          localStorage.setItem("user",username);
          navigate(`/welcome/${username}`);
        } else {
          console.error('An error occurred');
      }
       
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => 
              {
                setUsername(e.target.value)
                setSubmit(false)
              }
            }

            placeholder="Username"
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </label>
        <br />
        <button type="submit">Submit</button>
        {submit && <p style={{color:"red"}}>Either username or password is wrong</p>}
      </form>
    </div>
  );
};
