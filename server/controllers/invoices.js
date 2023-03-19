import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

import Invoice from "../models/invoiceModel.js";

//GET INVOICE BY USER
export const getInvoicesByUser = asyncHandler(async(req,res) => {

    const { searchQuery } = req.query;

    const invoice = await Invoice.find({ creator: searchQuery });
    
    if(invoice.length>0){
        res.status(200).json({ data: invoice });
    }else if(invoice.length === 0){
        res.status(200).json({ data: [] })
    }
    else{
        res.status(400);
        throw new Error("Invoice not exist");
    }
})

//GET TOTAL COUNT
export const getTotalCount = asyncHandler(async(req,res) => {

    const { searchQuery } = req.query;

    const invoiceCount = await Invoice.countDocuments({ creator: searchQuery });
    
    if(invoiceCount){
        res.status(200).json(invoiceCount);
    }else if(invoiceCount === 0){
        res.status(200).json(0);
    }else{
        res.status(400);
        throw new Error("Invoice not exist");
    }
})

//GET ALL INVOICES
export const getInvoices = asyncHandler(async(req,res) => {

    const invoices = await Invoice.find({}).sort({_id:-1});
    
    if(invoices){
        res.status(200).json(invoices);
    }else if(invoices.length === 0){
        res.status(200).json([]);
    }else{
        res.status(400);
        throw new Error("Invoice not exist");
    }
})

//GET INVOICE BY ID
export const getInvoice = asyncHandler(async(req,res) => {

    const { id:_id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        res.status(400);
        throw new Error("Invoice not exist with this Id");  
    }

    const invoice = await Invoice.findById(_id);
    
    if(invoice){
        res.status(200).json(invoice);
    }else{
        res.status(400);
        throw new Error("Invoice not exist");
    }
})

//CREATE INVOICE 
export const createInvoice = asyncHandler(async(req,res) => {
    
    const invoice = req.body;
    
    const newInvoice = new Invoice(invoice);
    
    if(newInvoice){
        await newInvoice.save();
        res.status(201).json(newInvoice);
    }else{
        res.status(400);
        throw new Error("Something went wrong");
    }
})

//UPDATE INVOICE
export const updateInvoice = asyncHandler(async(req,res) => {
    const { id: _id } = req.params;
    const invoice = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        res.status(400);
        throw new Error("Invoice not exist with this Id...");
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(_id, {...invoice, _id}, { new: true })
    
    if(updatedInvoice){
        res.json(updatedInvoice);
    }else{
        res.status(400);
        throw new Error("Invoice not exist with this Id");
    }
})

//DELETE INVOICE
export const deleteInvoice = asyncHandler(async(req,res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(400);
        throw new Error("Invoice not exist with this Id");
    }

    const deletedInvoice = await Invoice.findByIdAndDelete(id)
    
    if(deletedInvoice){
        res.json({ message: "Invoice deleted successfully."});
    }else{
        res.status(400);
        throw new Error("Invoice not exist with this Id");
    }
})


