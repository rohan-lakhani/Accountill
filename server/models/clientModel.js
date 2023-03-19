import mongoose from "mongoose";
import validator from "validator";

const clientSchema = mongoose.Schema({
    name: String,
    email:{
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    phone: String,
    address: String,
    userId: [String],
    createdAt: {
        type: Date,
        default: new Date()
    }
},{
    timestamps: true,
});

const Client = mongoose.model('Client', clientSchema);

export default Client;