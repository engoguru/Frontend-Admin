import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api'; // We'll assume this function exists in your api service
import { FaArrowLeft, FaEdit } from 'react-icons/fa';

const DetailItem = ({ label, value, className = '' }) => (
    <div className={`py-2 ${className}`}>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-md text-gray-800 whitespace-pre-wrap">{value || 'N/A'}</p>
    </div>
);

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const result = await getProductById(id);
                if (result && result.product) {
                    setProduct(result.product);
                } else {
                    throw new Error('Product not found');
                }
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch product:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleEditClick = () => {
        navigate('/products', { state: { editProductId: id } });
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading product details...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    if (!product) {
        return <div className="p-8 text-center">No product data available.</div>;
    }

    return (
        <div className="p-8">
            <div className="flex items-center mb-6">
                <Link to="/products" className="text-blue-500 hover:text-blue-700 flex items-center gap-2">
                    <FaArrowLeft />
                    Back to Products
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">{product.productName}</h1>
                    <button onClick={handleEditClick} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
                        <FaEdit /> Edit
                    </button>
                </div>

                {/* Image Gallery */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Product Images</h2>
                    <div className="flex flex-wrap gap-4">
                        {product.productImages?.length > 0 ? (
                            product.productImages.map((image, index) => ( // Use image public_id for key if available
                                <img key={index} src={image.url} alt={`${product.productName} ${index + 1}`} className="w-32 h-32 object-cover rounded-lg border" />
                            ))
                        ) : (
                            <p>No images available.</p>
                        )}
                    </div>
                </div>

                {/* Main Details */}
                <div className="border-t pt-6 mt-6">
                    <h2 className="text-lg font-semibold mb-2">Product Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                        <DetailItem label="Brand" value={product.productBrand} />
                        <DetailItem label="Category" value={product.productCategory} />
                        <DetailItem label="SubCategory" value={product.subCategory} />
                        <DetailItem label="Product Discount" value={`${product.productDiscount || 0}%`} />
                    </div>
                    <div className="mt-4">
                        <DetailItem label="Description" value={product.productDescription} />
                    </div>
                    {product.productTags?.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500">Tags</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {product.productTags.map((tag, index) => (
                                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Category-Specific Details */}
                <div className="border-t pt-6 mt-6">
                    <h2 className="text-lg font-semibold mb-2">{product.productCategory} Specifics</h2>
                    {product.productCategory === 'Apparel' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                            <DetailItem label="Material" value={product.material} />
                            <DetailItem label="Gender" value={product.gender} />
                            <DetailItem label="Fit" value={product.fit} />
                            <DetailItem label="Care Instructions" value={product.careInstructions?.join('\n')} />
                        </div>
                    )}
                    {product.productCategory === 'Equipment' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                            <DetailItem label="Weight" value={product.weight} />
                            <DetailItem label="Dimensions" value={product.dimensions} />
                            <DetailItem label="Material" value={product.material} />
                            <DetailItem label="Usage" value={product.usage} />
                        </div>
                    )}
                    {product.productCategory === 'Nutrition' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-4">
                                <DetailItem label="Serving Size" value={product.servingSize} />
                                <DetailItem label="Calories" value={product.calories} />
                                <DetailItem label="Protein" value={product.protein} />
                                <DetailItem label="Carbs" value={product.carbs} />
                                <DetailItem label="Fat" value={product.fat} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                                <DetailItem label="Ingredients" value={product.ingredients?.join(', ')} />
                                <DetailItem label="Allergens" value={product.allergens?.join(', ')} />
                            </div>
                        </>
                    )}
                </div>

                {/* Variants Table */}
                <div className="border-t pt-6 mt-6">
                    <h2 className="text-lg font-semibold mb-2">Product Variants</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-2 px-4 border text-left">SKU</th>
                                    <th className="py-2 px-4 border text-left">Size</th>
                                    <th className="py-2 px-4 border text-left">Color</th>
                                    <th className="py-2 px-4 border text-left">Flavor</th>
                                    <th className="py-2 px-4 border text-right">Stock</th>
                                    <th className="py-2 px-4 border text-right">Discount</th>
                                    <th className="py-2 px-4 border text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.productVarient?.length > 0 ? (
                                    product.productVarient.map((variant) => (
                                        <tr key={variant._id}>
                                            <td className="py-2 px-4 border">{variant.SKU}</td>
                                            <td className="py-2 px-4 border">{variant.size || 'N/A'}</td>
                                            <td className="py-2 px-4 border">
                                                {Array.isArray(variant.color) ? variant.color.join(', ') : (variant.color || 'N/A')}
                                            </td>
                                            <td className="py-2 px-4 border">
                                                {Array.isArray(variant.flavor) ? variant.flavor.join(', ') : (variant.flavor || 'N/A')}
                                            </td>
                                            <td className="py-2 px-4 border text-right">{variant.stock}</td>
                                            <td className="py-2 px-4 border text-right">{variant.discount ? `${variant.discount}%` : '0%'}</td>
                                            <td className="py-2 px-4 border text-right">₹{variant.price.toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">No variants found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;