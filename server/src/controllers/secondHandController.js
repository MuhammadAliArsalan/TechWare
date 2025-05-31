import pool from "../../dbConnect.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// List all second-hand products for sale
// export const listSecondhandProduct = asyncHandler(async (req, res) => {
    
//     const condition='second-hand';
//     const rental = false;
//     const allSecondHandQuery=`SELECT 
//         p.name,
//         p.description,
//         p.price,
//         p.stock_quantity,
//         p.rental_available,
//         p.product_features,
//         p.product_image,
//         c.category_id,
//         c.category_name
//     FROM product p
//     LEFT JOIN category c ON c.category_id = p.category_id
//     WHERE p.condition = $1 AND rental_available= $2;
//     `;
//     const secondHandResult=await pool.query(allSecondHandQuery,[condition, rental]);

//     if(secondHandResult.rows.length==0){
//         throw new ApiError(404,"No second hand product found")
//     }
//     const response=secondHandResult.rows;
//     return res.status(200).json(new ApiResponse(200,{response},"Second hand products fetched successfully"))
// });

// export const listSecondhandProduct = async (req, res) => {
//     try {
//       console.log("getAllProducts function called");

//       const condition = 'second-hand';
//       const rental= false;
//       const query = `
//         SELECT 
//             p.product_id as id,
//             p.name as title,
//             p.price,
//             p.product_image as image,
//             p.description,
//             p.condition as condition,
//             p.stock_quantity,
//             p.rental_available as rental
//         FROM product p
//         WHERE p.condition = $1 AND p.rental_available = $2
//         LIMIT 50
//       `;
      
//       console.log("Executing query:", query);
//       const result = await pool.query(query, [condition, rental]);
//       console.log(`Query executed successfully. Retrieved ${result.rows.length} products`);

//       const products = result.rows.map(product => ({
//         id: product.id,
//         title: product.title,
//         price: product.price,
//         image: product.image,
//         description: product.description,
//         condition: product.condition,
//         stock_quantity: product.stock_quantity,
//         rental: product.rental,
//         avg_rating: '0', 
//         people_rated: '0'
//       }));

//       return res.status(200).json({
//         success: true,
//         statusCode: 200,
//         message: "Products fetched successfully",
//         data: products
//       });
//     } catch (error) {
//       console.error("Error in getAllProducts:", error);

//       return res.status(500).json({
//         success: false,
//         statusCode: 500,
//         message: "Failed to fetch products: " + error.message,
//         data: null
//       });
//     }
//   };


//   export const listRentalSecondhandProduct = async (req, res) => {
//     try {
//       console.log("listRentalSecondhandProduct function called");

//       const condition = 'second-hand';
//       const rental= true;
//       const query = `
//         SELECT 
//             p.product_id as id,
//             p.name as title,
//             p.price,
//             p.product_image as image,
//             p.description,
//             p.condition as condition,
//             p.stock_quantity,
//             p.rental_available as rental,
//             r.rental_id,
//             r.rental_status,
//             r.rental_price as rental_price,
//             r.rental_duration,
//             r.return_date,
//             r.rented_by as owner_name
//         FROM product p
//         LEFT JOIN rental r ON p.product_id = r.product_id
//         WHERE p.condition = $1 AND p.rental_available = $2
//         AND (r.rental_status IS NULL OR r.rental_status = 'Returned')
//         LIMIT 50
//       `;
      
//       console.log("Executing query:", query);
//       const result = await pool.query(query, [condition, rental]);
//       console.log(`Query executed successfully. Retrieved ${result.rows.length} products`);

//       const products = result.rows.map(product => ({
//         id: product.id,
//         title: product.title,
//         price: product.price,
//         image: product.image,
//         description: product.description,
//         condition: product.condition,
//         stock_quantity: product.stock_quantity,
//         rental: product.rental,
//         rental_id: product.rental_id,
//         rental_status: product.rental_status,
//         rental_price: product.rental_price,
//         rental_duration: product.rental_duration,
//         return_date: product.return_date,
//         owner_name: product.owner_name,
//         avg_rating: '0', 
//         people_rated: '0'
//       }));

//       return res.status(200).json({
//         success: true,
//         statusCode: 200,
//         message: "Products fetched successfully",
//         data: products
//       });
//     } catch (error) {
//       console.error("Error in getAllProducts:", error);

//       return res.status(500).json({
//         success: false,
//         statusCode: 500,
//         message: "Failed to fetch products: " + error.message,
//         data: null
//       });
//     }
//   };

//  Retrieve details of a specific second-hand product
export const getSecondhandProduct = asyncHandler(async (req, res) => {
    const { id:product_id } = req.params;
    const condition='second-hand'

    const isSecondHand=await pool.query(`SELECT condition from product WHERE product_id=$1`,[product_id]);

    if(isSecondHand.rowCount==0){
        throw new ApiError(404,"Product does not exist")
    }
    if(isSecondHand.rows[0]?.condition!=='second-hand'){
        throw new ApiError(403,"The product you are querying isn't a second-hand product")
    }
     
    const secondHandProduct = await pool.query(
        `SELECT 
            p.name,
            p.description,
            p.price,
            p.stock_quantity,
            p.rental_available,
            p.product_features,
            p.product_image,
            c.category_id,
            c.category_name
            FROM product p
        LEFT JOIN category c on c.category_id=p.category_id
        WHERE p.product_id=$1 AND p.condition=$2 `,
        [product_id,condition]
    );

    if (!secondHandProduct.rowCount) {
        throw new ApiError(404, "Second-hand product not found");
    }

    const response=secondHandProduct.rows;

    res.status(200).json(new ApiResponse(200,{response},"Product fetched successfully"))
});

// Retrieve all second-hand products listed by a user


