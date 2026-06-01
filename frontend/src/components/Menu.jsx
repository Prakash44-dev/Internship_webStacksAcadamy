import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getMenus } from "../redux/actions/menuAction.js";
import FoodItem from "./Fooditem";

const Menu = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { menus, loading, error } = useSelector((state) => state.menus);
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || "Something went wrong";

  useEffect(() => {
    dispatch(getMenus(id));
  }, [dispatch, id]);

  return (
    <div className="container mt-4">
      {loading ? (
        <p>Loading menus...</p>
      ) : error ? (
        <p>Error: {errorMessage}</p>
      ) : Array.isArray(menus) && menus.length > 0 ? (
        menus.map((menu) => (
          <div key={menu._id} className="mb-4">
            <div className="d-flex align-items-center">
              <h2 className="mr-2">{menu.category}</h2>
            </div>

            <hr />

            {Array.isArray(menu.items) && menu.items.length > 0 ? (
              <div className="row">
                {menu.items.map((fooditem) => (
                  <FoodItem
                    key={fooditem._id}
                    fooditem={fooditem}
                    restaurant={id}
                  />
                ))}
              </div>
            ) : (
              <p>No items available</p>
            )}
          </div>
        ))
      ) : (
        <p>No menus Available</p>
      )}
    </div>
  );
};

export default Menu;
