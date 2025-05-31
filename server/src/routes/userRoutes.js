// import express from "express"
// import { registerUser,
//     loginUser,
//     logOut,
//     forgotPassowrd,
//     resetPwd,
//     changePassword,
//     getAccountDetails,
//     deleteAccount,
//     updateAccount,



// } from "../controllers/user.controller.js"
// import { isLoggedIn} from "../middlewares/authentication.middleware.js";


// const userRoutes=express.Router();

// // userRoutes.post('/register',registerUser);
// userRoutes.post('/signUp',registerUser);
// userRoutes.post('/login',loginUser);
// userRoutes.post('/logOut',isLoggedIn,logOut);
// userRoutes.post('/getResetPwdOtp',forgotPassowrd);
// userRoutes.post('/resetPwd',resetPwd);
// userRoutes.post('/changePwd',isLoggedIn,changePassword);
// userRoutes.get("/getAccountDetails",isLoggedIn,getAccountDetails);
// userRoutes.put("/updateAccount",isLoggedIn,updateAccount);
// userRoutes.delete("/deleteAccount",isLoggedIn,deleteAccount);



// export default userRoutes;

// import express from "express";
// import {
//     registerUser,
//     loginUser,
//     logOut,

//     forgotPassowrd,
//     resetPwd,
//     changePassword,
//     getAccountDetails,
//     updateAccount,
//     deleteAccount,
//     getAllBuyers,
//     getAllSellers
// } from "../controllers/user.controller.js";
// import { isLoggedIn, isAdmin } from "../middlewares/authentication.middleware.js";

// const userRoutes = express.Router();

// // Public routes
// userRoutes.post("/signUp", registerUser);
// userRoutes.post("/login", loginUser);

// // Protected routes
// userRoutes.post("/logOut", isLoggedIn, logOut);
// userRoutes.post("/getResetPwdOtp", forgotPassowrd);
// userRoutes.post("/resetPwd", resetPwd);
// userRoutes.post("/changePwd", isLoggedIn, changePassword);
// userRoutes.get("/getAccountDetails", isLoggedIn, getAccountDetails);
// userRoutes.put("/updateAccount", isLoggedIn, updateAccount);
// userRoutes.delete("/deleteAccount", isLoggedIn, deleteAccount);

// // Admin-only routes
// userRoutes.get("/buyers", isLoggedIn, isAdmin, getAllBuyers);
// userRoutes.get("/sellers", isLoggedIn, isAdmin, getAllSellers);


// export default userRoutes;



import express from "express";
import { 
    registerUser, 
    loginUser, 
    logOut,
    forgotPassowrd, 
    resetPwd, 
    changePassword, 
    getAccountDetails, 
    updateAccount, 
    deleteAccount, 
    getAllBuyers, 
    getAllSellers ,
    refreshAccessToken
} from "../controllers/user.controller.js";

// import { isLoggedIn, isAdmin, isSeller, isBuyer } from "../middlewares/authentication.middleware.js";
import { isLoggedIn, isAdmin } from "../middlewares/authentication.middleware.js";
const userRoutes = express.Router();

// Public routes
userRoutes.post("/signUp", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/refresh-token", refreshAccessToken);
userRoutes.post("/getResetPwdOtp", forgotPassowrd);
userRoutes.post("/resetPwd", resetPwd);

// Protected routes
userRoutes.post("/logOut", isLoggedIn, logOut);
userRoutes.post("/changePwd", isLoggedIn, changePassword);
userRoutes.get("/getAccountDetails", isLoggedIn, getAccountDetails);
userRoutes.put("/updateAccount", isLoggedIn, updateAccount);
userRoutes.delete("/deleteAccount", isLoggedIn, deleteAccount);

// Admin-only routes
userRoutes.get("/buyers", isLoggedIn, isAdmin, getAllBuyers);
userRoutes.get("/sellers", isLoggedIn, isAdmin, getAllSellers);

// Add route to check authentication status
userRoutes.get("/check-auth", isLoggedIn, (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            user_id: req.user.user_id,
            // name: req.user.name,
            email: req.user.email,
            // phoneNo: req.user.phoneNo,
            role: req.user.role,
            // address: req.user.address
        }
    });
});

export default userRoutes;