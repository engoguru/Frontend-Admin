import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import AddProduct from "../components/AddProduct.jsx";
import { FaSearch } from "react-icons/fa";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
} from "../services/api.js";
import Pagination from "../components/Pagination.jsx";

const Products = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("latest");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const fileInputRef = useRef(null);

  const fetchProducts = useCallback(
    async (page) => {
      try {
        setIsLoading(true);
        const result = await getAllProducts(page, itemsPerPage, sortBy);
        if (result && result.data) {
          const transformedProducts = result.data.map((product) => ({
            ...product,
            id: product._id, // Map _id to id for consistency
            productVarient: product.productVarient.map((v) => ({
              ...v,
              id: v._id, // Also map variant's _id
            })),
          }));
          setProducts(transformedProducts);
          setTotalPages(result.totalPages || 0);
          setCurrentPage(result.currentPage || 1);
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage, sortBy]
  );

  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // const handleAddProduct = async (formData) => {
  //     try {
  //         const result = await createProduct(formData);
  //         // Assuming the backend returns { success: true, newProduct: {...} }
  //         if (result && result.newProduct) {
  //             // The backend returns a product with `_id`. Our frontend state uses `id`.
  //             // We need to transform the product from the API to match our state structure.
  //             const newProductFromApi = result.newProduct;

  //             let parsedTags = newProductFromApi.productTags;
  //             if (typeof parsedTags === 'string') {
  //                 try {
  //                     const innerArray = JSON.parse(parsedTags);
  //                     if (Array.isArray(innerArray)) {
  //                         parsedTags = innerArray;
  //                     }
  //                 } catch (e) { /* Do nothing on parse error */ }
  //             }

  //             const transformedProduct = {
  //                 ...newProductFromApi,
  //                 productTags: Array.isArray(parsedTags) ? parsedTags : [],
  //                 id: newProductFromApi._id, // Map MongoDB's _id to id
  //                 productVarient: newProductFromApi.productVarient.map(v => ({
  //                     ...v,
  //                     id: v._id // Also map variant's _id to id for consistency
  //                 }))
  //             };
  //             setProducts(prev => [...prev, transformedProduct]);
  //             alert('Product created successfully!');
  //         }
  //     } catch (error) {
  //         alert(`Error creating product: ${error.message}`);
  //         console.error(error);
  //         throw error; // Re-throw to allow AddProduct to handle its state
  //     }
  // };

  // Flatten products for table display: one row per variant

  const handleSaveProduct = async (formData) => {
    if (editingProduct) {
      // --- UPDATE ---
      try {
        const result = await updateProduct(editingProduct.id, formData);
        if (result && result.product) {
          // Refetch data for the current page to show the updated product.
          fetchProducts(currentPage);
          alert("Product updated successfully!");
        }
      } catch (error) {
        alert(`Error updating product: ${error.message}`);
        console.error(error);
        throw error;
      }
    } else {
      // --- CREATE ---
      try {
        const createResult = await createProduct(formData);
        if (createResult && createResult.product) {
          // Refetch the current page to see the new product if it's on this page, or just show a success message.
          fetchProducts(currentPage);
          alert("Product created successfully!");
        }
      } catch (error) {
        alert(`Error creating product: ${error.message}`);
        console.error(error);
        throw error;
      }
    }
  };

  const handleEditClick = (productId) => {
    const productToEdit = products.find((p) => p.id === productId);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setShowAddForm(true);
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleDelete = async (productId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      try {
        await deleteProduct(productId);
        alert("Product deleted successfully!");
        // Refetch the data for the current page to ensure consistency after deletion.
        fetchProducts(currentPage);
      } catch (error) {
        alert(`Error deleting product: ${error.message}`);
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleBulkUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    alert("Uploading file... This may take a moment.");

    try {
      const result = await bulkCreateProducts(formData);
      alert(result.message || "Products created successfully!");
      fetchProducts(); // Refetch products to show the new ones
    } catch (error) {
      alert(`Bulk upload failed: ${error.message}`);
      console.error("Bulk upload error:", error);
    } finally {
      // Reset file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      (product.productName &&
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.productBrand &&
        product.productBrand
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (product.productCategory &&
        product.productCategory
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  const getPriceRange = (variants) => {
    if (!variants || variants.length === 0) return "N/A";
    const prices = variants
      .map((v) => v.price)
      .filter((p) => typeof p === "number");
    if (prices.length === 0) return "N/A";
    if (prices.length === 1) return `₹${prices[0]}`;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return minPrice === maxPrice
      ? `₹${minPrice}`
      : `₹${minPrice} - ₹${maxPrice}`;
  };

  return (
    <div className="relative flex flex-col h-full">
      {/* product header */}
      <div className="flex justify-between items-center pt-8 px-8 pb-4 flex-shrink-0 flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="flex items-center space-x-4 flex-wrap gap-y-2 justify-end">
          {/* Search Bar */}
          <div className="relative group w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, brand, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-2 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 md:w-80 lg:w-[30rem] xl:w-[36rem]"
            />
            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-colors group-hover:bg-gray-100 cursor-pointer">
              <FaSearch className="text-gray-400 group-hover:text-gray-600" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowAddForm(true);
              }}
              className="bg-blue-500 text-white px-3 py-2 text-sm rounded hover:bg-blue-600 transition"
            >
              + Add Product
            </button>
            <button
              onClick={handleBulkUploadClick}
              className="bg-green-500 text-white px-3 py-2 text-sm rounded hover:bg-green-600 transition"
            >
              + Add Bulk Product
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-3 py-2 rounded-md focus:outline-none bg-white"
          >
            <option value="latest">Sort by Latest</option>
            <option value="oldest">Sort by Oldest</option>
            <option value="a-z">Sort by A-Z</option>
            <option value="z-a">Sort by Z-A</option>
          </select>
        </div>
      </div>

      {/* product table */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 pb-8 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
              <p className="text-lg">Loading products...</p>
            </div>
          )}
          {/* <table className="min-w-full bg-white border border-gray-300 whitespace-nowrap"> */}
          <table className="min-w-full bg-white border border-gray-300 whitespace-nowrap border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="py-2 px-4 border">Sr No</th>
                <th className="py-2 px-4 border">Product</th>
                <th className="py-2 px-4 border">Brand</th>
                <th className="py-2 px-4 border">Category</th>
                <th className="py-2 px-4 border">SubCategory</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Discount</th>
                <th className="py-2 px-4 border">Total Price</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan="16" className="text-center py-4 text-red-500">
                    Error: {error}
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((item, index) => (
                  <tr key={item.id} className="text-center">
                    <td className="py-2 px-4 border align-middle">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-2 px-4 border text-left align-middle">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            item.productImages?.[0]?.url ||
                            "https://via.placeholder.com/150"
                          }
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-semibold">
                            {item.productName}
                          </div>
                          {[
                            {
                              label: "Sizes",
                              values: [
                                ...new Set(
                                  item.productVarient
                                    ?.map((v) => v.size)
                                    .filter(Boolean)
                                ),
                              ],
                            },
                            {
                              label: "Colors",
                              values: [
                                ...new Set(
                                  item.productVarient
                                    ?.flatMap((v) => v.color || [])
                                    .filter(Boolean)
                                ),
                              ],
                            },
                            {
                              label: "Flavors",
                              values: [
                                ...new Set(
                                  item.productVarient // Use flatMap to handle arrays of flavors
                                    ?.flatMap((v) => v.flavor || [])
                                    .filter(Boolean)
                                ),
                              ],
                            },
                          ].map(
                            (attr) =>
                              attr.values.length > 0 && ( // This check ensures we only render if values exist
                                <div
                                  key={attr.label}
                                  className="text-xs text-gray-500 mt-1"
                                >
                                  <span className="font-medium">
                                    {attr.label}:
                                  </span>{" "}
                                  {attr.values.join(", ")}
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4 border text-left">{item.productBrand}</td>
                    <td className="py-2 px-4 border text-left">{item.productCategory}</td>
                    <td className="py-2 px-4 border text-left">{item.subCategory}</td>
                    <td
                      className="py-2 px-4 border max-w-xs truncate text-left"
                      title={item.productDescription}
                    >
                      {item.productDescription}
                    </td>
                    <td className="py-2 px-4 border ">{item.productDiscount}</td>
                    <td className="py-2 px-4 border">
                      {getPriceRange(item.productVarient)}
                    </td>
                    <td className="py-2 px-4 border space-x-2">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(item.id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" className="text-center py-4 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>

      {/* overlay add product form */}
      {showAddForm && (
        <AddProduct
          onClose={handleCloseForm}
          onSave={handleSaveProduct}
          initialData={editingProduct}
        />
      )}
    </div>
  );
};

export default Products;
