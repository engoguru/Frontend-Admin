const API_BASE_URL = "http://localhost:5002"; // Make sure this matches your backend server address
const API_BASE_URL_USER = "http://localhost:5000"; // User service

/**
 * Authenticates an admin user.
 * @param {object} credentials - The admin's credentials.
 * @param {string} credentials.email - The admin's email.
 * @param {string} credentials.password - The admin's password.
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const adminLogin = async (credentials) => {
  try {
    // Add a flag to indicate this is an admin login attempt
    const payload = { ...credentials, isAdminLogin: true };

    const response = await fetch(
      `${API_BASE_URL_USER}/api/users/account/userLogin`, // Use the unified user login endpoint
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: payload }), // Match the expected backend structure
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed.");
    }
    // Store admin data in localStorage
    if (data.token) {
      localStorage.setItem("admin-token", data.token);
      localStorage.setItem("admin", JSON.stringify(data.user)); // Assuming 'user' object is returned on login
    }
    return data;
  } catch (error) {
    console.error("Error during admin login:", error);
    throw error;
  }
};
/**
 * Creates a new product by sending a POST request to the backend.
 * @param {FormData} formData - The product data to be submitted.
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const createProduct = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/productList/Create`, {
      method: "POST",
      body: formData,
      // For multipart/form-data, the browser sets the 'Content-Type' header automatically with the correct boundary.
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create product.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    throw error; // Re-throw the error to be caught by the calling component
  }
};

/**
 * Fetches all products from the backend.
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const getAllProducts = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/productList/getAll?page=${page}&itemsPerPage=${limit}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch products.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Fetches a single product by its ID.
 * @param {string} productId - The ID of the product to fetch.
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const getProductById = async (productId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/productList/GetOne/${productId}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch product.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};


/**
 * Updates an existing product.
 * @param {string} productId - The ID of the product to update.
 * @param {FormData} formData - The updated product data.
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const updateProduct = async (productId, formData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/productList/update/${productId}`,
      {
        method: "PUT",
        body: formData,
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update product.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

/**
 * Deletes a product by its ID.
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/productList/delete/${productId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete product.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

/**
 * Creates products in bulk from a CSV or XLSX file.
 * @param {FormData} formData - The form data containing the file.
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const bulkCreateProducts = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/productList/bulkCreate`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to bulk create products.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error bulk creating products:", error);
    throw error;
  }
};
