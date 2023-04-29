import express from "express";

import {
    getInvoices,
    getInvoice,
    getInvoicesByUser,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getTotalCount,
} from "../controllers/invoices.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user", authMiddleware, getInvoicesByUser);
router.get("/count", authMiddleware, getTotalCount); //use to generate invoice serial number
router.get("/", authMiddleware, getInvoices);
router.get("/:id", authMiddleware, getInvoice);
router.post("/", authMiddleware, createInvoice);
router.patch("/:id", authMiddleware, updateInvoice);
router.delete("/:id", authMiddleware, deleteInvoice);

export default router;
