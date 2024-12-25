import UserProfile from "../models/UserProfile.js";
// /** 
//  * @des get members includes 2 collections User&UserProfile
//  * @author Bui Anh Hong
//  * @date 2/3/2024
//  * @param {*} req
//  * @param {*} res
//  * @returns
//  */

const getMembers = async () => {
    try {
      const members = await UserProfile.find().populate({
        path: 'userId',
        select: 'username isActive role',
      });

      console.log('Members: ', members);
      return members;
    } catch (error) {
      throw new Error(error.toString());
    }
  };

export default {getMembers}

