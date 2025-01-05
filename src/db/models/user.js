import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender:{
        type: String,
        enum: ["woman", "man",],
        default: "woman"
    },
    weight: {
        type: Number,
        default: 60
    },
    sportHours: {
        type: Number,
        default: 1
    },
    photo: {
        type: String,
        default: "https://res.cloudinary.com/dnepourus/image/upload/v1732976930/uposr5jajefqkveozjyo.jpg"
    },
    waterNorm: {
        type: Number,
        default: 1500
    }
},{
    versionKey: false, timestamps: true,
});

userSchema.methods.toJSON = function(){
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model("User", userSchema);

export { User };
