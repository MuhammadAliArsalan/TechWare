import bcrypt from 'bcryptjs';
import pool from '../../dbConnect.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from "jsonwebtoken";
import transporter from '../utils/nodemailSetUp.js';

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword, role, phoneNo, address } = req.body;

    if (!name || !email || !password || !role || !phoneNo || !address) {
        throw new ApiError(400, 'Please fill all required fields');
    }
    if (password.trim().length < 6) {
        throw new ApiError(400, 'Password must be at least 6 characters long');
    }
    if (password !== confirmPassword) {
        throw new ApiError(400, 'Passwords do not match');
    }

    const roles = ["buyer", "seller", "admin"];
    if (!roles.includes(role)) {
        throw new ApiError(400, 'Invalid role selection');
    }

    const ifUserExists = await pool.query('SELECT * FROM "Users" WHERE email=$1', [email]);
    if (ifUserExists.rows.length) {
        throw new ApiError(400, 'User already exists with this email');
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO "Users" (name, email, password, "phoneNo", role, address) VALUES($1, $2, $3, $4, $5, $6) RETURNING name, email, "phoneNo", role, address';

    const values = [name, email, hashedPwd, phoneNo, role, address];
    const createNewUser = await pool.query(query, values);

    if (!createNewUser.rows.length) {
        throw new ApiError(500, 'User registration failed');
    }
    const emailOptions = {
        // from: "arsalanali873@gmail.com",
        from: "arisharehan7@gmail.com",
        to: email,
        subject: "Welcome to ProTech Hardware!",
        text: `Welcome to Hardware Hub. Your account has been created with Email ID: ${email}`, 
        html: `
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: auto;">
                    <h2 style="color: #2c3e50; text-align: center;">Welcome to <span style="color: #e74c3c;">Hardware Hub</span>!</h2>
                    <p>Hi there,</p>
                    <p>Your account has been successfully created.</p>
                    <p><strong>Email ID:</strong> ${email}</p>
                    <p>At <strong>ProTech Hardware</strong>, we bring you the best deals on <strong>Graphics Cards, Processors, RAM, SSDs, Gaming Peripherals</strong>, and more! Start upgrading your setup today</p>
                
                    <p>Need help selecting the best PC parts? Our expert support team is here for you.</p>
                 
                    <p>Happy Shopping!<br><strong>The ProTechHardware Team</strong></p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">                  
                    <footer style="text-align: center; font-size: 0.9em; color: #555;">
                        <p>For any queries, contact us at <a href="mailto:arsalanali873@gmail.com">support@ProTechHardware.com</a></p>
                       
                    </footer>
                </div>
            </body>
            </html>
        `
    };
    
    try{
        await transporter.sendMail(emailOptions);
        console.log("Email sent successfully to: ",email);

    }catch(err){
        console.log("Error sending email: ",err);   
    }

    return res.status(201).json(new ApiResponse(201, 'User registered successfully', createNewUser.rows[0]));
});

// Keep your existing registerUser, forgotPassword, resetPwd, etc. functions
// Only modifying login and logout functions

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, 'Please provide both email and password');
    }

    const userResult = await pool.query('SELECT * FROM "Users" WHERE email=$1', [email]);
    if (userResult.rows.length === 0) {
        throw new ApiError(404, 'User not registered');
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Incorrect password');
    }

    // Generate tokens
    const accessToken = jwt.sign(
        { id: user.user_id, email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' }
    );

    const refreshToken = jwt.sign(
        { id: user.user_id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    // Update refresh token in DB
    await pool.query(
        'UPDATE "Users" SET refresh_token=$1 WHERE email=$2',
        [refreshToken, email]
    );

    // Set cookies
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return response with user data and token
    const userData = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNo: user.phoneNo,
        address: user.address
    };

    return res.status(200).json(
        new ApiResponse(200, {
            user: userData,
            accessToken, // Also send in response for frontend storage
            refreshToken
        }, "User logged in successfully")
    );
});

const logOut = asyncHandler(async (req, res) => {
    await pool.query(
        'UPDATE "Users" SET refresh_token=NULL WHERE user_id=$1',
        [req.user.user_id]
    );

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict'
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict'
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "User logged out successfully")
    );
});




const forgotPassowrd=asyncHandler(async(req,res)=>{
    const {email}=req.body;
    if(!email){
        throw new ApiError(400,'Please provide email');
    }
    const checkIfUserExits=await pool.query('SELECT*FROM "Users" WHERE email=$1',[email]);
    if(checkIfUserExits.rows.length==0){
        throw new ApiError(400,'No user exists with this email');
    }
    const otp=Math.floor(100000 + Math.random() * 900000);
    console.log("OTP: ",otp);

    await pool.query(
        'UPDATE "Users" SET resetpwdotp=$1, resetotpexpireat=NOW() + INTERVAL \'10 minutes\' WHERE email=$2',
        [otp, email]
    );

    const emailOptions = {
        from: "arsalanali873@gmail.com",
        to: email,
        subject: "Your ProTech Hardware OTP Code",
        text: `Your OTP for ProTech Hardware is: ${otp}. This OTP is valid for only 10 minutes.`,
        html: `
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: auto;">
                    <h2 style="color: #2c3e50; text-align: center;">Your <span style="color: #e74c3c;">ProTech Hardware</span> OTP</h2>
                    <p>Hi there,</p>
                    <p>We received a request to reset your password. Use the following OTP to proceed:</p>
                    <div style="text-align: center; font-size: 22px; font-weight: bold; color: #e74c3c; padding: 10px; border: 2px dashed #e74c3c; display: inline-block;">
                        ${otp}
                    </div>
                    <p>This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
                    <p>If you did not request this, please ignore this email or contact our support team.</p>
                    <p>Best regards,<br><strong>The ProTech Hardware Team</strong></p>
    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">                  
                    <footer style="text-align: center; font-size: 0.9em; color: #555;">
                        <p>Need help? Contact us at <a href="mailto:arsalanali873@gmail.com">support@ProTechHardware.com</a></p>
                    </footer>
                </div>
            </body>
            </html>
        `
    };
    try{
        await transporter.sendMail(emailOptions);
        console.log("Email sent successfully to: ",email);
        return res.status(200).json({ success: true, message: `OTP sent to your email` })

    }catch(err){
        console.log("Error sending email");
        return res.status(400).json({ success: false, message: "Error sending OTP via email.Plz try again later" })
    }
    
})

const resetPwd=asyncHandler(async(req,res)=>{  
    const{email,otp,newPassword,confirmPassword}=req.body;

    if(!email || !otp || !newPassword || !confirmPassword){
        throw new ApiError(400,'Please fill all required fields');
    }
    const checkIfUserExits=await pool.query('SELECT*FROM "Users" WHERE email=$1',[email]);
    if(checkIfUserExits.rows.length==0){
        throw new ApiError(400,'No user exists with this email');
    }
    if(newPassword.trim().length<6){
        throw new ApiError(400,'Password must be at least 6 characters long');
    }
    if(newPassword!==confirmPassword){
        throw new ApiError(400,'Passwords do not match');
    }
    if(checkIfUserExits.rows[0].resetpwdotp!==otp){
        throw new ApiError(400,'Invalid OTP');
    }
    // Converting resetotpexpireat to a JavaScript Date object before comparison
    if (new Date(checkIfUserExits.rows[0].resetotpexpireat) < new Date()) {
        throw new ApiError(400, 'OTP expired');
    }
    
    const hashedPwd=await bcrypt.hash(newPassword,10);
    try{

    await pool.query('UPDATE "Users" SET password=$1,resetpwdotp=$2,resetotpexpireat=$3 WHERE email=$4',
    [hashedPwd,null,null,email]);

    }catch(err){
        throw new ApiError(500,'Error updating password');
    }

    return res.status(200).json(new ApiResponse(200,'Password reset successfully'));
 })

const changePassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword,confirmPassword}=req.body;
    
    if(!oldPassword || !newPassword || !confirmPassword){
        throw new ApiError(400,'Please fill all required fields');
    }
    if(newPassword.trim().length<6){
        throw new ApiError(400,'Password must be at least 6 characters long');
    }
    if(newPassword!==confirmPassword){
        throw new ApiError(400,'Passwords do not match');
    }
    const checkOldPassword=await bcrypt.compare(oldPassword,req.user.password);
    if(!checkOldPassword){
        throw new ApiError(400,'Incorrect old password');
    }
    const changedPassword=await bcrypt.hash(newPassword,10);

    try{
        await pool.query('UPDATE "Users" SET password=$1 WHERE user_id=$2 RETURNING user_id',[changedPassword,req.user.user_id]);

    }catch(err){
        console.log("Error updating password: ",err);
        throw new ApiError(500, "Internal server error")
    }
    return res.status(200).json(new ApiResponse(200,'Password updated successfully'));
   
})

const getAccountDetails=asyncHandler(async(req,res)=>{
    const { user_id } = req.user;

    const result = await pool.query(
        'SELECT name, email, "phoneNo", role, address FROM "Users" WHERE user_id = $1 LIMIT 1',
        [user_id]
    );

    if (result.rows.length === 0) {
        throw new ApiError(404, 'No user found');
    }

    return res.status(200).json(new ApiResponse(200, result.rows[0],"User details fetched successfully"));
})

const updateAccount=asyncHandler(async(req,res)=>{
    const {user_id}=req.user;
    
    const {name,email,phoneNo,address}=req.body;

    if(!name && !email && !phoneNo && !address){
        throw new ApiError(400,'Please provide atleast one field to update');
    }
    let updateFields = [];  // Stores field assignments (e.g., name=$1, email=$2)
    let values = [];  // Stores actual values for parameterized query
    let index = 1;  // Keeps track of the $ placeholders in SQL

    if (name) {
        updateFields.push(`name=$${index}`);
        values.push(name);
        index++;
    }
    if(email){
        updateFields.push(`email=$${index}`);
        values.push(email);
        index++;
    }
    if(phoneNo){
        updateFields.push(`"phoneNo"=$${index}`);
        values.push(phoneNo);
        index++;
    }
    if(address){
        updateFields.push(`address=$${index}`);
        values.push(address);
        index++;
    }
    values.push(user_id);
    const query = `UPDATE "Users" SET ${updateFields.join(', ')} WHERE user_id=$${index} RETURNING name, email, "phoneNo", role, address`;

    const result = await pool.query(query, values);

    return res.status(200).json(new ApiResponse(200, result.rows[0],"User details updated successfully"));

})

const deleteAccount=asyncHandler(async(req,res)=>{
    const {user_id}=req.user;

    const result=await pool.query(
        'DELETE FROM "Users" WHERE user_id=$1 RETURNING user_id',
        [user_id]
    );
    if(result.rows.length==0){
        throw new ApiError(404,'No user found');
    }
    return res.status(200).json(new ApiResponse(200,{},'User deleted successfully'));

})  

//Changes Made


// const getAllBuyers = asyncHandler(async (req, res) => {
//     const result = await pool.query(
//         'SELECT user_id, name, email, "phoneNo", address FROM "Users" WHERE role = $1 ORDER BY name',
//         ['buyer']
//     );
    
//     return res.status(200).json(
//         new ApiResponse(200, result.rows, "Buyers fetched successfully")
//     );
// });

// Add this to user.controller.js

const getAllBuyers = asyncHandler(async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT user_id, name, email, "phoneNo", address FROM "Users" WHERE role = $1 ORDER BY name',
            ['buyer']
        );
        
        return res.status(200).json({
            success: true,
            users: result.rows
        });
    } catch (error) {
        console.error("Error fetching buyers:", error);
        throw new ApiError(500, "Failed to fetch buyers");
    }
});

const getAllSellers = asyncHandler(async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT user_id, name, email, "phoneNo", address FROM "Users" WHERE role = $1 ORDER BY name',
            ['seller']
        );
        
        return res.status(200).json({
            success: true,
            users: result.rows
        });
    } catch (error) {
        console.error("Error fetching sellers:", error);
        throw new ApiError(500, "Failed to fetch sellers");
    }
});
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await pool.query(
            'SELECT * FROM "Users" WHERE user_id=$1 AND refresh_token=$2',
            [decoded.id, incomingRefreshToken]
        );

        if (user.rows.length === 0) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const newAccessToken = jwt.sign(
            { id: user.rows[0].user_id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            { id: user.rows[0].user_id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // Update refresh token in DB
        await pool.query(
            'UPDATE "Users" SET refresh_token=$1 WHERE user_id=$2',
            [newRefreshToken, user.rows[0].user_id]
        );

        // Set new cookies
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json(
            new ApiResponse(200, {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }, "Access token refreshed")
        );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});


export { registerUser, loginUser, logOut,forgotPassowrd ,resetPwd,changePassword,getAccountDetails,updateAccount,deleteAccount, getAllBuyers, getAllSellers, refreshAccessToken};
