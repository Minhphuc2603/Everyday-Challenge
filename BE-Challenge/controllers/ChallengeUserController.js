import Challenge from '../models/Challenge.js';
import ChallengeUser from '../models/ChallengeUsers.js';
import ChallengeUserRepository from '../repository/ChallengeUserRepository.js';

const getAllChallengeUsers = async (req, res) => {
  try {
    
    const result = await ChallengeUserRepository.getAllChallengeUsersbyChallengeID(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};
const getAllChallengeOfUser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const result = await ChallengeUser.find({ userID }).populate('challengeID').exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

const getChallengeUserById = async (req, res) => {
  try {
    const result = await ChallengeUserRepository.getChallengeUserById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

const createChallengeUser = async (req, res) => {
  try {
    const result = await ChallengeUserRepository.createChallengeUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

const updateChallengeUser = async (req, res) => {
  try {
    const result = await ChallengeUserRepository.updateChallengeUser(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

const deleteChallengeUser = async (req, res) => {
  try {
    const result = await ChallengeUserRepository.deleteChallengeUser(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

export default { getAllChallengeOfUser, getAllChallengeUsers, getChallengeUserById, createChallengeUser, updateChallengeUser, deleteChallengeUser };
