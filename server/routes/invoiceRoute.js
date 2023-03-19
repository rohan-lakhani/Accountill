import express from "express";


import { getInvoices, getInvoice, getInvoicesByUser, createInvoice, updateInvoice, deleteInvoice, getTotalCount } from "../controllers/invoices.js";

const router = express.Router();

router.get("/user", getInvoicesByUser);
router.get('/count', getTotalCount) //use to generate invoice serial number
router.get("/", getInvoices);
router.get("/:id", getInvoice);
router.post("/", createInvoice);
router.patch("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;
