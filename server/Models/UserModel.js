import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String },

        email: { type: String, required: true },
        password: { type: String, required: true },
        profilePicture: String

    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);
