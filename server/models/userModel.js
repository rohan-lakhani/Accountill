import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
        },
        email: {
            type: String,
            required: [true, "Please add an email"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Please add a password"],
            minLength: [6, "Password must be up to 6 characters"],
            //   maxLength: [23, "Password must not be more than 23 characters"],
        },
        resetToken: String,
        expireToken: Date,
    },
    {
        timestamps: true,
    }
);

//DOCUMENT MIDDLEWARE
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    //Hash Password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});

const User = mongoose.model("User", userSchema);
export default User;
