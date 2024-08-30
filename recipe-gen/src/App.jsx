
import Home from "./pages/Home";
import "./index.css";
import { auth } from "./firebase";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import Recipes from "./pages/Recipes";
import Bookmarks from "./pages/Bookmarks";
import ShoppingList from "./pages/ShoppingList";
import GoalTracking from "./pages/GoalTracking";
import SideBar from "./pages/SideBar";
import Profile from "./pages/Profile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <>
      <div>
        <BrowserRouter>
          <div className="flex gap-[15vh]">
            <div className="w-[35vh]">
              {isLoggedIn && (
                <div className="fixed h-screen w-[45vh]">
                  <SideBar />
                </div>
              )}
            </div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/goaltracking" element={<GoalTracking />} />
              <Route path="/shoppinglist" element={<ShoppingList />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
