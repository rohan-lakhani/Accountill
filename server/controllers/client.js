import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

import Client from "../models/clientModel.js"

//GET ALL CLIENTS
//export const getClients =  asyncHandler(async(req,res) => {
    
//     const { userId } = req.body;

//     const allClients = await Client.find({userId}).sort({ _id: -1 }); 
//     //find({}).sort({_id:-1}) to sort according to date of creation
    
//     if(allClients){
//         res.status(200).json(allClients);
//     }else{
//         res.status(400);
//         throw new Error("Something went Wrong...");
//     }
// })

//GET CLIENT
export const getClient = asyncHandler(async(req,res) => {
    const { id } = req.params;

    const client = await Client.findById(id);

    if(client){
        res.status(200).json(client);
    }else{
        res.status(400);
        throw new Error("Client not exist");
    }
})

//GET CLIENTS 
export const getClients = asyncHandler(async(req,res) => {
    const { page } = req.query;

    const LIMIT = 8;
    const startIndex = (Number(page)-1)*LIMIT;

    const total = await Client.countDocuments({});
    const clients = await Client.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);

    if(clients.length>0){
        res.json({
            data: clients,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total/LIMIT),
        })
    }else{
        res.status(400);
        throw new Error("Clients not found");
    }
})

//CREATE CLIENT
export const createClient = asyncHandler(async(req,res) => {
    const client = req.body;
    const { email } = req.body;

    const newClient = new Client({...client });

    const existingClient = await Client.findOne({ email });

    if(!existingClient){
        await newClient.save();
        res.status(201).json(newClient);
    }else{
        res.status(400);
        throw new Error("Client already exist");
    }
})

//UPDATE CLIENT
export const updateClient = asyncHandler(async(req,res) => {
    const { id: _id } = req.params;
    const client = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        res.status(400);
        throw new Error("Client not exist with this Id");
    }

    const updatedClient = await Client.findByIdAndUpdate(_id, {...client, _id}, { new: true })
    
    if(updatedClient){
        res.json(updatedClient);
    }else{
        res.status(400);
        throw new Error("Client not exist with this Id");
    }
})

//DELETE PROFILE
export const deleteClient = asyncHandler(async(req,res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(400);
        throw new Error("Client not exist with this Id");
    }

    const deletedClient = await Client.findByIdAndDelete(id)
    
    if(deletedClient){
        res.json({ message: "Client deleted successfully.", data: deletedClient});
    }else{
        res.status(400);
        throw new Error("Client not exist with this Id");
    }
})

//GET CLIENTS BY USER
export const getClientsByUser = asyncHandler(async(req,res) => {
    const { searchQuery } = req.query;
    console.log(searchQuery);

    const client = await Client.find({ userId: searchQuery });

    if(client.length !== 0){
        res.json({ data: client});
    }else if(client.length === 0){
        res.json({data:[]})
    }
    else{
        res.status(400);
        throw new Error("Client not exist");
    }
})
