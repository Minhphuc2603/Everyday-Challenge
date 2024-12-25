import ChallengeUser from "../models/ChallengeUsers.js";

const getAllChallengeUsersbyChallengeID = async (challengeID) => {
  try {
    const challengeUsers = await ChallengeUser.find({ challengeID }).populate('userID').exec();
    return challengeUsers;
  } catch (error) {
    throw new Error(error.toString());
  }
};


const getChallengeUserById = async (id) => {
  try {
    const challengeUser = await ChallengeUser.findById(id).populate('userID').populate('challengeID').exec();
    return challengeUser;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const createChallengeUser = async (challengeUserData) => {
  try {
    const newChallengeUser = new ChallengeUser(challengeUserData);
    const savedChallengeUser = await newChallengeUser.save();
    return savedChallengeUser;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const updateChallengeUser = async (id, updateData) => {
  try {
    const updatedChallengeUser = await ChallengeUser.findByIdAndUpdate(id, updateData, { new: true }).exec();
    return updatedChallengeUser;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const deleteChallengeUser = async (id) => {
  try {
    const deletedChallengeUser = await ChallengeUser.findByIdAndDelete(id).exec();
    return deletedChallengeUser;
  } catch (error) {
    throw new Error(error.toString());
  }
};

export default { getAllChallengeUsersbyChallengeID, getChallengeUserById, createChallengeUser, updateChallengeUser, deleteChallengeUser };
