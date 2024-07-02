import { fileURLToPath } from "url";
import path from "path";
import dotevn from "dotenv";
import cloudinary from "cloudinary"

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotevn.config({ path: path.join(__dirname, "../../../config/.env") });

cloudinary.config({
    // *api_secret: process.env.api_secret,
    // *api_key: process.env.API_KEY,
    // *cloud_name: process.env.cloud_name,
    // *secure: true

    // *api_secret: "qIQJHoXpMTCr5EAz-KXUiM-MRTg",
    // *api_key: "692589662126679",
    // *cloud_name: "dygrupndu",
    // *secure: true
api_secret: "2kJdHxa2LFiBax_06xg-GaUaw18",
api_key: "773118566416578",
cloud_name: "dfeidulc9",
    secure: true
});

export default cloudinary