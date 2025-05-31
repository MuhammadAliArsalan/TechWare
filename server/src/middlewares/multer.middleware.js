import multer from "multer";
import path from "path";

const allowedTypes = {
  product_image: ["image/jpeg", "image/png"]
};

// Configure storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  cb(null, "./public/temp");        // Temporary storage location
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase(); // Get file extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Preserve extension
  }
});

// File filter function for type validation
const fileFilter = (req, file, cb) => {
  const fieldName = file.fieldname;
  const fileType = file.mimetype;

  if (!allowedTypes[fieldName] || !allowedTypes[fieldName].includes(fileType)) {
    return cb(new Error(`Invalid file type: ${fileType}. Allowed: ${allowedTypes[fieldName].join(", ")}`), false);
  }
  
  cb(null, true);
};


const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter
});

export { upload };
