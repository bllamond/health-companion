import React from "react";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";
const auth = getAuth();
function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function createUser() {
    createUserWithEmailAndPassword(auth, email, password).then(
      alert('Success')
    );
  }
  return (
    <div className="signup-page">
        <h1>Sign Up page</h1>
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

export default Signup;
