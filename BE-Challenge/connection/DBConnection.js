/** 
 * @des Connect to the database
 * @author Trịnh Minh Phúc
 * @date 29/1/2024
 * @param {*} req
 * @param {*} res
 * @returns 
 */

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        return await mongoose.connect(process.env.URI_MONGODB);
    } catch (error) {
        throw new Error(error.toString());
    }
}

export default connectDB;