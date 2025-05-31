import fs from "fs"
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET

})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        console.log("File is uploaded on cloudinary", result.url);

        fs.unlinkSync(localFilePath);
        return result;
    }
    catch (err) {
        console.error("Error uploading to Cloudinary:", err); 
        fs.unlinkSync(localFilePath);  //remove the locally saved temporary saved file
        return null;  
    }
}
export {uploadOnCloudinary}
