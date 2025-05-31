import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({
    path:"./.env"
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUAPBASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase;


