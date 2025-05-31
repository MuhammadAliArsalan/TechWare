import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import pool from "../../dbConnect.js";
import { generateUniqueSlug } from "../utils/uniqueSlug.js";

const createCategory = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        throw new ApiError(403, `${req.user.role} is not authorized to update a category`);
    }
    const { category_name, category_description } = req.body;
    if (!category_name || !category_description) {
        throw new ApiError(400, "Category name and description is required");
    }

    const findCategory = await pool.query("SELECT * FROM category WHERE category_name=$1", [category_name]);
    if (findCategory.rows.length) {
        throw new ApiError(400, "Category already exists");
    }

    const slug = await generateUniqueSlug(category_name);

    try {
        const newCategory = await pool.query("INSERT INTO category(category_name,category_description,slug) VALUES($1,$2,$3) RETURNING *",
            [category_name, category_description, slug]
        );
        return res.status(200).json(new ApiResponse(200, newCategory.rows[0], "Category created successfully",));

    }
    catch (err) {

        console.error(err.message);
        throw new ApiError(500, "Failed to create category");

    }

})

// const getAllCategories = asyncHandler(async (req, res) => {
//     const allCategories = await pool.query("SELECT category_name, slug FROM category");

//     if (!allCategories.rows.length) {
//         throw new ApiError(404, "No categories found");
//     }

//     return res.status(200).json(new ApiResponse(200, {
//         categories: allCategories.rows
//     }, "Categories fetched successfully"));


// });

const getAllCategories = asyncHandler(async (req, res) => {
  try{
    const allCategories = await pool.query("SELECT * FROM category");

      const categories = allCategories.rows.map(category => ({
        name: category.category_name,
        slug: category.slug,
        category_id: category.category_id,
      }));

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Categories fetched successfully",
        data: categories
      });
    } catch (error) {
      console.error("Error in getAllCategories:", error);

      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to fetch categories: " + error.message,
        data: null
      });
    }
  });


const updateCategory = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        throw new ApiError(403, `${req.user.role} is not authorized to update a category`);
    }
    const { slug } = req.params;
    if (!slug) {
        throw new ApiError(400, "Category slug is required")
    }

    const { category_name, category_description } = req.body;

    if (!category_name && !category_description) {
        throw new ApiError(400, "Provide category name or description to update");
    }

    const findCategory = await pool.query("SELECT * FROM category WHERE slug=$1", [slug]);
    if (!findCategory.rows.length) {
        throw new ApiError(404, "Category not found");
    }
    let updateFields = [];  // Stores field assignments (e.g., name=$1, email=$2)
    let values = [];  // Stores actual values for parameterized query
    let index = 1; // Counter for parameterized query values

    if (category_name) {
        updateFields.push(`category_name=$${index}`);
        values.push(category_name);
        index++;
    }
    if (category_description) {
        updateFields.push(`category_description=$${index}`);
        values.push(category_description);
        index++;
    }

    values.push(slug);

    const query = `UPDATE category SET ${updateFields.join(", ")} WHERE slug=$${index} RETURNING *`;
    const result = await pool.query(query, values);

    return res.status(200).json(new ApiResponse(200, result.rows[0], "Category updated successfully"));

})

const deleteCategory = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        throw new ApiError(403, `${req.user.role} is not authorized to delete a category`);
    }
    const { slug } = req.params;

    if (!slug) {
        throw new ApiError(400, "Category slug is required")
    }
    const findCategory = await pool.query("SELECT * FROM category WHERE slug=$1", [slug]);
    if (!findCategory.rows.length) {
        throw new ApiError(404, "Category not found");
    }
    const categoryId = findCategory.rows[0].category_id;
    try {
        await pool.query("DELETE FROM category WHERE category_id=$1", [categoryId]);
    }
    catch (err) {
        console.log("Error deleting product", err)
    }

    return res.status(200).json(new ApiResponse(200, {}, `Category ${slug} deleted successfully`));
})


// const getSingleCategory = asyncHandler(async (req, res) => {
//     const { slug } = req.params;
//     const { condition } = req.query; // Get condition from query params
    
//     if (!slug) {
//         throw new ApiError(400, "Category slug is required");
//     }

//     // Find the category
//     const findCategory = await pool.query("SELECT * FROM category WHERE slug=$1", [slug]);
//     if (!findCategory.rows.length) {
//         throw new ApiError(404, "Category not found");
//     }

//     const categoryId = findCategory.rows[0].category_id;
    
//     // Base query
//     let query = `
//         SELECT 
//             p.product_id,
//             p.name,
//             p.price, 
//             p.condition, 
//             p.stock_quantity, 
//             p.product_image, 
//             p.product_features,
//             p.rental_available,
//             c.category_name
//         FROM product p
//         JOIN category c ON p.category_id = c.category_id
//         WHERE p.category_id = $1 && 
//     `;
//     const queryParams = [categoryId];
    
//     // Add condition filter if provided
//     if (condition && ['new', 'second-hand', 'second hand'].includes(condition.toLowerCase())) {
//         query += " AND LOWER(p.condition) = $2";
//         queryParams.push(condition.toLowerCase().replace(' ', '-'));
//     }

//     // Add limit
//     query += " LIMIT 50";

//     // Execute the query
//     const findProducts = await pool.query(query, queryParams);

//     return res.status(200).json(new ApiResponse(200, {
//         category: {
//             category_id: findCategory.rows[0].category_id,  
//             category_name: findCategory.rows[0].category_name,
//             slug: findCategory.rows[0].slug
//         },
//         products: findProducts.rows.map(product => ({
//             product_id: product.product_id,
//             name: product.name.trim(),
//             price: product.price,
//             condition: product.condition,
//             stock_quantity: product.stock_quantity,
//             product_image: product.product_image,
//             product_features: product.product_features, 
//             rental_available: product.rental_available,
//             category_name: product.category_name
//         })),
//         condition: condition || 'all'
//     }, "Category and products found successfully"));
// });


// const getSingleRentalCategory = asyncHandler(async (req, res) => {
//     const { slug } = req.params;
//     const { condition } = req.query; // Get condition from query params
    
//     if (!slug) {
//         throw new ApiError(400, "Category slug is required");
//     }

//     // Find the category
//     const findCategory = await pool.query("SELECT * FROM category WHERE slug=$1", [slug]);
//     if (!findCategory.rows.length) {
//         throw new ApiError(404, "Category not found");
//     }

//     const categoryId = findCategory.rows[0].category_id;
    
//     // Base query
//     let query = `
//         SELECT 
//             p.product_id,
//             p.name,
//             p.price, 
//             p.condition, 
//             p.stock_quantity, 
//             p.product_image, 
//             p.product_features,
//             p.rental_available,
//             c.category_name
//         FROM product p
//         JOIN category c ON p.category_id = c.category_id
//         WHERE p.category_id = $1 
//     `;
//     const queryParams = [categoryId];
    
//     // Add condition filter if provided
//     if (condition && ['new', 'second-hand', 'second hand'].includes(condition.toLowerCase())) {
//         query += " AND LOWER(p.condition) = $2";
//         queryParams.push(condition.toLowerCase().replace(' ', '-'));
//     }

//     // Add limit
//     query += " LIMIT 50";

//     // Execute the query
//     const findProducts = await pool.query(query, queryParams);

//     return res.status(200).json(new ApiResponse(200, {
//         category: {
//             category_id: findCategory.rows[0].category_id,  
//             category_name: findCategory.rows[0].category_name,
//             slug: findCategory.rows[0].slug
//         },
//         products: findProducts.rows.map(product => ({
//             product_id: product.product_id,
//             name: product.name.trim(),
//             price: product.price,
//             condition: product.condition,
//             stock_quantity: product.stock_quantity,
//             product_image: product.product_image,
//             product_features: product.product_features, 
//             rental_available: product.rental_available,
//             category_name: product.category_name
//         })),
//         condition: condition || 'all'
//     }, "Category and products found successfully"));
// });

// Add these functions to your existing categoryController.js

const getSingleCategory = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    console.log("Fetching category with slug:", slug);
    // const { condition } = req.query; 
    const rental= false;
    
    if (!slug) {
      throw new ApiError(400, "Category slug is required");
    }
    
    // if (!condition || !['new', 'second-hand'].includes(condition)) {
    //   throw new ApiError(400, "Valid condition (new or second-hand) is required");
    // }
  
    try {
      // First get the category ID from the slug
      const categoryResult = await pool.query(
        "SELECT category_id FROM category WHERE slug = $1",
        [slug]
      );
  
      if (categoryResult.rows.length === 0) {
        throw new ApiError(404, "Category not found");
      }
  
      const categoryId = categoryResult.rows[0].category_id;
  
      // Get products from this category with the specified condition
      // Products should NOT be rental products
      const productsResult = await pool.query(
        `SELECT 
            p.product_id as id,
            p.name as title,
            p.price,
            p.product_image as image,
            p.condition as condition,
            p.stock_quantity,
            p.rental_available as rental
        FROM product p
        WHERE p.category_id = $1 
          AND p.rental_available = $2
        GROUP BY p.product_id
        LIMIT 50`,
        [categoryId, rental]
      );

      if (productsResult.rows.length === 0) {
        return res.status(200).json({
          success: true,
          statusCode: 200,
          message: "No selling products found in this category",
          data: []
        });
      }


      const Result = productsResult.rows.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        condition: product.condition,
        stock_quantity: product.stock_quantity,
        rental: product.rental,
        avg_rating: '0', 
        people_rated: '0'
      }));
  
    //   return res.status(200).json(
    //     new ApiResponse(
    //       200, 
    //       {
    //         category: categoryResult.rows[0],
    //         products: productsResult.rows,
    //         condition
    //       },
    //       "Category products fetched successfully"
    //     )
    //   );

    return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Products fetched successfully",
        data: Result
      });
    } catch (error) {
      console.error("Error in getSingleCategory:", error);
      throw new ApiError(500, "Failed to fetch category products: " + error.message);
    }
  });
  
  const getSingleRentalCategory = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    console.log("Fetching rental category with slug:", slug);
    // const { condition } = req.query; 
    const rental= true;
    
    if (!slug) {
      throw new ApiError(400, "Rental Category slug is required");
    }
    
    // if (!condition || !['new', 'second-hand'].includes(condition)) {
    //   throw new ApiError(400, "Valid condition (new or second-hand) is required");
    // }
  
    try {
      // First get the category ID from the slug
      const rentalCategoryResult = await pool.query(
        "SELECT category_id FROM category WHERE slug = $1",
        [slug]
      );
  
      if (rentalCategoryResult.rows.length === 0) {
        throw new ApiError(404, "Category not found");
      }
  
      const categoryId = rentalCategoryResult.rows[0].category_id;
  
      // Get products from this category with the specified condition
      // Products should NOT be rental products
      const productsResult = await pool.query(
        `SELECT 
            p.product_id as id,
            p.name as title,
            p.price,
            p.product_image as image,
            p.condition as condition,
            p.stock_quantity,
            p.rental_available as rental
        FROM product p
        WHERE p.category_id = $1 
          AND p.rental_available = $2
        GROUP BY p.product_id
        LIMIT 50`,
        [categoryId, rental]
      );

      if (productsResult.rows.length === 0) {
        return res.status(200).json({
          success: true,
          statusCode: 200,
          message: "No rental products found in this category",
          data: []
        });
      }

      const Result = productsResult.rows.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        condition: product.condition,
        stock_quantity: product.stock_quantity,
        rental: product.rental,
        avg_rating: '0', 
        people_rated: '0'
      }));
  
    //   return res.status(200).json(
    //     new ApiResponse(
    //       200, 
    //       {
    //         category: categoryResult.rows[0],
    //         products: productsResult.rows,
    //         condition
    //       },
    //       "Category products fetched successfully"
    //     )
    //   );

    return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Products fetched successfully",
        data: Result
      });
    } catch (error) {
      console.error("Error in getSingleCategory:", error);
      throw new ApiError(500, "Failed to fetch category products: " + error.message);
    }
  });

  const getSecondhandSingleCategory = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    console.log("Fetching category with slug:", slug);
    // const { condition } = req.query; 
    const rental= false;
    const condition = "second-hand"
    
    if (!slug) {
      throw new ApiError(400, "Category slug is required");
    }
    
    // if (!condition || !['new', 'second-hand'].includes(condition)) {
    //   throw new ApiError(400, "Valid condition (new or second-hand) is required");
    // }
  
    try {
      // First get the category ID from the slug
      const categoryResult = await pool.query(
        "SELECT category_id FROM category WHERE slug = $1",
        [slug]
      );
  
      if (categoryResult.rows.length === 0) {
        throw new ApiError(404, "Category not found");
      }
  
      const categoryId = categoryResult.rows[0].category_id;
  
      // Get products from this category with the specified condition
      // Products should NOT be rental products
      const productsResult = await pool.query(
        `SELECT 
            p.product_id as id,
            p.name as title,
            p.price,
            p.product_image as image,
            p.condition as condition,
            p.stock_quantity,
            p.rental_available as rental
        FROM product p
        WHERE p.category_id = $1 
          AND p.rental_available = $2
          AND P.condition = $3
        GROUP BY p.product_id
        LIMIT 50`,
        [categoryId, rental, condition]
      );

      const Result = productsResult.rows.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        condition: product.condition,
        stock_quantity: product.stock_quantity,
        rental: product.rental,
        avg_rating: '0', 
        people_rated: '0'
      }));
  
    //   return res.status(200).json(
    //     new ApiResponse(
    //       200, 
    //       {
    //         category: categoryResult.rows[0],
    //         products: productsResult.rows,
    //         condition
    //       },
    //       "Category products fetched successfully"
    //     )
    //   );

    return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Products fetched successfully",
        data: Result
      });
    } catch (error) {
      console.error("Error in getSecondhandSingleCategory:", error);
      throw new ApiError(500, "Failed to fetch category products: " + error.message);
    }
  });

export { createCategory, getSingleCategory, getSingleRentalCategory, getSecondhandSingleCategory, getAllCategories, updateCategory, deleteCategory }
