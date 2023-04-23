import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

import Profile from "../models/profileModel.js";

//GET ALL PROFILES
export const getProfiles = asyncHandler(async (req, res) => {
    const allProfiles = await Profile.find().sort({ _id: -1 });

    if (allProfiles) {
        res.status(200).json(allProfiles);
    } else {
        res.status(400);
        throw new Error("Something went Wrong...");
    }
});

//GET PROFILE
export const getProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const profile = await Profile.findById(id);

    if (profile) {
        res.status(200).json(profile);
    } else {
        res.status(400);
        throw new Error("Profile not exist");
    }
});

//CREATE PROFILE
export const createProfile = asyncHandler(async (req, res) => {
    const { name, email, phoneNumber, businessName, contactAddress, logo, website, userId } = req.body;

    // Handle Image upload
    let fileData = {};
    if (req.file) {
        try {
            console.log("file...");

            console.log(req.file);
            fileData = {
                fileName: req.file.originalname + Date.now().toString(),
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                filePath: req.file.path,
            };
        } catch (error) {
            res.status(500);
            throw new Error("Image could not be uploaded");
        }
    }

    const newProfile = new Profile({
        name,
        email,
        phoneNumber,
        businessName,
        contactAddress,
        logo: fileData,
        website,
        userId,
    });

    const existingUser = await Profile.findOne({ email });
    if (!existingUser) {
        await newProfile.save();
        res.status(201).json(newProfile);
    } else {
        res.status(400);
        throw new Error("Profile already exist, sorry:)");
    }
});

//GET PROFILE BY USER
export const getProfilesByUser = asyncHandler(async (req, res) => {
    const { searchQuery } = req.query;
    console.log(searchQuery);

    const profile = await Profile.findOne({ userId: searchQuery });

    if (profile) {
        res.json({ data: profile });
    } else {
        res.status(400);
        throw new Error("Profile not exist");
    }
});

//GET PROFILE BY SEARCH
export const getProfilesBySearch = asyncHandler(async (req, res) => {
    const { searchQuery } = req.query;
    console.log(searchQuery);

    const name = new RegExp(searchQuery, "i");
    const email = new RegExp(searchQuery, "i");
    console.log(name + " " + email);

    const profiles = await Profile.find({ $or: [{ name }, { email }] });

    if (profiles.length > 0) {
        res.json({ data: profiles });
    } else {
        res.status(400);
        throw new Error("Profile not exist");
    }
});

//UPDATE PROFILE
export const updateProfile = asyncHandler(async (req, res) => {
    const { id: _id } = req.params;
    const profile = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        res.status(400);
        throw new Error("Profile not exist with this Id");
    }

    // Handle Image upload
    let fileData = {};
    if (req.file) {
        try {
            console.log(req.file);
            fileData = {
                fileName: req.file.originalname + Date.now().toString(),
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                filePath: req.file.path,
            };
        } catch (error) {
            res.status(500);
            throw new Error("Image could not be uploaded");
        }
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
        _id,
        { ...profile, logo: Object.keys(fileData).length === 0 ? updateProfile.image : fileData },
        { new: true }
    );

    if (updatedProfile) {
        res.json(updatedProfile);
    } else {
        res.status(400);
        throw new Error("Profile not exist with this Id");
    }
});

//DELETE PROFILE
export const deleteProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("Profile not exist with this Id");
    }

    const deletedProfile = await Profile.findByIdAndDelete(id);

    if (deletedProfile) {
        res.json({ message: "Profile deleted successfully." });
    } else {
        res.status(400);
        throw new Error("Profile not exist with this Id");
    }
});
