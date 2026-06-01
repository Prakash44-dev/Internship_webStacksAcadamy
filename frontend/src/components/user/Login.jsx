import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions/userAction";
import { clearErrors } from "../../redux/slices/userSlice";

import { toast } from "react-toastify"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.user
  );

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful"); 
      navigate("/");
    }

    if (error) {
      toast.error(error); 
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, error, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please enter both email and password");
      return;
    }

    dispatch(login(email, password));
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg mentor-form-card" onSubmit={submitHandler}>
          <h1 className="auth-heading mb-3">Login</h1>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Link to="/users/forgetPassword" className="float-right mb-4">
            Forgot Password
          </Link>

          <button className="btn btn-block py3" disabled={!isFormValid || loading}>
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>

          <Link to="/users/signup" className="float-right mt-3">
            NEW USER?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
