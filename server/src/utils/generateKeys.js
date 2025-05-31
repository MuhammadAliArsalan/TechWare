import crypto from "crypto"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";

// Get `__dirname` in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);           // Extracts the directory path from __filename.

//  Store keys inside `src/keys`

const keysDir = path.join(__dirname, "../keys");
console.log("\nWhere keys exist ",keysDir);

//Define Paths for the Public and Private Keys

const publicKeyPath = path.join(keysDir, "public_key.pem");
const privateKeyPath = path.join(keysDir, "private_key.pem")

//if keys directory does not exist create one
if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir)
}

const generateKeyPair = () => {
    if (fs.existsSync(publicKeyPath) && fs.existsSync(privateKeyPath)) {
        console.log(" RSA Keys already exist. No need to generate new ones.");
        return;
    }
    console.log("generating new key pairs")

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {

        modulusLength: 2048, // Key size (strong security)
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    //Writing Keys to .pem Files
    fs.writeFileSync(publicKeyPath, publicKey);
    fs.writeFileSync(privateKeyPath, privateKey);

}
export default generateKeyPair
