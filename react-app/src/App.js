import React, { useState } from 'react';
import "./App.css"

const LoginPage = () => {
  const [name, setUsername] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [res,setRes] = useState('');

  
  function handleLogin () {
    
    fetch('http://13.112.217.190:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'request-date': 'Wed, 22 Feb 2023 16:47:36 GMT'
      },
      body: JSON.stringify({ name, password, email })
    })
      .then(response => {
        return response.json()
      })
      .then(message => {
        message = JSON.stringify(message)
        setRes(message)
        console.log(res)
      })
      .then(data => {
        if (data.success) {
          // Redirect to dashboard or home page
          console.log('Login successful!');
        } else {
          // Display error message to user
          console.log(`Login failed: ${data.message}`);
        }
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="Login">
      <h2>Login</h2>
      <form>
        <div class Name >
          <label htmlFor="name">Username:</label>
          <input
            type="name"
            id="name"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleLogin}>Log In</button>
        <div className="resp" >
          <p>{res}</p>
        </div>
      </form>
    </div>
    
  );
};

export default LoginPage;

