// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import pool from "../../dbConnect.js";

// // const createRentalOrder = asyncHandler(async (req, res) => {

// //     const { id: product_id } = req.params;
// //     if (!product_id) {
// //         throw new ApiError(400, "Product ID is missing")
// //     }
// //     const findExistingProduct = await pool.query(
// //         `SELECT user_id,product_id,rental_available,price FROM product WHERE product_id = $1`,
// //         [product_id]
// //     );

// //     if (findExistingProduct.rows.length == 0) {
// //         throw new ApiError(404, "Product not found");
// //     }
// //     const userID = req.user?.user_id;
// //     if (userID === findExistingProduct.rows[0]?.user_id) {
// //         throw new ApiError(403, "You cannot rent this product because you are its owner.")
// //     }

// //     const canBeRented = findExistingProduct?.rows[0]?.rental_available;
// //     if (canBeRented == "false" || canBeRented == false) {
// //         throw new ApiError(403, "Product can not be rented");
// //     }

// //     const { return_date } = req.body;
// //     const rentedAt = new Date();
// //     const returnDate = new Date(return_date);

// //     let rentalDuration = Math.ceil((returnDate - rentedAt) / (1000 * 60 * 60 * 24));

// //     console.log(rentalDuration);

// //     if (rentalDuration < 1) {
// //         throw new ApiError(400, "Return date must be at least 1 day after rental start");
// //     }

// //     let rental_price;
// //     const basePrice = findExistingProduct.rows[0]?.price;

// //     if (rentalDuration >= 1 && rentalDuration <= 10) {
// //         rental_price = basePrice * 0.2;
// //     } else if (rentalDuration >= 11 && rentalDuration <= 20) {
// //         rental_price = basePrice * 0.25;
// //     } else if (rentalDuration >= 21 && rentalDuration <= 30) {
// //         rental_price = basePrice * 0.3;
// //     } else {
// //         throw new ApiError(403, "Product cannot be rented for more than 30 days");
// //     }
// //     try {
// //         await pool.query(
// //             `UPDATE rental 
// //              SET rental_duration=$1, rental_status='Rented', return_date=$2, 
// //                 rental_price=$3, rented_by=$4, rented_at=$5
// //              WHERE product_id=$6 RETURNING *`,
// //             [rentalDuration, returnDate, rental_price, userID, rentedAt, product_id]
// //         );

// //         await pool.query(`UPDATE product SET rental_available=FALSE WHERE product_id=$1`, [product_id]);

// //         const userName = await pool.query(
// //             `SELECT name FROM "Users" WHERE user_id = $1`,
// //             [userID]
// //         );
// //         const rentedByName = userName.rows[0]?.name || "Unknown User";

// //         return res.status(201).json(new ApiResponse(200, {
// //             product_id,
// //             rented_by: {
// //                 user_id: userID,
// //                 name: rentedByName
// //             },
// //             rented_at: rentedAt,
// //             return_date: returnDate,
// //             rental_duration: rentalDuration+" days",
// //             rental_price
// //         }, "Rental order created successfully"));

// //     } catch (err) {
// //         console.error("Error updating rental record:", err);
// //         throw new ApiError(500, "Database error while updating rental record");
// //     }

// // })

// const returnRentalOrder = asyncHandler(async (req, res) => {
//     const { id: rental_id } = req.params;
//     const userID = req.user?.user_id;

//     if (!rental_id) {
//         throw new ApiError(400, "Rental ID is required to proceed with this action")
//     }
//     const rentalQuery = `
//       SELECT 
//         r.rental_id, 
//         r.product_id,
//         r.rental_duration, 
//         r.rental_status, 
//         r.rental_price,
//         r.return_date, 
//         r.rented_by, 
//         r.rented_at,
//         U.name  
//     FROM rental r
//     JOIN "Users" U ON r.rented_by = U.user_id
//     WHERE r.rental_id = $1;`

//     const findRentalOrder = await pool.query(rentalQuery, [rental_id]);

//     if (findRentalOrder.rows.length == 0) {
//         throw new ApiError(404, "Rental order not found")
//     }

//     const rental=findRentalOrder.rows[0];
//     const rentalProductID=findRentalOrder.rows[0]?.product_id;

//     if(findRentalOrder.rows[0]?.rental_status=="Returned"){
//         throw new ApiError(403,"You have already returned this product")
//     }

//     // Ensuring the user returning the product is the one who rented it
//     if (userID != findRentalOrder.rows[0]?.rented_by) {
//         throw new ApiError(403, "You can not mark this product as returned")
//     }

//     try {
//         const updateQuery = `
//         UPDATE rental 
//         SET rental_status = 'Returned', 
//             returned_at = NOW()
//         WHERE rental_id = $1 
//         RETURNING rental_id, rental_status, returned_at, rented_by;
//     `;

//     const updatedRental = await pool.query(updateQuery, [rental_id]);

//     await pool.query(`UPDATE product SET rental_available=TRUE WHERE product_id=$1`,[rentalProductID])

//     return res.status(200).json(new ApiResponse(200, {
//             rental_id: updatedRental.rows[0].rental_id,
//             rental_status: updatedRental.rows[0].rental_status,
//             returned_at: updatedRental.rows[0].returned_at,
//             rented_by: rental.name,
//         }, "Product returned successfully"));

//     } catch (err) {
//         console.error("Error updating rental record:", err);
//         throw new ApiError(409, "Database error occured")
//     }
// })

// const getRentalDetails=asyncHandler(async(req,res)=>{
//     const {id:rental_id}=req.params;

//     const userID=req.user?.user_id;

//     if(!rental_id){
//         throw new ApiError(400, "Rental ID is required to proceed with this action")
//     }
//     const rentalQuery=` SELECT 
//             r.rental_id,
//             r.rental_status,
//             r.rented_by,
//             r.product_id,
//             r.rental_duration,
//             r.return_date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi' AS return_date_local,
//             p.product_id AS product_id_from_product,
//             p.name AS productName,
//             U.user_id AS user_id_from_users,
//             U.name AS userName
//         FROM rental r
//         JOIN product p ON r.product_id = p.product_id
//         JOIN "Users" U ON r.rented_by = U.user_id 
//         WHERE r.rental_id = $1;
//     `
//     const findRentalRecord=await pool.query(rentalQuery,[rental_id]);

//     if(findRentalRecord.rows.length==0){
//         throw new ApiError(404,"Rental record against provided rentalID does not exist");
//     }

//     const rentalRecord=findRentalRecord.rows[0]

//     if(userID!=rentalRecord?.rented_by){
//         throw new ApiError(403,"Access denied: You are not the owner of this rental record.")
//     }
//     const message = rentalRecord.rental_status === "Rented" 
//     ? "Rental record fetched successfully. This product is currently rented."
//     : `Rental record fetched successfully. Note: This product is no longer rented (Status: ${rentalRecord.rental_status}).`;

    
//     return res.status(200).json(new ApiResponse(200,{rentalRecord},message))

// })

// const userRentals=asyncHandler(async(req,res)=>{
//     const userID=req.user?.user_id;

//     if(!userID){
//         throw new ApiError(403,"User ID is needed for authentication")
//     }
//     //Uses LEFT JOIN to ensure rentals are retrieved even if products are missing
//     const rentalQuery=`
//     SELECT
//         r.rental_id,
//         r.rental_status,
//         r.rental_duration, 
//         r.rental_price,
//         r.rented_by,
//         r.rented_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi' AS rented_at,
//         r.returned_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi' AS return_date,
//         r.product_id,
//         p.name AS productName,
//         U.name AS userName
//     FROM rental r
//     LEFT JOIN product p ON r.product_id = p.product_id
//     JOIN "Users" U ON r.rented_by = U.user_id 
//     WHERE r.rented_by = $1
//     `
//     const findRentalRecord=await pool.query(rentalQuery,[userID])

//     const rentalRecords=findRentalRecord.rows;

//     if(rentalRecords.length===0){
//         throw new ApiError(404,"You have not rented any prodcut uptill now")
//     }
  
//     return res.status(200).json(new ApiResponse(200,
//         {rentalRecords},
//         `Rental history fetched successfully.`
//     ))
// })



// export { returnRentalOrder ,getRentalDetails,userRentals}

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import pool from "../../dbConnect.js";

const returnRentalOrder = asyncHandler(async (req, res) => {
    const { id: rental_id } = req.params;
    const userID = req.user?.user_id;

    if (!rental_id) {
        throw new ApiError(400, "Rental ID is required");
    }

    // Start transaction
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const rentalQuery = `
            SELECT 
                r.rental_id, 
                r.product_id,
                r.rental_status, 
                r.rented_by,
                p.name AS product_name,
                u.name AS user_name
            FROM rental r
            JOIN product p ON r.product_id = p.product_id
            JOIN "Users" u ON r.rented_by = u.user_id
            WHERE r.rental_id = $1
            FOR UPDATE;`; // FOR UPDATE locks the row

        const rentalResult = await client.query(rentalQuery, [rental_id]);

        if (rentalResult.rows.length === 0) {
            throw new ApiError(404, "Rental order not found");
        }

        const rental = rentalResult.rows[0];

        if (rental.rental_status === "Returned") {
            throw new ApiError(400, "Product already returned");
        }

        if (userID !== rental.rented_by) {
            throw new ApiError(403, "Unauthorized to return this product");
        }
        if(rental.returned_at===null){
            throw new ApiError(403, "You have cannot change its status to returned"); 
        }

        // Update rental status
        const updateRentalQuery = `
            UPDATE rental 
            SET rental_status = 'Returned', 
                returned_at = NOW()
            WHERE rental_id = $1 
            RETURNING *;`;

        const updatedRental = await client.query(updateRentalQuery, [rental_id]);

        // Update product availability
        await client.query(
            `UPDATE product SET rental_available = TRUE WHERE product_id = $1`,
            [rental.product_id]
        );

        await client.query('COMMIT');

        return res.status(200).json(
            new ApiResponse(200, {
                rental_id: updatedRental.rows[0].rental_id,
                product_name: rental.product_name,
                returned_at: updatedRental.rows[0].returned_at,
                rented_by: rental.user_name
            }, "Product returned successfully")
        );

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Return rental error:", error);
        throw new ApiError(error.statusCode || 500, error.message || "Failed to process return");
    } finally {
        client.release();
    }
});

const getRentalDetails = asyncHandler(async (req, res) => {
    const { id: rental_id } = req.params;
    const userID = req.user?.user_id;

    if (!rental_id) {
        throw new ApiError(400, "Rental ID is required");
    }

    try {
        const rentalQuery = `
            SELECT 
                r.rental_id,
                r.rental_status,
                r.rental_duration,
                r.rental_price,
                r.rented_at,
                r.return_date,
                r.returned_at,
                p.product_id,
                p.name AS product_name,
                u.user_id,
                u.name AS user_name
            FROM rental r
            JOIN product p ON r.product_id = p.product_id
            JOIN "Users" u ON r.rented_by = u.user_id
            WHERE r.rental_id = $1;
        `;

        const result = await pool.query(rentalQuery, [rental_id]);

        if (result.rows.length === 0) {
            throw new ApiError(404, "Rental record not found");
        }
        console.log("Rental record found:", result.rows);
        const rental = result.rows[0];

        if (userID !== rental.user_id) {
            throw new ApiError(403, "Unauthorized to view this rental");
        }

        const message = rental.rental_status === "Rented" 
            ? "Product is currently rented"
            : `Product rental status: ${rental.rental_status}`;

        return res.status(200).json(
            new ApiResponse(200, {
                rental: {
                    id: rental.rental_id,
                    status: rental.rental_status,
                    duration: rental.rental_duration,
                    price: rental.rental_price,
                    rented_at: rental.rented_at,
                    return_date: rental.return_date,
                    returned_at: rental.returned_at,
                    product: {
                        id: rental.product_id,
                        name: rental.product_name
                    },
                    user: {
                        id: rental.user_id,
                        name: rental.user_name
                    }
                }
            }, message)
        );

    } catch (error) {
        console.error("Get rental details error:", error);
        throw new ApiError(error.statusCode || 500, error.message || "Failed to fetch rental details");
    }
});

const userRentals = asyncHandler(async (req, res) => {
    const userID = req.user?.user_id;

    if (!userID) {
        throw new ApiError(400, "User authentication required");
    }

    // Define the query at the beginning so it's available in all scopes
    const rentalQuery = `
        SELECT
            r.rental_id,
            r.rental_status,
            r.rental_duration,
            r.rental_price,
            r.rented_at,
            r.return_date,
            r.returned_at,
            p.product_id,
            p.name AS product_name,
            p.product_image AS product_image
        FROM rental r
        JOIN product p ON r.product_id = p.product_id
        WHERE r.rented_by = $1
        ORDER BY r.rented_at DESC;
    `;

    try {
        console.log("Executing query for user ID:", userID);
        const result = await pool.query(rentalQuery, [userID]);
        console.log("Query result:", result.rows);

        if (result.rows.length === 0) {
            console.log("No rentals found for user:", userID);
            return res.status(200).json(
                new ApiResponse(200, { rentals: [] }, "No rental history found")
            );
        }

        const rentals = result.rows.map(rental => ({
            id: rental.rental_id,
            status: rental.rental_status,
            duration: rental.rental_duration,
            price: rental.rental_price,
            rented_at: rental.rented_at,
            return_date: rental.return_date,
            returned_at: rental.returned_at,
            product: {
                id: rental.product_id,
                name: rental.product_name,
                image: rental.product_image
            }
        }));

        return res.status(200).json(
            new ApiResponse(200, { rentals }, "Rental history fetched successfully")
        );

    } catch (error) {
        console.error("Database error in userRentals:", {
            error: error.message,
            stack: error.stack,
            query: rentalQuery, 
            parameters: [userID]
        });
        throw new ApiError(500, "Failed to fetch rental history");
    }
});

export { returnRentalOrder, getRentalDetails, userRentals };