import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllRestaurants } from "../redux/actions/restaurantAction";
import "./Css/count.css";

const CountRestaurant = () => {
  const dispatch = useDispatch();

  const { count, pureVegRestaurantsCount, showVegOnly, loading, error } =
    useSelector((state) => state.restaurants);
  const errorMessage =
    typeof error === "string" ? error : error?.message || "Something went wrong";



  return (
    <div>
      {loading ? (
        <p> Loading restaurant count...</p>
      ) : error ? (
        <p>Error: {errorMessage}</p>
      ) : (
        <p className="NumOfRestro">
          {showVegOnly ? pureVegRestaurantsCount : count}
          <span className="Restro">
            {showVegOnly
              ? pureVegRestaurantsCount === 1
                ? " restaurant"
                : " restaurants"
              : count === 1
              ? " restaurant"
              : " restaurants"}
          </span>
        </p>
      )}
      <hr></hr>
    </div>
  );
};

export default CountRestaurant;
