import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import pool from "../../dbConnect.js";
import crypto from "crypto"
import fs from "fs";
import path from "path";
import generateKeyPair from "../utils/generateKeys.js";
import { features } from "process";

const keysDir = path.resolve("src/keys");
const privateKeyPath = path.join(keysDir, "private_key.pem");

// Ensure RSA keys exist before processing
generateKeyPair();

const addProduct = asyncHandler(async (req, res) => {
    const userID = req.user.user_id;
    if (!userID) {
        throw new ApiError(400, "User ID is required for authentication")
    }
    if (req.user.role !== "admin" && req.user.role !== "seller") {
        throw new ApiError(403, `${req.user.role} is not authorized to add a product`);
    }
    const { name, description, price, condition, stock_quantity, rental_available, product_features, category_id } = req.body;

    let parsedFeatures;
    try {
        parsedFeatures = JSON.parse(product_features);  //JSON.parse(product_features) → Converts a JSON string (from request body) into an array.
        if (!Array.isArray(parsedFeatures)) {
            throw new Error();
        }
    } catch (error) {
        throw new ApiError(400, "Product features must be a valid JSON array.");
    }

    switch (true) {
        case !name:
            throw new ApiError(400, "Product name is required")
        case !description:
            throw new ApiError(400, "Product description is required")
        case !price || Number(price) <= 0:
            throw new ApiError(400, "Product price is required")
        case !condition:
            throw new ApiError(400, "Product condition is required");

        case !stock_quantity || Number(stock_quantity) < 0:
            throw new ApiError(400, "Valid stock quantity is required");

        case !rental_available || typeof JSON.parse(rental_available) !== "boolean":
            throw new ApiError(400, "Rental availability must be a boolean value");

        case !product_features || !Array.isArray(JSON.parse(product_features)):   //Array.isArray() is a built-in JavaScript method used to check whether a given value is an array.
            throw new ApiError(400, "Product features must be an array");
        case !category_id:
            throw new ApiError(400, "Category slug is required");

        default:
            console.log("All validations passed. Proceeding with product creation...");
    }

    const productImageLocalPath = req.files?.product_image?.[0]?.path;
    if (!productImageLocalPath) {
        throw new ApiError(400, "Product image is required")
    }

    const findProduct = await pool.query("SELECT * FROM product WHERE name=$1", [name]);
    if (findProduct.rows.length > 0) {
        throw new ApiError(409, "Product already exists");
    }
    if(isNaN(category_id)){
        throw new ApiError(400, "Category ID should be a number");  
    }

    const findCategory = await pool.query("SELECT * FROM category WHERE category_id=$1", [category_id]);

    if (findCategory.rowCount === 0) {
        throw new ApiError(404, "Category not found");
    }

    let image
    try {
        image = await uploadOnCloudinary(productImageLocalPath)
        console.log(`The image format is ${image.format}`)

    } catch (err) {
        console.log("Error uplaoding on cloudinary", err)
    }

    let digital_signature = ""
    try {
        const privateKey = fs.readFileSync(privateKeyPath, "utf-8");  // Read the private key from the specified file path
        const sign = crypto.createSign("sha256");

        //preparing data to be signed
        const signingData = JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            price: parseFloat(price).toFixed(2),
            condition,
            stock_quantity: Number(stock_quantity),
            rental_available: rental_available === "true" || rental_available === true,
            product_features: Array.isArray(product_features) ? product_features : JSON.parse(product_features)
        });

        sign.update(signingData);  // Add data to be signed
        sign.end()
        digital_signature = sign.sign(privateKey, "base64");  // Signing the data using the private key and encode in base64
    }
    catch (err) {
        console.error("Error signing product data:", err);
        throw new ApiError(500, "Error generating digital signature");
    }

    const query = `INSERT INTO product 
    (name,description,price,condition,stock_quantity,rental_available,digital_signature,product_features,product_image,user_id,category_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) 
    RETURNING *`

    const values = [
        name,
        description,
        price,
        condition,
        stock_quantity,
        rental_available,
        digital_signature,
        JSON.stringify(parsedFeatures),
        image.url,   //Storing Cloudinary URL
        userID,
        category_id,
    ]

    const insertProduct = await pool.query(query, values);
    const productID = insertProduct.rows[0].product_id;

    if (rental_available == true || rental_available == "true") {
        await pool.query(`INSERT INTO rental (product_id,user_id) VALUES ($1,$2)`, [productID, userID]);
    }

    const productWithCategory = await pool.query(
        `SELECT p.*, c.category_name, c.slug 
        FROM product p
        JOIN category c ON p.category_id = c.category_id
        WHERE p.product_id = $1`,
        [productID]
    ); //the join aims to gather data from both product and category tables

    return res.status(201).json(new ApiResponse(200, productWithCategory.rows[0], "Product added successfully"))

})

const getOneProduct = asyncHandler(async (req, res) => {
    const { id: product_id } = req.params;

    if (!product_id) {
        throw new ApiError(400, "Product ID should be provided to search for a product");
    }
    const findProduct = await pool.query(
        `SELECT 
        p.product_id, p.name, p.description, p.price, p.condition, 
        p.stock_quantity, p.product_features, p.product_image, 
        p.user_id, U.name AS product_added_by, U.role, 
        p.category_id, c.category_name 
     FROM product p
     JOIN "Users" U ON p.user_id = U.user_id
     JOIN category c ON p.category_id = c.category_id
     WHERE p.product_id = $1`,
        [product_id]

    )

    if (findProduct.rows.length == 0) {
        throw new ApiError(404, "Product not found")
    }
    return res.status(200).json(new ApiResponse(200, findProduct.rows[0], "Product retrieved successfully"))
})

const updateProduct = asyncHandler(async (req, res) => {
    const userID = req.user?.user_id;
    const { role } = req.user;

    if (!userID) {
        throw new ApiError(400, "User ID is required for authentication");
    }

    if (role !== "admin" && role !== "seller") {
        throw new ApiError(403, `${role} is not allowed to update product details`);
    }

    const { id: product_id } = req.params;

    const findProduct = await pool.query("SELECT * FROM product WHERE product_id=$1", [product_id]);
    if (findProduct.rowCount === 0) throw new ApiError(404, "Product not found");

    const existingProduct = findProduct.rows[0];

    const { name, description, price, condition, stock_quantity, rental_available, product_features } = req.body;

    const priceNumber = price !== undefined ? parseFloat(price) : undefined;
    const stockNumber = stock_quantity !== undefined ? parseInt(stock_quantity, 10) : undefined;
    const rentalAvailableBoolean = rental_available === "true" || rental_available === true;

    let updatedProductImage;
    // Ensure product image exists before uploading
    if (req.files?.product_image) {
        try {

            updatedProductImage = await uploadOnCloudinary(req.files.product_image[0].path);
            console.log(`The image format is ${updatedProductImage.format}`); // or you can use image format

        } catch (err) {
            console.log("Error uploading on Cloudinary", err);

        }
    }

    if (
        name === undefined &&
        description === undefined &&
        price === undefined &&
        condition === undefined &&
        stock_quantity === undefined &&
        rental_available === undefined &&
        product_features === undefined &&
        updatedProductImage === undefined

    ) {
        throw new ApiError(400, "Please provide at least one field to update");
    }
    if (price !== undefined && price < 0) {
        throw new ApiError(400, "Price cannot be negative");
    }
    if (stock_quantity !== undefined && stock_quantity < 0) {
        throw new ApiError(400, "Stock quantity cannot be negative");
    }
    let parsedFeatures = product_features;

    if (product_features !== undefined) {
        try {
            parsedFeatures = typeof product_features === "string" ? JSON.parse(product_features) : product_features;
            if (!Array.isArray(parsedFeatures)) {
                throw new Error();
            }
        } catch (error) {
            throw new ApiError(400, "Product features must be a valid JSON array.");
        }
    }

    //nobody can set rental_available to true while the product is still rented
    if (rental_available === true || rental_available === "true") {
        const checkProduct = await pool.query(
            `SELECT rental_status FROM rental WHERE product_id=$1`,
            [product_id]
        );
        const isProductRented = checkProduct.rows[0]?.rental_status;

        if (isProductRented === 'Rented') {
            throw new ApiError(403, "Cannot set rental_available to TRUE while the product is still rented.");
        }
    }


    let digital_signature = "";
    try {
        const privateKey = fs.readFileSync(privateKeyPath, "utf-8");
        const sign = crypto.createSign("sha256");

        /*This ensures all fields are included in the signing process.
        ?? operator is used to retain existing values if a field is not updated.
        The values are formatted properly to ensure consistency. */

        const signingData = JSON.stringify({
            name: (name ?? existingProduct.name)?.trim(),
            description: (description ?? existingProduct.description)?.trim() || "",
            price: parseFloat(price ?? existingProduct.price).toFixed(2),
            condition: condition ?? existingProduct.condition,
            stock_quantity: Number(stock_quantity ?? existingProduct.stock_quantity),
            rental_available: rentalAvailableBoolean ?? existingProduct.rental_available,
            product_features: Array.isArray(parsedFeatures)
                ? parsedFeatures
                : existingProduct.product_features
        });

        sign.update(signingData);
        sign.end();
        digital_signature = sign.sign(privateKey, "base64");

    } catch (err) {
        throw new ApiError(500, "Error generating digital signature");
    }

    let updateFields = [];
    let values = [];
    let index = 1;

    if (name) {
        updateFields.push(`name=$${index}`);
        values.push(name);
        index++;
    }
    if (description) {
        updateFields.push(`description=$${index}`);
        values.push(description);
        index++;
    }
    if (price !== undefined) {
        updateFields.push(`price=$${index}`);
        values.push(priceNumber);
        index++;
    }
    if (condition) {
        updateFields.push(`condition=$${index}`);
        values.push(condition);
        index++;
    }
    if (stock_quantity !== undefined) {
        updateFields.push(`stock_quantity=$${index}`);
        values.push(stockNumber);
        index++;
    }
    if (parsedFeatures) {
        updateFields.push(`product_features=$${index}`);
        values.push(JSON.stringify(parsedFeatures));
        index++;
    }
    if (rental_available !== undefined) {
        updateFields.push(`rental_available=$${index}`);
        values.push(rentalAvailableBoolean);
        index++;
    }
    if (updatedProductImage) {
        updateFields.push(`product_image=$${index}`);
        values.push(updatedProductImage.url);
        index++;
    }

    updateFields.push(`digital_signature=$${index}`);
    values.push(digital_signature);
    index++;

    if (updateFields.length === 0) {
        throw new ApiError(400, "No valid fields provided for update");
    }

    values.push(product_id);
    const updateQuery = `UPDATE product SET ${updateFields.join(", ")} WHERE product_id=$${index} RETURNING *`;

    console.log("Query:", updateQuery);
    console.log("Query Values:", values);

    let result;
    try {
        result = await pool.query(updateQuery, values);
    } catch (error) {
        console.error("Database Error:", error.message, "| Code:", error.code);
        throw new ApiError(500, "Database error occurred");
    }

    return res.status(200).json(new ApiResponse(200, result.rows[0], "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {

    const userID = req.user?.user_id;
    if (!userID) {
        throw new ApiError(400, "User ID is required for authentication");
    }
    const { id: product_id } = req.params;

    const findProduct = await pool.query(`SELECT * FROM product WHERE product_id=$1`, [product_id]);

    if (findProduct.rows.length == 0) {
        throw new ApiError(404, "Product not found");
    }
    const existingProductAddedBy = findProduct.rows[0]?.user_id;

    if (existingProductAddedBy !== userID) {
        throw new ApiError(403, "You are not authorized to delete this product")
    }
    try {
        await pool.query(`DELETE FROM product WHERE product_id=$1`, [product_id]);
    } catch (err) {
        console.log("error", err);
        throw new ApiError(500, "Error deleting product")
    }

    return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"))

})

const getProducts = asyncHandler(async (req, res) => {

    const userID = req.user?.user_id;
    if (!userID) {
        throw new ApiError(400, "User ID is required for authentication");
    }
   
    const query = `
        SELECT 
            p.product_id as id,
            p.name as title,
            p.price,
            p.description,
            p.condition,
            p.stock_quantity,
            p.rental_available,
            p.product_features,
            p.product_image as image,
            p.rental_available
        FROM product p
        WHERE p.user_id = $1
        LIMIT 50
    `;

        const result = await pool.query(query,[userID]);

        const products = result.rows.map(product => ({
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description,
            condition: product.condition,
            stock_quantity: product.stock_quantity,
            image: product.image,
            features:product.product_features,
            rental_available: product.rental_available,
            avg_rating: '0',
            people_rated: '0'
        }));

        return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
    }
);

const getAllProducts = asyncHandler(async (req, res) => {
    // Still check for authentication, but don't restrict products by user
    const userID = req.user?.user_id;

    if (!userID) {
        throw new ApiError(400, "User ID is required for authentication");
    }
   
    // Modified query to return ALL products (without filtering by user_id)
    const query = `
        SELECT 
            p.product_id as id,
            p.name as title,
            p.price,
            p.description,
            p.condition,
            p.stock_quantity,
            p.rental_available,
            p.product_features,
            p.product_image as image,
            p.rental_available
        FROM product p
        LIMIT 50
    `;

        // Run query without filtering by userID
        const result = await pool.query(query);

        const products = result.rows.map(product => ({
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description,
            condition: product.condition,
            stock_quantity: product.stock_quantity,
            image: product.image,
            features: product.product_features,
            rental_available: product.rental_available,
            avg_rating: '0',
            people_rated: '0'
        }));

        return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
    }
);

const getAllSellings = async (req, res) => {
    try {
      console.log("getAllProducts function called");

      const rental= false;
      const query = `
        SELECT 
            p.product_id as id,
            p.name as title,
            p.price,
            p.product_image as image,
            p.description,
            p.condition as condition,
            p.stock_quantity,
            p.rental_available as rental
        FROM product p
        WHERE p.rental_available = $1
        LIMIT 50
      `;
      
      console.log("Executing query:", query);
      const result = await pool.query(query, [rental]);
      console.log(`Query executed successfully. Retrieved ${result.rows.length} products`);

      const products = result.rows.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        condition: product.condition,
        stock_quantity: product.stock_quantity,
        rental: product.rental,
        avg_rating: '0', 
        people_rated: '0'
      }));

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Products fetched successfully",
        data: products
      });
    } catch (error) {
      console.error("Error in getAllProducts:", error);

      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to fetch products: " + error.message,
        data: null
      });
    }
  };


  const getAllRentalProducts = async (req, res) => {
    try {
      console.log("getAllProducts function called");

      const rental= true;
      const query = `
        SELECT 
            p.product_id as id,
            p.name as title,
            p.price,
            p.product_image as image,
            p.description,
            p.condition as condition,
            p.stock_quantity,
            p.rental_available as rental
        FROM product p
        WHERE p.rental_available = $1
        LIMIT 50
      `;
      
      console.log("Executing query:", query);
      const result = await pool.query(query, [rental]);
      console.log(`Query executed successfully. Retrieved ${result.rows.length} products`);

      const products = result.rows.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        condition: product.condition,
        stock_quantity: product.stock_quantity,
        rental: product.rental,
        avg_rating: '0', 
        people_rated: '0'
      }));

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Products fetched successfully",
        data: products
      });
    } catch (error) {
      console.error("Error in getAllProducts:", error);

      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to fetch products: " + error.message,
        data: null
      });
    }
  };

  const getRentalProduct = asyncHandler(async (req, res) => {
    const { id: product_id } = req.params;

    if (!product_id) {
        throw new ApiError(400, "Product ID should be provided to search for a product");
    }
    const findRental = await pool.query(
        `SELECT 
        p.product_id,
        p.name, 
        p.description, 
        p.price, 
        p.condition,
        p.product_features, 
        p.product_image 
        FROM product p
            WHERE p.product_id = $1
            LIMIT 50`,
        [product_id]

    )

    if (findRental.rows.length == 0) {
        throw new ApiError(404, "Product not found")
    }

    const rental = findRental.rows.map(rental => ({
            product_id: rental.product_id,
            title: rental.name,
            price: rental.price,
            image: rental.product_image,
            description: rental.description,
            avg_rating: '0', 
            people_rated: '0'
        }));

    return res.status(200).json(new ApiResponse(200, rental, "Product retrieved successfully"))
})

const listSecondhandProduct = async (req, res) => {
    try {
      console.log("getAllProducts function called");

      const condition = 'second-hand';
      const rental= false;
      const query = `
        SELECT 
            p.product_id as id,
            p.name as title,
            p.price,
            p.product_image as image,
            p.description,
            p.condition as condition,
            p.stock_quantity,
            p.rental_available as rental
        FROM product p
        WHERE p.condition = $1 AND p.rental_available = $2
        LIMIT 50
      `;
      
      console.log("Executing query:", query);
      const result = await pool.query(query, [condition, rental]);
      console.log(`Query executed successfully. Retrieved ${result.rows.length} products`);

      const products = result.rows.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        condition: product.condition,
        stock_quantity: product.stock_quantity,
        rental: product.rental,
        avg_rating: '0', 
        people_rated: '0'
      }));

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Products fetched successfully",
        data: products
      });
    } catch (error) {
      console.error("Error in getAllProducts:", error);

      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to fetch products: " + error.message,
        data: null
      });
    }
  };


const listRentalSecondhandProduct = async (req, res) => {
    try {
      console.log("getAllRentalSecondhandProducts function called");

      const condition = 'second-hand';
      const rental= true;
      const query = `
        SELECT 
            p.product_id as id,
            p.name as title,
            p.price,
            p.product_image as image,
            p.description,
            p.condition as condition,
            p.stock_quantity,
            p.rental_available as rental
        FROM product p
        WHERE p.condition = $1 AND p.rental_available = $2
        LIMIT 50
      `;
      
      console.log("Executing query:", query);
      const result = await pool.query(query, [condition, rental]);
      console.log(`Query executed successfully. Retrieved ${result.rows.length} products`);

      const products = result.rows.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        condition: product.condition,
        stock_quantity: product.stock_quantity,
        rental: product.rental,
        avg_rating: '0', 
        people_rated: '0'
      }));

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Products fetched successfully",
        data: products
      });
    } catch (error) {
      console.error("Error in getAllProducts:", error);

      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to fetch products: " + error.message,
        data: null
      });
    }
  };


export { addProduct, getOneProduct, updateProduct, deleteProduct, getAllProducts, getAllSellings, getAllRentalProducts, getProducts, getRentalProduct, listSecondhandProduct, listRentalSecondhandProduct}
