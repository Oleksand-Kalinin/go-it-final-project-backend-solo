import mongoose from "mongoose";

const waterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 50,
        max: 15000,
    },
    date: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Water = mongoose.model("Water", waterSchema);

export { Water };
