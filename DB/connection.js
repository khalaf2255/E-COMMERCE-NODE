import chalk from "chalk";
import mongoose from "mongoose"

const connectDB = async () => {
     return await mongoose.connect(process.env.DB_URL).then(result => {
    // * return await mongoose.connect("mongodb://localhost:27017/xx").then(result => {
        console.log( chalk.bgWhite.bold( "Connected DB  successfully 😍 "));
        // *console.log(result);
    }).catch(error => {
        console.log(chalk.bgRed('Sorry! Faild connectedDB 😒', error));
    })
} 
export default connectDB     