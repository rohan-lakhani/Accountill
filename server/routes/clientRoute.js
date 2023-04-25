import express from "express";

import {
    getClients,
    getClient,
    getClientsByUser,
    createClient,
    updateClient,
    deleteClient,
} from "../controllers/client.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/user",authMiddleware, getClientsByUser);
router.get("/", authMiddleware, getClients);
router.get("/:id", authMiddleware, getClient);
router.post("/", authMiddleware, createClient);
router.patch("/:id", authMiddleware, updateClient);
router.delete("/:id", authMiddleware, deleteClient);

export default router;
