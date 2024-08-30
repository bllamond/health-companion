import React from "react";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";
const auth = getAuth();
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function createUser() {
    signInWithEmailAndPassword(auth, email, password)
      .then(console.log('login success'))
      .catch(err => console.log(err));
  }
  return (
    <div className="login-page">
      <h1>Login Page</h1>
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Enter your Email here"
      />
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Enter your password here"
      />
      <button onClick={createUser}>Sign Up</button>
    </div>
  );
}

export default Login;
