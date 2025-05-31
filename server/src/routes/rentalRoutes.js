import express from "express"
import {
    returnRentalOrder,
    getRentalDetails, 
    userRentals}
from "../controllers/rentalController.js"
import { isLoggedIn } from "../middlewares/authentication.middleware.js"

const rentalRoutes=express.Router();

// rentalRoutes.post("/rentProduct/:id",isLoggedIn,createRentalOrder)
rentalRoutes.post("/returnRental/:id",isLoggedIn,returnRentalOrder)
rentalRoutes.get("/getRental/:id",isLoggedIn, getRentalDetails);
// rentalRoutes.get("/getRentalProduct/:id", getRentalProduct);
rentalRoutes.get("/getUserRentals",isLoggedIn,userRentals)
// rentalRoutes.get("/getAllRentals", getAllRentals);

export default rentalRoutes;