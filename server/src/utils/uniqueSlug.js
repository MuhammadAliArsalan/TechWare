import slugify from "slugify";
import pool from "../../dbConnect.js";

const generateUniqueSlug = async (name) => {
    let baseSlug = slugify(name, { lower: true });
    let slug = baseSlug;
    let count = 1;

    while (true) {
        const existingCategory = await pool.query("SELECT * FROM category WHERE slug=$1", [slug]);
        if (!existingCategory.rows.length){ 
            break
        };
        slug = `${baseSlug}-${count}`;  // Append a counter to create a unique slug
        count++;
    }

    return slug;
};

export { generateUniqueSlug };