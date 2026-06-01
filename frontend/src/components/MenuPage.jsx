import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addItemToMenu, createMenu, getMenus } from "../redux/actions/menuAction.js";
import api from "../Utils/api.js";
import FoodItem from "./Fooditem";

const initialFoodForm = {
  category: "",
  name: "",
  price: "",
  description: "",
  spiceLevel: "medium",
  stock: "",
  imageUrl: "",
};

const MenuPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [foodForm, setFoodForm] = useState(initialFoodForm);
  const [submittingCategory, setSubmittingCategory] = useState(false);
  const [submittingFood, setSubmittingFood] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState("");
  const [deletingFoodId, setDeletingFoodId] = useState("");

  const { menus, loading, error, menuId } = useSelector((state) => state.menus);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || "Something went wrong";
  const isAdmin = isAuthenticated && user?.role === "admin";
  const categories = useMemo(
    () => (Array.isArray(menus) ? menus.map((menu) => menu.category) : []),
    [menus],
  );

  useEffect(() => {
    dispatch(getMenus(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (categories.length > 0) {
      setFoodForm((current) => ({
        ...current,
        category: current.category || categories[0],
      }));
    }
  }, [categories]);

  const refreshMenus = async () => {
    await dispatch(getMenus(id));
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    setSubmittingCategory(true);

    try {
      await dispatch(createMenu({ restaurantId: id, category: categoryName })).unwrap();
      await refreshMenus();
      setCategoryName("");
      setShowCategoryModal(false);
      toast.success("Menu category created");
    } catch (createError) {
      toast.error(createError || "Unable to create menu category");
    } finally {
      setSubmittingCategory(false);
    }
  };

  const openFoodModal = (category = "") => {
    setFoodForm({
      ...initialFoodForm,
      category: category || categories[0] || "",
    });
    setShowFoodModal(true);
  };

  const handleCreateFoodItem = async (event) => {
    event.preventDefault();
    setSubmittingFood(true);

    try {
      const { data } = await api.post("/eats/item", {
        name: foodForm.name,
        price: Number(foodForm.price),
        description: foodForm.description,
        spiceLevel: foodForm.spiceLevel,
        stock: Number(foodForm.stock),
        imageUrl: foodForm.imageUrl,
        restaurant: id,
      });

      await dispatch(
        addItemToMenu({
          menuId,
          category: foodForm.category,
          foodItemId: data.data._id,
          restaurantId: id,
        }),
      ).unwrap();

      await refreshMenus();
      setShowFoodModal(false);
      toast.success("Food item created");
    } catch (createError) {
      toast.error(
        createError?.response?.data?.message || createError || "Unable to create food item",
      );
    } finally {
      setSubmittingFood(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Delete "${category}" from this restaurant?`)) {
      return;
    }

    setDeletingCategory(category);

    try {
      await api.delete(`/eats/stores/${id}/menus/${menuId}`, {
        data: { category },
      });
      await refreshMenus();
      toast.success("Menu category deleted");
    } catch (deleteError) {
      toast.error(
        deleteError?.response?.data?.message || "Unable to delete menu category",
      );
    } finally {
      setDeletingCategory("");
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm("Delete this food item?")) {
      return;
    }

    setDeletingFoodId(foodId);

    try {
      await api.delete(`/eats/item/${foodId}`);
      await refreshMenus();
      toast.success("Food item deleted");
    } catch (deleteError) {
      toast.error(
        deleteError?.response?.data?.message || "Unable to delete food item",
      );
    } finally {
      setDeletingFoodId("");
    }
  };

  const handleAiDescriptionClick = () => {
    if (!foodForm.name.trim() || !foodForm.category || !foodForm.price) {
      toast.error("Enter food name, category and price before using AI desc.");
      return;
    }

    setSubmittingFood(true);

    api
      .post("/ai/food-description", {
        name: foodForm.name,
        category: foodForm.category,
        spiceLevel: foodForm.spiceLevel,
        price: Number(foodForm.price),
      })
      .then(({ data }) => {
        setFoodForm((current) => ({
          ...current,
          description: data.aiData?.description || current.description,
        }));
        toast.success("AI description generated");
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Unable to generate AI description",
        );
      })
      .finally(() => {
        setSubmittingFood(false);
      });
  };

  return (
    <div className="container mt-4">
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-page-title">Restaurant Menu</h1>
          <p className="admin-page-subtitle">
            Manage menu categories and food items for this restaurant.
          </p>
        </div>

        {isAdmin ? (
          <div className="admin-toolbar__actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCategoryModal(true)}
            >
              + Add Menu
            </button>
            {categories.length > 0 ? (
              <button
                type="button"
                className="btn btn-success"
                onClick={() => openFoodModal()}
              >
                + Add Food Item
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {loading ? (
        <p>Loading menus...</p>
      ) : error ? (
        <p>Error: {errorMessage}</p>
      ) : Array.isArray(menus) && menus.length > 0 ? (
        menus.map((menu) => (
          <div key={menu.category} className="mb-4">
            <div className="d-flex align-items-center justify-content-between admin-section-header">
              <h2 className="mr-2">{menu.category}</h2>
              {isAdmin ? (
                <div className="admin-section-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openFoodModal(menu.category)}
                  >
                    + Item
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteCategory(menu.category)}
                    disabled={deletingCategory === menu.category}
                  >
                    {deletingCategory === menu.category ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ) : null}
            </div>

            <hr />

            {Array.isArray(menu.items) && menu.items.length > 0 ? (
              <div className="row">
                {menu.items.map((fooditem) => (
                  <FoodItem
                    key={fooditem._id}
                    fooditem={fooditem}
                    restaurant={id}
                    isAdmin={isAdmin}
                    onDelete={handleDeleteFood}
                    deleting={deletingFoodId === fooditem._id}
                  />
                ))}
              </div>
            ) : (
              <p>No items available</p>
            )}
          </div>
        ))
      ) : (
        <div className="admin-empty-state">
          <p>No menus available.</p>
          {isAdmin ? (
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={() => setShowCategoryModal(true)}
            >
              + Add Menu
            </button>
          ) : null}
        </div>
      )}

      {showCategoryModal ? (
        <div className="create-modal" onClick={() => setShowCategoryModal(false)}>
          <div
            className="create-content"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Add Menu</h2>
            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label htmlFor="menu-category">Menu Category</label>
                <input
                  id="menu-category"
                  className="form-control"
                  placeholder="e.g. Chats"
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  required
                />
              </div>

              <div className="admin-modal-actions">
                <button type="submit" className="btn btn-primary" disabled={submittingCategory}>
                  {submittingCategory ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showFoodModal ? (
        <div className="create-modal" onClick={() => setShowFoodModal(false)}>
          <div
            className="create-content"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Add Food Item</h2>
            <form onSubmit={handleCreateFoodItem}>
              <div className="form-group">
                <label htmlFor="food-category">Menu Category</label>
                <select
                  id="food-category"
                  className="form-control"
                  value={foodForm.category}
                  onChange={(event) =>
                    setFoodForm((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="food-name">Name</label>
                <input
                  id="food-name"
                  className="form-control"
                  value={foodForm.name}
                  onChange={(event) =>
                    setFoodForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="food-price">Price</label>
                <input
                  id="food-price"
                  type="number"
                  min="0"
                  className="form-control"
                  value={foodForm.price}
                  onChange={(event) =>
                    setFoodForm((current) => ({
                      ...current,
                      price: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="food-spice-level">Spice Level</label>
                <select
                  id="food-spice-level"
                  className="form-control"
                  value={foodForm.spiceLevel}
                  onChange={(event) =>
                    setFoodForm((current) => ({
                      ...current,
                      spiceLevel: event.target.value,
                    }))
                  }
                >
                  <option value="mild">Mild</option>
                  <option value="medium">Medium</option>
                  <option value="hot">Hot</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="food-description">Description</label>
                <div className="admin-inline-field">
                  <input
                    id="food-description"
                    className="form-control"
                    value={foodForm.description}
                    onChange={(event) =>
                      setFoodForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={handleAiDescriptionClick}
                    disabled={submittingFood}
                  >
                    {submittingFood ? "Generating..." : "AI desc"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="food-stock">Stock</label>
                <input
                  id="food-stock"
                  type="number"
                  min="0"
                  className="form-control"
                  value={foodForm.stock}
                  onChange={(event) =>
                    setFoodForm((current) => ({
                      ...current,
                      stock: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="food-image">Image URL</label>
                <input
                  id="food-image"
                  className="form-control"
                  placeholder="https://..."
                  value={foodForm.imageUrl}
                  onChange={(event) =>
                    setFoodForm((current) => ({
                      ...current,
                      imageUrl: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="admin-modal-actions">
                <button type="submit" className="btn btn-primary" disabled={submittingFood}>
                  {submittingFood ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowFoodModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MenuPage;
