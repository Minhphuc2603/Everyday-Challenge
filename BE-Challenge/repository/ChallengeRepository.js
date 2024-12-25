import Challenge from "../models/Challenge.js";

// Create a new challenge
const createChallenge = async (challengeData) => {
    try {
        const newChallenge = new Challenge(challengeData);
        await newChallenge.save();
        return newChallenge;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Get all challenges
const getAllChallenges = async () => {
    try {
        const allChallenges = await Challenge.find().populate('categoryID').populate("OwnerID").exec();
        return allChallenges;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Get a challenge by ID
const getChallengeById = async (id) => {
    try {
        const challenge = await Challenge.findById(id).populate('categoryID').populate("OwnerID").exec();
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        return challenge;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Update a challenge by ID
const updateChallenge = async (id, updateData) => {
    try {
        const updatedChallenge = await Challenge.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!updatedChallenge) {
            throw new Error('Challenge not found');
        }
        return updatedChallenge;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Delete a challenge by ID
const deleteChallenge = async (id) => {
    try {
        const deletedChallenge = await Challenge.findByIdAndDelete(id).exec();
        if (!deletedChallenge) {
            throw new Error('Challenge not found');
        }
        return deletedChallenge;
    } catch (error) {
        throw new Error(error.toString());
    }
};

const verifyChallenge = async (id) => {
    try {
        const verifiedChallenge = await Challenge.findByIdAndUpdate(id, { isVerified: true }, { new: true }).exec();
        return verifiedChallenge;
    } catch (error) {
        throw new Error(error.toString());
    }
};

const banChallenge = async (id) => {
    try {
        const verifiedChallenge = await Challenge.findByIdAndUpdate(id, { status: false }, { new: true }).exec();
        return verifiedChallenge;
    } catch (error) {
        throw new Error(error.toString());
    }
};

export default {
    createChallenge,
    getAllChallenges,
    getChallengeById,
    updateChallenge,
    deleteChallenge,
    verifyChallenge,
    banChallenge
};
