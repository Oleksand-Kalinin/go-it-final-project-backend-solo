import { Water } from "../db/models/water.js";

export const addWater = async (userId, amount, date) => {
    const waterRecord = await Water.create({ userId, amount, date });
    return waterRecord;
};



export const patchWater = async (id, payload) => {
    const editedWater = await Water.findOneAndUpdate(
        { _id: id},
        payload,
        { new: true });

    return editedWater;
};

export const deleteWater = async (id) => {
    const deletedWater = await Water.findByIdAndDelete({ _id: id});
    return deletedWater;
};

export const getWaterByDay = async (userId, date) => {
    const startOfDay = `${date}T00:00:00`;
    const endOfDay = `${date}T23:59:59`;

    const records = await Water.find({
        userId,
        date: {
            $gte: startOfDay,
            $lte: endOfDay,
        },
    });

    return records;
};

export const getWaterByMonth = async (userId, date) => {
    const records = await Water.find({
        userId,
        date: {
            $regex: `^${date}`,
        }
    });

    return records;
};
