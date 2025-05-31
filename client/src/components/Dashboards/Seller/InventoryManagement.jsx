import { useState, useEffect } from "react";
import axios from "axios"; // Make sure to install axios if not already done
import Seller_dashboard from "./Seller_dashboard";
import "./InventoryManagement.css";
import Navbar from "../../Navbar/navbar1";
import LoadingSpinner from "./LoadingSpinner";

axios.defaults.withCredentials = true;

function InventoryManagement() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);

    // Fetch all products for the logged-in seller when component mounts
    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products based on selected category
    useEffect(() => {
        if (selectedCategory === "all") {
            setFilteredProducts(products);
        } else if (selectedCategory === "rental") {
            setFilteredProducts(products.filter(product => product.rental_available === true));
        } else if (selectedCategory === "new") {
            setFilteredProducts(products.filter(product => product.condition === "new"));
        } else if (selectedCategory === "secondHand") {
            setFilteredProducts(products.filter(product => product.condition === "second-hand"));
        }
    }, [selectedCategory, products]);

    // Filter products based on search term
    useEffect(() => {
        const filtered = products.filter(product =>
            product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (selectedCategory === "all") {
            setFilteredProducts(filtered);
        } else if (selectedCategory === "rental") {
            setFilteredProducts(filtered.filter(product => product.rental_available === true));
        } else if (selectedCategory === "new") {
            setFilteredProducts(filtered.filter(product => product.condition === "new"));
        } else if (selectedCategory === "secondHand") {
            setFilteredProducts(filtered.filter(product => product.condition === "second-hand"));
        }
    }, [searchTerm, products, selectedCategory]);

    // Fetch categories when component mounts
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/categories/getAllCategories");
            console.log("Categories fetched:", response.data);
            
            // Check if response.data.data exists and is an array
            if (response.data && Array.isArray(response.data.data)) {
                // Map the categories to match the expected format with category_id and category_name
                const mappedCategories = response.data.data.map(cat => ({
                    category_id: cat.category_id,  // Using slug as ID
                    category_name: cat.name // Using name as display name
                }));
                setCategories(mappedCategories);
            } else {
                console.error("Categories response format unexpected:", response.data);
                setCategories([]);
            }
        } catch (err) {
            console.error("Failed to load categories", err);
            setCategories([]);
        }
    };

    // Fetch all products from the API
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:3000/api/products/getProducts');
            setProducts(response.data.data);
            console.log("Products fetched:", response.data.data);
        } catch (err) {
            setError("Failed to fetch products. Please try again.");
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editingProduct) {
            setEditingProduct({ ...editingProduct, [name]: value });
        } else {
            setNewProduct({ ...newProduct, [name]: value });
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (editingProduct) {
            setEditingProduct({ ...editingProduct, product_image: file });
        } else {
            setNewProduct({ ...newProduct, product_image: file });
        }
    };

    const handleFeaturesChange = (e) => {
        const { value } = e.target;
        try {
            // Validate that it's a valid JSON array format
            const featuresArray = value.trim() ? JSON.parse(value) : [];

            if (editingProduct) {
                setEditingProduct({
                    ...editingProduct,
                    product_features: value,
                    parsedFeatures: featuresArray
                });
            } else {
                setNewProduct({
                    ...newProduct,
                    product_features: value,
                    parsedFeatures: featuresArray
                });
            }
        } catch (err) {
            // If not valid JSON, store as is, will be validated on submit
            if (editingProduct) {
                setEditingProduct({ ...editingProduct, product_features: value });
            } else {
                setNewProduct({ ...newProduct, product_features: value });
            }
        }
    };

    const validateProductData = (product) => {
        if (!product.name || !product.description || !product.price ||
            !product.condition || !product.stock_quantity ||
            product.rental_available === undefined || !product.category_id) {
            return "Please fill all required fields";
        }

        if (isNaN(product.price) || parseFloat(product.price) <= 0) {
            return "Please enter a valid price";
        }

        if (isNaN(product.stock_quantity) || parseInt(product.stock_quantity) < 0) {
            return "Please enter a valid stock quantity";
        }

        try {
            const features = typeof product.product_features === 'string'
                ? JSON.parse(product.product_features)
                : product.product_features;

            if (!Array.isArray(features)) {
                return "Product features must be a valid JSON array";
            }
        } catch (err) {
            return "Product features must be a valid JSON array";
        }

        return null;
    };

  const addNewProduct = async () => {
    const validationError = validateProductData(newProduct);
    if (validationError) {
        alert(validationError);
        return;
    }

    if (!newProduct.category_id) {
        alert("Please select a valid category");
        return;
    }

    setLoading(true);
    setError(null);

    try {
        // Ensure category_id is a number
        let categoryId;
        try {
            // First try to convert it to a number
            categoryId = Number(newProduct.category_id);
            
            // Check if it's a valid number (not NaN)
            if (isNaN(categoryId)) {
                throw new Error("Category ID must be a valid number");
            }
        } catch (err) {
            setError("Category ID must be a valid number");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('price', newProduct.price);
        formData.append('condition', newProduct.condition);
        formData.append('stock_quantity', newProduct.stock_quantity);
        formData.append('rental_available', newProduct.rental_available === "TRUE" || newProduct.rental_available === "Yes");
        formData.append('product_features', typeof newProduct.product_features === 'string'
            ? newProduct.product_features
            : JSON.stringify(newProduct.product_features));
            
        // Use the validated number version of category_id
        formData.append('category_id', categoryId);

        console.log("Category ID being sent:", categoryId, "Type:", typeof categoryId);

        if (newProduct.product_image) {
            formData.append('product_image', newProduct.product_image);
        }

        console.log("Sending product data:", Object.fromEntries(formData.entries()));

        const response = await axios.post('http://localhost:3000/api/products/addProduct', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });

        console.log("API response:", response.data);

        // Get the new product from the response
        const addedProduct = response.data.data;
        
        // Format the product for consistent property structure
        const formattedProduct = {
            id: addedProduct.id || addedProduct.product_id,
            product_id: addedProduct.product_id || addedProduct.id,
            name: addedProduct.name || addedProduct.title,
            title: addedProduct.title || addedProduct.name,
            description: addedProduct.description,
            price: addedProduct.price,
            condition: addedProduct.condition,
            stock_quantity: addedProduct.stock_quantity,
            rental_available: addedProduct.rental_available,
            features: Array.isArray(addedProduct.features) ? addedProduct.features :
                     (typeof addedProduct.product_features === 'string' ? 
                      JSON.parse(addedProduct.product_features || '[]') : []),
            product_features: typeof addedProduct.product_features === 'string' ? 
                            addedProduct.product_features : 
                            JSON.stringify(addedProduct.features || []),
            image: addedProduct.image,
            category_id: addedProduct.category_id
        };

        // Update both products and filteredProducts states
        setProducts(prev => [...prev, formattedProduct]);
        
        // Only add to filtered products if it matches the current filter
        if (selectedCategory === "all" || 
            (selectedCategory === "rental" && formattedProduct.rental_available) ||
            (selectedCategory === "new" && formattedProduct.condition === "new") ||
            (selectedCategory === "secondHand" && formattedProduct.condition === "second-hand")) {
            setFilteredProducts(prev => [...prev, formattedProduct]);
        }
        
        setNewProduct(null);
        alert("Product added successfully!");
    } catch (err) {
        setError(err.response?.data?.message || "Failed to add product");
        console.error("Error adding product:", err);
    } finally {
        setLoading(false);
    }
};
const saveEdit = async () => {
    const validationError = validateProductData(editingProduct);
    if (validationError) {
        alert(validationError);
        return;
    }

    setLoading(true);
    setError(null);

    try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('name', editingProduct.name);
        formData.append('description', editingProduct.description);
        formData.append('price', editingProduct.price);
        formData.append('condition', editingProduct.condition);
        formData.append('stock_quantity', editingProduct.stock_quantity);
        formData.append('rental_available', editingProduct.rental_available === "Yes" || editingProduct.rental_available === true);
        formData.append('product_features', editingProduct.product_features);
        
        // Make sure category_id is included and is a valid integer
        if (editingProduct.category_id) {
            formData.append('category_id', editingProduct.category_id);
        }

        if (editingProduct.product_image && editingProduct.product_image instanceof File) {
            formData.append('product_image', editingProduct.product_image);
        }
        
        // Determine which ID to use - product_id or id
        const productId = editingProduct.product_id || editingProduct.id;
        
        if (!productId) {
            throw new Error("Product ID is missing");
        }
        
        console.log("Editing product details:", editingProduct, "Using product ID:", productId);

        const response = await axios.patch(`http://localhost:3000/api/products/updateProduct/${productId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // Get the updated product from the response
        const updatedProduct = response.data.data;
        
        // Update the product in local state with consistent property naming
        setProducts(prev => 
            prev.map(product => {
                if (product.product_id === productId || product.id === productId) {
                    // Ensure the updated product has the same property structure as expected in the UI
                    return {
                        // Preserve the original ID fields
                        id: product.id,
                        product_id: product.product_id,
                        // Use values from the API response or fallback to existing values
                        name: updatedProduct.name || updatedProduct.title || product.name || product.title,
                        title: updatedProduct.title || updatedProduct.name || product.title || product.name,
                        description: updatedProduct.description || product.description,
                        price: updatedProduct.price || product.price,
                        condition: updatedProduct.condition || product.condition,
                        stock_quantity: updatedProduct.stock_quantity || product.stock_quantity,
                        rental_available: updatedProduct.rental_available || product.rental_available,
                        // Handle features and product_features properly
                        features: Array.isArray(updatedProduct.features) ? updatedProduct.features :
                                 (Array.isArray(updatedProduct.product_features) ? updatedProduct.product_features :
                                 (typeof updatedProduct.product_features === 'string' ? 
                                    JSON.parse(updatedProduct.product_features || '[]') : 
                                    product.features || [])),
                        product_features: typeof updatedProduct.product_features === 'string' ? 
                                        updatedProduct.product_features : 
                                        JSON.stringify(updatedProduct.features || []),
                        // Handle image property
                        image: updatedProduct.image || product.image,
                        category_id: updatedProduct.category_id || product.category_id
                    };
                }
                return product;
            })
        );
        
        setFilteredProducts(prev => {
            // Apply the same filtering that is currently active
            const updated = prev.map(product => {
                if (product.product_id === productId || product.id === productId) {
                    // Use the same structure as above
                    return {
                        // Preserve the original ID fields
                        id: product.id,
                        product_id: product.product_id,
                        // Use values from the API response or fallback to existing values
                        name: updatedProduct.name || updatedProduct.title || product.name || product.title,
                        title: updatedProduct.title || updatedProduct.name || product.title || product.name,
                        description: updatedProduct.description || product.description,
                        price: updatedProduct.price || product.price,
                        condition: updatedProduct.condition || product.condition,
                        stock_quantity: updatedProduct.stock_quantity || product.stock_quantity,
                        rental_available: updatedProduct.rental_available || product.rental_available,
                        // Handle features and product_features properly
                        features: Array.isArray(updatedProduct.features) ? updatedProduct.features :
                                 (Array.isArray(updatedProduct.product_features) ? updatedProduct.product_features :
                                 (typeof updatedProduct.product_features === 'string' ? 
                                    JSON.parse(updatedProduct.product_features || '[]') : 
                                    product.features || [])),
                        product_features: typeof updatedProduct.product_features === 'string' ? 
                                        updatedProduct.product_features : 
                                        JSON.stringify(updatedProduct.features || []),
                        // Handle image property
                        image: updatedProduct.image || product.image,
                        category_id: updatedProduct.category_id || product.category_id
                    };
                }
                return product;
            });
            return updated;
        });
        
        setEditingProduct(null);
        alert("Product updated successfully!");
    } catch (err) {
        setError(err.response?.data?.message || "Failed to update product");
        console.error("Error updating product:", err);
    } finally {
        setLoading(false);
    }
};

 const deleteProduct = async (id) => {
    if (!id) {
        alert("Error: Product ID is missing");
        return;
    }
    
    if (!window.confirm("Are you sure you want to delete this product?")) {
        return;
    }

    setLoading(true);
    setError(null);
    console.log("Deleting product with ID:", id);
    
    try {
        await axios.delete(`http://localhost:3000/api/products/deleteProduct/${id}`);

        // Remove the product from both products and filteredProducts state
        setProducts(prev => prev.filter(p => (p.product_id !== id && p.id !== id)));
        setFilteredProducts(prev => prev.filter(p => (p.product_id !== id && p.id !== id)));
        
        alert("Product deleted successfully!");
    } catch (err) {
        setError(err.response?.data?.message || "Failed to delete product");
        console.error("Error deleting product:", err);
    } finally {
        setLoading(false);
    }
};

    if (loading) {
        return <LoadingSpinner message="Loading inventory data..." />;
    }
    return (
        <div className="inv-body">
            <Navbar />
            <div className="inventory-page-container">
                <Seller_dashboard />
                <div className="inventory-content">
                    <h2>Inventory Management</h2>

                    {error && <div className="error-message">{error}</div>}

                    <div className="filters-container">
                        <div className="category-tabs">
                            <button 
                                className={selectedCategory === "all" ? "active" : ""}
                                onClick={() => setSelectedCategory("all")}
                            >
                                All Products
                            </button>
                            <button 
                                className={selectedCategory === "new" ? "active" : ""}
                                onClick={() => setSelectedCategory("new")}
                            >
                                New Products
                            </button>
                            <button 
                                className={selectedCategory === "secondHand" ? "active" : ""}
                                onClick={() => setSelectedCategory("secondHand")}
                            >
                                Second-Hand
                            </button>
                            <button 
                                className={selectedCategory === "rental" ? "active" : ""}
                                onClick={() => setSelectedCategory("rental")}
                            >
                                Rental
                            </button>
                        </div>

                        <div className="search-and-add">
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Search products..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <button
                                className="add-product-btn"
                                onClick={() => {
                                    // Fetch categories if they aren't loaded yet
                                    if (categories.length === 0) {
                                        fetchCategories();
                                    }
                                    
                                    setNewProduct({
                                        name: "",
                                        description: "",
                                        price: "",
                                        stock_quantity: "",
                                        product_features: "[]",
                                        condition: "",
                                        rental_available: "FALSE",
                                        category_id: ""
                                    });
                                }}
                            >
                                Add New Product
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th>Condition</th>
                                        <th>Stock</th>
                                        <th>Rental</th>
                                        <th>Features</th>
                                        <th>Image</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="no-products">No products found</td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <tr key={product.product_id || product.id}>
                                                <td>{product.title || product.name}</td>
                                                <td className="description-cell">{product.description}</td>
                                                <td>Rs. {product.price}</td>
                                                <td>{product.condition}</td>
                                                <td>{product.stock_quantity}</td>
                                                <td>{product.rental_available ? "YES" : "NO"}</td>
                                                <td>
                                                    {Array.isArray(product.features) && product.features.length > 0
                                                        ? product.features.slice(0, 2).join(", ") + "..."
                                                        : "N/A"}
                                                </td>

                                                <td>
                                                    <img src={product.image || "https://via.placeholder.com/50"} alt="Product" className="product-thumbnail" />
                                                </td>
                                                <td className="action-buttons">
                                                    <button className="edit-btn" onClick={() => {
                                                        // Ensure categories are loaded before opening edit modal
                                                        if (categories.length === 0) {
                                                            fetchCategories();
                                                        }
                                                        
                                                        // Make a copy of the product and ensure it has the required properties
                                                        const productToEdit = { ...product };
                                                        
                                                        // Ensure product has an id property (might be product_id in some cases)
                                                        if (!productToEdit.id && productToEdit.product_id) {
                                                            productToEdit.id = productToEdit.product_id;
                                                        }
                                                        
                                                        // Ensure name property (might be title in some cases)
                                                        if (!productToEdit.name && productToEdit.title) {
                                                            productToEdit.name = productToEdit.title;
                                                        }
                                                        
                                                        // If features is present but product_features is not
                                                        if (!productToEdit.product_features && Array.isArray(productToEdit.features)) {
                                                            productToEdit.product_features = JSON.stringify(productToEdit.features);
                                                        }
                                                        
                                                        console.log("Setting product to edit:", productToEdit);
                                                        setEditingProduct(productToEdit);
                                                    }}>Edit</button>
                                                    <button className="delete-btn" onClick={() => deleteProduct(product.product_id || product.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {(editingProduct || newProduct) && (
                        <div className="modal-overlay">
                            <div className="edit-form">
                                <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Name: <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={(editingProduct || newProduct).name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Price: <span className="required">*</span></label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={(editingProduct || newProduct).price}
                                            onChange={handleChange}
                                            min="0.01"
                                            step="0.01"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Stock Quantity: <span className="required">*</span></label>
                                        <input
                                            type="number"
                                            name="stock_quantity"
                                            value={(editingProduct || newProduct).stock_quantity}
                                            onChange={handleChange}
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Condition: <span className="required">*</span></label>
                                        <select
                                            name="condition"
                                            value={(editingProduct || newProduct).condition}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="new">New</option>
                                            <option value="second-hand">Second-hand</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Category: <span className="required">*</span></label>
                                        <select
                                            name="category_id"
                                            value={(editingProduct || newProduct).category_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select</option>
                                            {Array.isArray(categories) && categories.length > 0 ? (
                                                categories.map(cat => (
                                                    <option key={cat.category_id} value={cat.category_id}>
                                                        {cat.category_name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>Loading categories...</option>
                                            )}
                                        </select>
                                        {categories.length === 0 && <p className="text-error">No categories loaded. Please try refreshing.</p>}
                                    </div>

                                    <div className="form-group">
                                        <label>Rental Available:</label>
                                        <select
                                            name="rental_available"
                                            value={(editingProduct || newProduct).rental_available === true ? "Yes" : "No"}
                                            onChange={handleChange}
                                        >
                                            <option value="FALSE">No</option>
                                            <option value="TRUE">Yes</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Description: <span className="required">*</span></label>
                                    <textarea
                                        name="description"
                                        value={(editingProduct || newProduct).description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Product Features (JSON Array): <span className="required">*</span></label>
                                    <textarea
                                        name="product_features"
                                        value={(editingProduct || newProduct).product_features}
                                        onChange={handleFeaturesChange}
                                        placeholder='["feature1", "feature2"]'
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Product Image: {!editingProduct && <span className="required">*</span>}</label>
                                    <input
                                        type="file"
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        required={!editingProduct}
                                    />

                                    {editingProduct && editingProduct.product_image && (
                                        <div className="current-image">
                                            <p>Current Image:</p>
                                            <img src={editingProduct.product_image} alt="Current product" width="100" />
                                        </div>
                                    )}
                                </div>

                                <div className="form-buttons">
                                    <button
                                        className="save-btn"
                                        onClick={editingProduct ? saveEdit : addNewProduct}
                                        disabled={loading}
                                    >
                                        {loading ? "Processing..." : (editingProduct ? "Save" : "Add")}
                                    </button>
                                    <button
                                        className="cancel-btn"
                                        onClick={() => (editingProduct ? setEditingProduct(null) : setNewProduct(null))}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InventoryManagement;
