import React, { useEffect } from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import MenuPage from "./components/MenuPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import store from "./redux/store";
import { loadUser } from "./redux/actions/userAction";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";
import UpdateProfile from "./components/user/UpdateProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./components/cart/Cart";
import OrderSuccessRestored from "./components/cart/OrderSuccessRestored";
import ListOrdersRestored from "./components/order/ListOrdersRestored";
import OrderDetailsRestored from "./components/order/OrderDetailsRestored";
import CulinaryCanvas from "./components/layout/CulinaryCanvas";

function App() {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.dispatch(loadUser());
    }
  }, []);

  return (
    <>
    <ToastContainer/>
    <Router>
      <div className="App">
        <CulinaryCanvas />
        <Header />

        <div className="app-shell mt-4">
          <Routes>
            <Route path='/' element={<Home />} exact/>
            <Route path="/eats/stores/search/:keyword" element={<Home />} exact/>
            <Route path="/eats/stores/:id/menus" element={<MenuPage />} />
            <Route path="/users/login" element={<Login/>} />
            <Route path="/users/signup" element={<Register/>} />
            <Route path="/users/forgetPassword" element={<ForgotPassword/>} />
            <Route path="/users/resetPassword/:token" element={<NewPassword/>} />
            <Route path="/users/me" element={<Profile/>} />
            <Route path="/users/me/update" element={<UpdateProfile/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/success" element={<OrderSuccessRestored/>} />
            <Route path="/eats/orders/me/myOrders" element={<ListOrdersRestored/>} />
            <Route path="/eats/orders/:id" element={<OrderDetailsRestored/>} />

          </Routes>
        </div>

        <Footer />
      </div>
    </Router></>
  );
}

export default App;
