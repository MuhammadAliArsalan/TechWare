import express from "express";
import { 
    listSecondhandProduct, 
    listRentalSecondhandProduct,
    getSecondhandProduct  
} from "../controllers/secondHandController.js";
import { isLoggedIn,isAdmin } from "../middlewares/authentication.middleware.js";


const secondHandRoutes = express.Router();

secondHandRoutes.get("/listSecondHand", listSecondhandProduct);
secondHandRoutes.get("/listRentalSecondHand", listRentalSecondhandProduct);
secondHandRoutes.get("/getSecondHand/:id", getSecondhandProduct);

export default secondHandRoutes;
