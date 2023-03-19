import mongoose from "mongoose";
import validator from "validator";

const profileSchema = mongoose.Schema({
    name: String,
    email:{
        type: String,
        required:[true,"Please add an email"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    phoneNumber: String,
    businessName: String,
    contactAddress: String,
    paymentDetails: String,
    logo:{
        type: Object,
        default: {},
    },
    website: String,
    userId:[String],
},{
    timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;