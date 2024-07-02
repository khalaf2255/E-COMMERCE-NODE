import { fileURLToPath } from "url";
import path from "path";
import dotevn from "dotenv";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotevn.config({ path: path.join(__dirname, "./config/.env") });

import express from "express"
import initApp from "./src/index.router.js"
import { globalError } from "./src/uitls/errorHandling.js";
import chalk from "chalk";

const app = express()
const port = process.env.PORT || 5000
// *app.set("case sensitive route", true)
initApp(app, express)

app.use(globalError)

app.listen(port, () => {
    console.log(chalk.bgBlack.bold(`Your server is running on port..... `)  + chalk.blueBright.bold(`${port}`));
}) 