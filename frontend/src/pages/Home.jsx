import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { googleProvider } from "../firebase";
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../firebase";

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [userSigned, setUserSigned] = useState(false);

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setUserSigned(true);
      toast.success("Signed up successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUserSigned(true);
      toast.success("Signed in successfully!");
    } catch (error) {
      console.error('Error signing in:', error.code, error.message);
      toast.error('Email or Password is incorrect');
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUserSigned(false);
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setUserSigned(true);
      toast.success("Signed in with Google successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const toggleSignIn = () => {
    setIsSignIn(!isSignIn);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserSigned(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center ml-[18vh] ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      
            {!userSigned && 
            <>
            <h1 className="text-4xl pb-6 text-center font-bold text-[#2E8B57]"> FitBuddy</h1>
              <h2 className="text-2xl font-semibold mb-16 text-center text-black">
          {isSignIn ? "Sign In" : "Sign Up"}
        <p className="text-xs">Trial Email - test123@gmail.com</p>
        <p  className="text-xs">Trial Password - test@password</p>
        </h2>

        {!userSigned && (
          <button
          onClick={signInWithGoogle}
            className="p-2 border-2 border-black font-medium text-black rounded w-full mb-4"
          >
            Sign in with Google
          </button>
        )}

        <input
          aria-label="Email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          aria-label="Password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        />

        {isSignIn ? (
          <>
            <button
              onClick={signIn}
              className="w-full p-2 mb-4 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Sign in
            </button>
            <div className="text-center text-sm">
              New user?{" "}
              <button
                onClick={toggleSignIn}
                className="text-blue-500 hover:underline"
              >
                Sign up
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={signUp}
              className="w-full p-2 mb-4 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </button>
            <div className="text-center text-sm">
              Already Registered?{" "}
              <button
                onClick={toggleSignIn}
                className="text-blue-500 hover:underline"
              >
                Sign in
              </button>
            </div>
          </>
        )}</>}

        {userSigned && (
          <>
          <div className="text-center"> See you soon 👋 </div>
          <button
            onClick={logOut}
            className="w-full p-2 mt-6 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Logout
          </button>
          </>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}

export default Home;

/* 
return (
  <div className="min-h-screen flex items-center justify-center ml-[18vh] ">
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      {!userSigned && (
        <>
          <h2 className="text-2xl font-semibold mb-16 text-center text-black">
            {isSignIn ? "Sign In" : "Sign Up"}
          </h2>

          {/* {!userSigned && (
            <button
              onClick={signInWithGoogle}
              className="p-2 border-2 border-black font-medium text-black rounded w-full mb-4"
            >
              Sign in with Google
            </button>
          )}}

          {isSignIn ? (
            <>
              <button
                onClick={signIn}
                className="w-full p-2 mb-4 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Sign in
              </button>
              <div className="text-center text-sm">
                New user?{" "}
                <button
                  onClick={toggleSignIn}
                  className="text-blue-500 hover:underline"
                >
                  Sign up
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={signUp}
                className="w-full p-2 mb-4 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </button>
              <div className="text-center text-sm">
                Already Registered?{" "}
                <button
                  onClick={toggleSignIn}
                  className="text-blue-500 hover:underline"
                >
                  Sign in
                </button>
              </div>
            </>
          )}
        </>
      )}

      {{userSigned && (
        <>
          <div className="text-center"> See you soon </div>
          <button
            onClick={logOut}
            className="w-full p-2 mt-6 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Logout
          </button>
        </>
      )} }

      <ToastContainer />
    </div>
  </div>
);


*/
