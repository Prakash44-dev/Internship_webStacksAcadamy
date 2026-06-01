import api from "../../Utils/api";
import {
  loginRequest,
  loadUserRequest,
  loginSuccess,
  loginFail,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateRequest,
  updateSuccess,
  updateFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
} from "../slices/userSlice";

const getErrorMessage = (error, fallbackMessage) => {
  if (error.code === "ECONNABORTED") {
    return "Server timed out. Please check whether the backend and MongoDB are running.";
  }

  if (!error.response) {
    return "Cannot reach the server. Please make sure the backend is running on port 8000.";
  }

  return (
    error.response?.data?.message ||
    error.response?.data?.errMessage ||
    error.response?.data?.error?.message ||
    fallbackMessage
  );
};

// LOGIN
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await api.post("/users/login", {
      email: email.trim().toLowerCase(),
      password,
    });
    localStorage.setItem("token", data.token);
    dispatch(loginSuccess(data.data.user));
  } catch (error) {
    dispatch(loginFail(getErrorMessage(error, "Login Failed")));
  }
};

// REGISTER
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const payload = {
      ...userData,
      email: userData.email.trim().toLowerCase(),
    };

    const { data } = await api.post("/users/signup", payload);
    localStorage.setItem("token", data.token);
    dispatch(loginSuccess(data.data.user));
  } catch (error) {
    dispatch(loginFail(getErrorMessage(error, "Registration Failed")));
  }
};

// LOAD USER
export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loadUserRequest());
    const { data } = await api.get("/users/me");
    dispatch(loginSuccess(data.user));
  } catch (error) {
    dispatch(loadUserFail(getErrorMessage(error, "Failed to load user")));
  }
};

// UPDATE PROFILE
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateRequest());
    const { data } = await api.put("/users/me/update", userData);
    dispatch(updateSuccess(data.success));
  } catch (error) {
    dispatch(updateFail(getErrorMessage(error, "Failed to update profile")));
  }
};

// UPDATE PASSWORD
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch(updateRequest());
    const { data } = await api.put("/users/password/update", passwords);
    dispatch(updateSuccess(data.success));
  } catch (error) {
    dispatch(updateFail(getErrorMessage(error, "Failed to update password")));
  }
};

// FORGOT PASSWORD
export const forgotPassword = (emailData) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const { data } = await api.post("/users/forgetPassword", emailData);
    dispatch(forgotPasswordSuccess(data.message || "Reset email sent"));
  } catch (error) {
    dispatch(forgotPasswordFail(getErrorMessage(error, "Failed to send reset email")));
  }
};

// RESET PASSWORD
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    const { data } = await api.patch(`/users/resetPassword/${token}`, passwords);
    dispatch(resetPasswordSuccess(data.success));
  } catch (error) {
    dispatch(resetPasswordFail(getErrorMessage(error, "Failed to reset password")));
  }
};

// LOGOUT
export const logout = () => async (dispatch) => {
  try {
    await api.get("/users/logout");
    localStorage.removeItem("token");
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFail(getErrorMessage(error, "Logout Failed")));
  }
};
