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

router.get("/user", getClientsByUser);
router.get("/",  getClients);
router.get("/:id", getClient);
router.post("/", createClient);
router.patch("/:id",  updateClient);
router.delete("/:id", deleteClient);

export default router;
