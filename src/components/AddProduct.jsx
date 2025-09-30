import React, { useState, useRef, useEffect } from "react";

// helper component for repeatable fields like tags, ingredients, etc.
const TagInput = ({ label, values, setValues }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newValue = inputValue.trim();
      if (newValue && !values.includes(newValue)) {
        setValues([...values, newValue]);
      }
      setInputValue("");
    }
  };

  const removeValue = (indexToRemove) => {
    setValues(values.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type="text"
        className="w-full border px-3 py-2 rounded mb-2"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter or comma"
      />
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <div
            key={index}
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full flex items-center text-sm"
          >
            {value}
            <button
              type="button"
              onClick={() => removeValue(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const subcategories = {
  // Apparel: ["Shirts", "Shorts", "Shoes"],
  // Equipment: ["Balls", "Bats", "Gloves"],
  // Nutrition: ["Protein", "Vitamins", "Snacks"],
  Apparel: ["Footwear", "Topwear", "Winterwear","Bottomwear","Innerwear/Loungewear","Gym-Wear"],
  Equipment: ["Balls", "Bats", "Gloves","Shoes","Bags","Leg-Gaurds","Protective Gear","Stumps"],
  Nutrition: ["Protein", "Weight Gainer", "Pre-Workout","Creatine","Vegan","Vitamin & Mineral Capsules"],
};

const AddProduct = ({ onClose, onSave, initialData = null }) => {
  const isEditing = !!initialData;

  const [productData, setProductData] = useState({
    productName: "",
    productBrand: "",
    productCategory: "",
    productSubCategory: "",
    productDescription: "",
    productDiscount: "",
    productTags: [],
    // Category-specific details
    apparelDetails: {
      material: "",
      gender: "Unisex",
      fit: "",
      careInstructions: [],
    },
    equipmentDetails: { weight: "", dimensions: "", material: "", usage: "" },
    nutritionDetails: {
      servingSize: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      ingredients: [],
      allergens: [],
    },
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    sku: "",
    size: "",
    color: [],
    flavor: "",
    price: "",
    stock: "",
  });

  const overlayRef = useRef();

  useEffect(() => {
    if (isEditing && initialData) {
      // Populate form with initial data for editing
      const { productVarient, productImages, ...mainData } = initialData;

      setProductData({
        productName: mainData.productName || "",
        productBrand: mainData.productBrand || "",
        productCategory: mainData.productCategory || "",
        productSubCategory: mainData.productSubCategory || "",
        productDescription: mainData.productDescription || "",
        productDiscount: mainData.productDiscount || "",
        productTags: mainData.productTags || [],
        // Populate category-specific details
        apparelDetails: mainData.apparelDetails || {
          material: "",
          gender: "Unisex",
          fit: "",
          careInstructions: [],
        },
        equipmentDetails: mainData.equipmentDetails || {
          weight: "",
          dimensions: "",
          material: "",
          usage: "",
        },
        nutritionDetails: mainData.nutritionDetails || {
          servingSize: "",
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
          ingredients: [],
          allergens: [],
        },
      });

      setVariants(
        productVarient.map((v) => ({ ...v, id: v._id || v.id })) || []
      );

      // For images, we can't create File objects from URLs.
      // We'll just display existing image URLs and allow adding new files.
      // A more complex implementation could track existing images for removal.
      // For now, we'll just show them. The backend will append new images.
      // We'll store the existing image URLs to display them.
      // This part is left as a UI display task if needed, as we can't repopulate the file input.
    }
  }, [initialData, isEditing]);

  // Close if click outside overlay form
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "productCategory") {
      // reset subcategory when category changes
      setProductData({ ...productData, [name]: value, productSubCategory: "" });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleCategoryDetailsChange = (category, e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [`${category}Details`]: {
        ...prev[`${category}Details`],
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // --- variant management ---
  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setCurrentVariant({ ...currentVariant, [name]: value });
  };

  const handleAddVariant = () => {
    //validation for variant
    if (!currentVariant.price || !currentVariant.stock) {
      alert("Variant must have at least a price and stock.");
      return;
    }
    setVariants([...variants, { ...currentVariant, id: Date.now() }]);
    //reset current variant form
    setCurrentVariant({
      sku: "",
      size: "",
      color: [],
      flavor: "",
      price: "",
      stock: "",
    });
  };

  const handleRemoveVariant = (idToRemove) => {
    setVariants(variants.filter((v) => v.id !== idToRemove));
  };
  // --- end variant management ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (
      !productData.productName ||
      !productData.productBrand ||
      !productData.productCategory ||
      !productData.productSubCategory ||
      variants.length === 0
    ) {
      alert(
        "Please fill all required fields: Name, Brand, Category, SubCategory, and at least one Variant."
      );
      return;
    }

    const formData = new FormData();

    // append main product data, handling arrays correctly
    Object.keys(productData).forEach((key) => {
      if (!key.endsWith("Details")) {
        const value = productData[key];
        if (Array.isArray(value)) {
          // For `productTags`, which is an array of strings, we must append each
          // item separately for `multipart/form-data` to be parsed as an array on the backend.
          if (key === "productTags") {
            value.forEach((tag) => formData.append("productTags", tag));
          } else {
            formData.append(key, JSON.stringify(value));
          }
        } else {
          formData.append(key, value);
        }
      }
    });

    // append category-specific details
    if (productData.productCategory) {
      const detailsKey = `${productData.productCategory.toLowerCase()}Details`;
      const details = productData[detailsKey];
      // ensuring array fields inside details are stringified
      const stringifiedDetails = { ...details };
      Object.keys(stringifiedDetails).forEach((k) => {
        if (Array.isArray(stringifiedDetails[k])) {
          stringifiedDetails[k] = JSON.stringify(stringifiedDetails[k]);
        }
      });
      formData.append(detailsKey, JSON.stringify(productData[detailsKey]));
    }

    // append variants
    const variantsToSubmit = variants.map(({ id, ...rest }) => rest);
    formData.append("productVarient", JSON.stringify(variantsToSubmit));

    // append images
    images.forEach((imageFile) => {
      formData.append("productImages", imageFile);
    });

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose(); // Close modal on success
    } catch (error) {
      // Error is handled in Products.jsx, but we stop the loading state here
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- render functions for category fields ---
  const renderApparelFields = () => (
    <div className="p-4 border-t mt-4 space-y-4">
      <h3 className="font-semibold text-lg">Apparel Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="material"
          placeholder="Material (e.g., Cotton)"
          value={productData.apparelDetails.material}
          onChange={(e) => handleCategoryDetailsChange("apparel", e)}
          className="w-full border px-3 py-2 rounded"
        />
        <select
          name="gender"
          value={productData.apparelDetails.gender}
          onChange={(e) => handleCategoryDetailsChange("apparel", e)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Unisex">Unisex</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
        </select>
        <input
          name="fit"
          placeholder="Fit (e.g., Regular)"
          value={productData.apparelDetails.fit}
          onChange={(e) => handleCategoryDetailsChange("apparel", e)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <TagInput
        label="Care Instructions"
        values={productData.apparelDetails.careInstructions}
        setValues={(newValues) =>
          setProductData((p) => ({
            ...p,
            apparelDetails: {
              ...p.apparelDetails,
              careInstructions: newValues,
            },
          }))
        }
      />
    </div>
  );

  const renderEquipmentFields = () => (
    <div className="p-4 border-t mt-4 space-y-4">
      <h3 className="font-semibold text-lg">Equipment Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <input
          name="weight"
          placeholder="Weight (e.g., 5kg)"
          value={productData.equipmentDetails.weight}
          onChange={(e) => handleCategoryDetailsChange("equipment", e)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="dimensions"
          placeholder="Dimensions (e.g., 10x5x3 cm)"
          value={productData.equipmentDetails.dimensions}
          onChange={(e) => handleCategoryDetailsChange("equipment", e)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="material"
          placeholder="Material (e.g., Steel)"
          value={productData.equipmentDetails.material}
          onChange={(e) => handleCategoryDetailsChange("equipment", e)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="usage"
          placeholder="Usage (e.g., Strength Training)"
          value={productData.equipmentDetails.usage}
          onChange={(e) => handleCategoryDetailsChange("equipment", e)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
    </div>
  );

  const renderNutritionFields = () => (
    <div className="p-4 border-t mt-4 space-y-4">
      <h3 className="font-semibold text-lg">Nutrition Details</h3>
      <div className="grid grid-cols-3 gap-4">
        <input
          name="servingSize"
          placeholder="Serving Size"
          value={productData.nutritionDetails.servingSize}
          onChange={(e) => handleCategoryDetailsChange("nutrition", e)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="calories"
          placeholder="Calories"
          value={productData.nutritionDetails.calories}
          onChange={(e) => handleCategoryDetailsChange("nutrition", e)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="protein"
          placeholder="Protein (g)"
          value={productData.nutritionDetails.protein}
          onChange={(e) => handleCategoryDetailsChange("nutrition", e)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="carbs"
          placeholder="Carbs (g)"
          value={productData.nutritionDetails.carbs}
          onChange={(e) => handleCategoryDetailsChange("nutrition", e)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="fat"
          placeholder="Fat (g)"
          value={productData.nutritionDetails.fat}
          onChange={(e) => handleCategoryDetailsChange("nutrition", e)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <TagInput
        label="Ingredients"
        values={productData.nutritionDetails.ingredients}
        setValues={(newValues) =>
          setProductData((p) => ({
            ...p,
            nutritionDetails: { ...p.nutritionDetails, ingredients: newValues },
          }))
        }
      />
      <TagInput
        label="Allergens"
        values={productData.nutritionDetails.allergens}
        setValues={(newValues) =>
          setProductData((p) => ({
            ...p,
            nutritionDetails: { ...p.nutritionDetails, allergens: newValues },
          }))
        }
      />
    </div>
  );
  // --- end render functions ---

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 overflow-y-auto max-h-[80vh] pr-2"
        >
          {/* main details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <select
              name="productCategory"
              value={productData.productCategory}
              onChange={handleInputChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="" disabled>
                Select Category *
              </option>
              <option>Apparel</option>
              <option>Nutrition</option>
              <option>Equipment</option>
            </select>
            <select
              name="productSubCategory"
              value={productData.productSubCategory}
              onChange={handleInputChange}
              required
              className="w-full border px-3 py-2 rounded"
              disabled={!productData.productCategory}
            >
              <option value="" disabled>
                Select SubCategory *
              </option>
              {productData.productCategory &&
                subcategories[productData.productCategory] &&
                subcategories[productData.productCategory].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>

            <input
              name="productName"
              placeholder="Product Name *"
              value={productData.productName}
              onChange={handleInputChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="productBrand"
              placeholder="Product Brand *"
              value={productData.productBrand}
              onChange={handleInputChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <textarea
            name="productDescription"
            placeholder="Product Description"
            value={productData.productDescription}
            onChange={handleInputChange}
            rows="3"
            className="w-full border px-3 py-2 rounded"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="productDiscount"
              placeholder="Discount (e.g., 10%)"
              value={productData.productDiscount}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
            <TagInput
              label="Product Tags"
              values={productData.productTags}
              setValues={(newValues) =>
                setProductData((p) => ({ ...p, productTags: newValues }))
              }
            />
          </div>

          {/* category specific fields */}
          {productData.productCategory === "Apparel" && renderApparelFields()}
          {productData.productCategory === "Equipment" &&
            renderEquipmentFields()}
          {productData.productCategory === "Nutrition" &&
            renderNutritionFields()}

          {/* variant management */}
          <div className="p-4 border-t mt-4 space-y-4">
            <h3 className="font-semibold text-lg">Product Variants *</h3>
            {/* added variants list */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className="bg-gray-100 p-2 rounded flex justify-between items-center text-sm"
                >
                  <span className="truncate">
                    {variant.sku && `SKU: ${variant.sku}, `}
                    {variant.size && `Size: ${variant.size}, `}
                    {variant.flavor && `Flavor: ${variant.flavor}, `}
                    Price: {variant.price}, Stock: {variant.stock}
                    {variant.color.length > 0 &&
                      `, Colors: ${variant.color.join("/")}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(variant.id)}
                    className="text-red-500 hover:text-red-700 ml-4 flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {variants.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No variants added yet. At least one is required.
                </p>
              )}
            </div>
            {/* form to add a new variant */}
            <div className="p-3 border rounded-md space-y-3 bg-gray-50">
              <h4 className="font-medium">Add a Variant</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <input
                  name="sku"
                  placeholder="SKU"
                  value={currentVariant.sku}
                  onChange={handleVariantChange}
                  className="w-full border px-3 py-2 rounded"
                />
                {productData.productCategory === "Apparel" && (
                <input
                  name="size"
                  placeholder="Size (e.g., M, L)"
                  value={currentVariant.size}
                  onChange={handleVariantChange}
                  className="w-full border px-3 py-2 rounded"
                />
                )}
                {productData.productCategory === "Nutrition" && (
                  <input
                    name="flavor"
                    placeholder="Flavor"
                    value={currentVariant.flavor}
                    onChange={handleVariantChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                )}
                <input
                  name="price"
                  type="number"
                  placeholder="Price (INR) *"
                  value={currentVariant.price}
                  onChange={handleVariantChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  name="stock"
                  type="number"
                  placeholder="Stock *"
                  value={currentVariant.stock}
                  onChange={handleVariantChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <TagInput
                label="Colors"
                values={currentVariant.color}
                setValues={(newValues) =>
                  setCurrentVariant((v) => ({ ...v, color: newValues }))
                }
              />
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                + Add Variant
              </button>
            </div>
          </div>
          {/* product images upload */}
          <div>
            <label className="block mb-1 font-medium">Upload Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border px-3 py-2 rounded"
            />
            {isEditing && initialData.productImages.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Existing Images:
                </p>
                <div className="flex flex-wrap gap-3">
                  {initialData.productImages.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={`Existing ${index}`}
                      className="w-[80px] h-[80px] object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}
            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${index}`}
                      className="w-[80px] h-[80px] object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:scale-110"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* buttons to cancel and save */}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Product"
                : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
