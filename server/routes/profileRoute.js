import express from "express";

import {
    getProfile,
    getProfilesByUser,
    createProfile,
    updateProfile,
    deleteProfile,
    getProfilesBySearch,
} from "../controllers/profile.js";

import upload from "../utills/fileUpload.js";

const router = express.Router();

router.get("/search", getProfilesBySearch);
// router.get("/",getProfiles);
router.get("/:id", getProfile);
router.get("/", getProfilesByUser);
router.post("/", upload.single("logo"), createProfile);
router.patch("/:id", upload.single("logo"), updateProfile);
router.delete("/:id", deleteProfile);

export default router;
