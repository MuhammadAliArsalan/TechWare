import express from "express";
import { createCategory,getSingleCategory, getSingleRentalCategory, getSecondhandSingleCategory, getAllCategories,updateCategory,deleteCategory} from "../controllers/category.controller.js";
import { isLoggedIn } from "../middlewares/authentication.middleware.js";

const categoryRoutes=express.Router();

//ALL users
// categoryRoutes.get("/getCategory/:slug",getSingleCategory);
categoryRoutes.get("/getCategory/:slug", (req, res, next) => {
    console.log("🏁 Selling Category Route hit! Slug:", req.params.slug); // Debug log
    next();
  }, getSingleCategory); 
categoryRoutes.get("/getCategory/:slug/rental" , (req, res, next) => {
    console.log("🏁 Rental Category Route hit! Slug:", req.params.slug); // Debug log
    next();
  },getSingleRentalCategory);   

  categoryRoutes.get("/getSecondhandCategory/:slug",(req, res, next) => {
    console.log("🏁 second hand selling Category Route hit! Slug:", req.params.slug); // Debug log
    next();
  }, getSecondhandSingleCategory); 
categoryRoutes.get("/getAllCategories",getAllCategories);

//ONLY admin
categoryRoutes.post("/createCategory",isLoggedIn,createCategory);
categoryRoutes.patch("/updateCategory/:slug",isLoggedIn,updateCategory);
categoryRoutes.delete("/deleteCategory/:slug",isLoggedIn,deleteCategory);

export default categoryRoutes;