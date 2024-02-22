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

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", authMiddleware, getProfilesBySearch);
// router.get("/",authMiddleware,getProfiles);
router.get("/:id", authMiddleware, getProfile);
router.get("/", authMiddleware, getProfilesByUser);
router.post("/", authMiddleware, upload.single("logo"), createProfile);
router.patch("/:id", authMiddleware, upload.single("logo"), updateProfile);
router.delete("/:id", authMiddleware, deleteProfile);

export default router;
