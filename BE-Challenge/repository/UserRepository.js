import User from "../models/User.js"
/** 
 * @des Get all User
 * @author Trinh Minh Phuc
 * @date 29/1/2024
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllUser = async ()=>{
    try {
        const allUser = await User.find().exec();
        return allUser;
    } catch (error) {
        throw new Error(error.toString());
    }
}

export default {getAllUser}