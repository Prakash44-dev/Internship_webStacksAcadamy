import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfile,
  loadUser,
} from "../../redux/actions/userAction";

import {
  clearErrors,
  updateReset,
} from "../../redux/slices/userSlice";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({});
  const [avatar, setAvatar] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error, isUpdated, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const name = formData.name ?? user?.name ?? "";
  const email = formData.email ?? user?.email ?? "";
  const city = formData.city ?? user?.city ?? "Bangalore";
  const address = formData.address ?? user?.address ?? "";
  const avatarPreview = avatar || user?.avatar?.url || "/images/images.png";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/users/login");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("User updated successfully");

      dispatch(loadUser());
      navigate("/users/me");

      dispatch(updateReset());
    }
  }, [dispatch, error, navigate, isAuthenticated, isUpdated, loading]);

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      city,
      address,
    };

    if (avatar) {
      userData.avatar = avatar;
    }

    dispatch(updateProfile(userData));
  };

  const onChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        const img = new Image();
        img.onload = () => {
          const maxDim = 300;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          setAvatar(compressed);
        };
        img.src = reader.result;
      }
    };

    reader.readAsDataURL(file);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="row wrapper">
        <div className="col-10 col-lg-5 updateprofile">
          <form
            className="shadow-lg mentor-form-card"
            onSubmit={submitHandler}
          >
            <h1 className="page-heading">Update Profile</h1>
            <p className="page-subtitle">
              Keep your account details current so your profile stays accurate.
            </p>

            <div className="form-group">
              <label htmlFor="name_field">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={onInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="city_field">Your City / Location</label>
              <select
                id="city_field"
                className="form-control"
                name="city"
                value={city}
                onChange={onInputChange}
              >
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address_field">Delivery Address / Locality</label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                name="address"
                placeholder="e.g. Koramangala 5th Block, Indiranagar, etc."
                value={address}
                onChange={onInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>

              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img
                      src={avatarPreview}
                      className="rounded-circle"
                      alt="Avatar Preview"
                    />
                  </figure>
                </div>

                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    className="custom-file-input"
                    id="customFile"
                    accept="image/*"
                    onChange={onChange}
                  />
                  <label
                    className="custom-file-label"
                    htmlFor="customFile"
                  >
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-block py-3"
              disabled={loading}
            >
              {loading ? "UPDATING..." : "UPDATE"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
