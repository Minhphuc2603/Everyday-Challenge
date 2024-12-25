import { authRepo, challengeRepository } from '../repository/index.js';
import Challenge from '../models/Challenge.js';

/**
 * @des Get All Challenges
 * @function getAllChallenges
 * @param {*} req
 * @param {*} res
 * @returns {Object} Response object containing all challenges.
 */
const getAllChallenges = async (req, res) => {
  try {
    const result = await challengeRepository.getAllChallenges();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

const shareChallenge = async (req, res) => {
  try {
    const { email, fullName, id } = req.body;
    const result = await authRepo.shareChallenge(email, fullName, id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

/**
 * @function getChallengeById
 * @description This function retrieves a challenge by its ID.
 * @param {Object} req - The request object from the client, containing the challenge's ID in the parameters.
 * @param {Object} res - The response object to be sent to the client.
 * @returns {Object} The response object containing a success message and the data of the challenge retrieved.
 * @throws {Error} If there is an error in retrieving the challenge, an error message is sent in the response object.
 */
const getChallengeById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await challengeRepository.getChallengeById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

/**
 * @function createChallenge
 * @description This function creates a new challenge.
 * @param {Object} req - The request object from the client, containing the challenge data in the body.
 * @param {Object} res - The response object to be sent to the client.
 * @returns {Object} The response object containing a success message and the data of the challenge created.
 * @throws {Error} If there is an error in creating the challenge, an error message is sent in the response object.
 */
const createChallenge = async (req, res) => {
  try {
    const challengeData = req.body;
    const result = await challengeRepository.createChallenge(challengeData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

/**
 * @function updateChallenge
 * @description This function updates a challenge by its ID.
 * @param {Object} req - The request object from the client, containing the challenge's ID in the parameters and the update data in the body.
 * @param {Object} res - The response object to be sent to the client.
 * @returns {Object} The response object containing a success message and the data of the challenge updated.
 * @throws {Error} If there is an error in updating the challenge, an error message is sent in the response object.
 */
const updateChallenge = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const result = await challengeRepository.updateChallenge(id, updateData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

/**
 * @function deleteChallenge
 * @description This function deletes a challenge by its ID.
 * @param {Object} req - The request object from the client, containing the challenge's ID in the parameters.
 * @param {Object} res - The response object to be sent to the client.
 * @returns {Object} The response object containing a success message and the data of the challenge deleted.
 * @throws {Error} If there is an error in deleting the challenge, an error message is sent in the response object.
 */
const deleteChallenge = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await challengeRepository.deleteChallenge(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

const verifyChallenge = async (req, res) => {
  try {
    const result = await challengeRepository.verifyChallenge(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};
const banChallenge = async (req, res) => {
  try {
    const result = await challengeRepository.banChallenge(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};


export default {banChallenge, getAllChallenges, getChallengeById, createChallenge, updateChallenge, deleteChallenge,verifyChallenge ,shareChallenge };
