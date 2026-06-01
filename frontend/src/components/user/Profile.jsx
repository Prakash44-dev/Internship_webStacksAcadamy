import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/users/login");
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : user ? (
        <>
          <div className="row justify-content-around mt-5 user-info">
            <div className="col-12 col-md-6 col-lg-5 profile profile-card">
              <div className="profile-hero">
                <figure className="avatar avatar-profile text-center mr-3">
                  <img
                    className="rounded-circle figure-img img-fluid"
                    src={user?.avatar?.url || "/images/images.png"}
                    alt={user?.name || "User avatar"}
                  />
                </figure>
                <div className="profile-hero-copy">
                  <span>Welcome {user?.name}!</span>
                  <p className="profile-subtitle">Your account details are ready to manage here.</p>
                </div>
              </div>
              <Link
                to="/users/me/update"
                id="edit_profile"
                className="btn btn-primary btn-block my-4"
              >
                Update Profile
              </Link>
              <div className="profile-details-grid">
                <div className="profile-detail">
                  <h4>Full Name</h4>
                  <p>{user?.name}</p>
                </div>

                <div className="profile-detail">
                  <h4>Email Address</h4>
                  <p>{user?.email}</p>
                </div>

                <div className="profile-detail">
                  <h4>Phone Number</h4>
                  <p>{user?.phoneNumber || "Not added"}</p>
                </div>

                <div className="profile-detail">
                  <h4>Joined On</h4>
                  <p>{user?.createdAt ? String(user.createdAt).substring(0, 10) : "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Profile;
