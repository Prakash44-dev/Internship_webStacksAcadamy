import API from "../../Utils/api";
import {
  loginRequest,
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
} from "../redux/slices/userSlice";


// LOGIN
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await API.post("/users/login", {
      email,
      password,
    });

    dispatch(loginSuccess(data.data.user));
  } catch {
    dispatch(loginFail("Login Failed"));
  }
};

// REGISTER
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await API.post(
      "/users/signup",
      userData, 
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    dispatch(loginSuccess(data.data.user));
  } catch (error) {
    dispatch(loginFail(error.response?.data?.message));
  }
};

// LOAD USER
export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await API.get("/users/me");

    dispatch(loginSuccess(data.user));
  } catch (error) {
    dispatch(loadUserFail(error.response?.data?.message));
  }
};

// UPDATE PROFILE
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateRequest());

    const { data } = await API.put("/users/me/update", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch(updateSuccess(data.success));
  } catch (error) {
    dispatch(updateFail(error.response?.data?.message));
  }
};

// UPDATE PASSWORD
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch(updateRequest());

    const { data } = await API.put(
      "/users/password/update",
      passwords
    );

    dispatch(updateSuccess(data.success));
  } catch (error) {
    dispatch(updateFail(error.response?.data?.message));
  }
};

// FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());

    const { data } = await API.post(
      "/users/forgetPassword",
      email
    );

    dispatch(forgotPasswordSuccess(data.success));
  } catch (error) {
    dispatch(forgotPasswordFail(error.response?.data?.message));
  }
};

// RESET PASSWORD
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());

    const { data } = await API.patch(
      `/users/resetPassword/${token}`,
      passwords
    );

    dispatch(resetPasswordSuccess(data.success));
  } catch (error) {
    dispatch(resetPasswordFail(error.response?.data?.message));
  }
};

// LOGOUT
export const logout = () => async (dispatch) => {
  try {
    await API.get("/users/logout");

    dispatch(logoutSuccess());
   
  } catch (error) {
    dispatch(logoutFail(error.response?.data?.message));
  }
};
