import createHttpError from "http-errors";
import { addWater, deleteWater, getWaterByDay, getWaterByMonth, patchWater } from "../services/water.js";

export const addWaterController = async (req, res) => {
    const userId = req.user.id;
    const { amount, date } = req.body;

    if (!amount || !date) {
        throw createHttpError(400, "Bad request, please fill all fields!");
    }

    const addedWater = await addWater(userId, amount, date);

    res.status(201).json({
        status: 201,
        message: "Successfully added water!",
        data: addedWater,
    });
};

export const patchWaterController = async (req, res, next) => {
    const { id } = req.params;

    const result = await patchWater(id, { ...req.body });

    if (!result) {
        next(createHttpError(404, "Water record not found!"));
        return;
    }

    res.json({
        status: 200,
        message: "Successfully edit water record!",
        data: result,
    });
};



export const deleteWaterController = async (req, res, next) => {
    const { id } = req.params;

    const result = await deleteWater(id);

    if (!result) {
        next(createHttpError(404, "Water record not found!"));
        return;
    }

    res.status(204).send();
};

export const getWaterByDayController = async (req, res, next) => {
    const { user: { id: userId } } = req;
    const date = req.params.date.slice(0, 10);

    if (!date) {
        throw createHttpError(400, "Date is required!");
    }

    const data = await getWaterByDay(userId, date);

    res.json({
        status: 200,
        message: "Successfully fetched water data by day!",
        data: data
    });
};

export const getWaterByMonthController = async (req, res, next) => {
    const { user: { id: userId } } = req;
    const date = req.params.date.slice(0, 7);

    if (!date) {
        throw createHttpError(400, "Date is required!");
    }

    const data = await getWaterByMonth(userId, date);

    res.json({
        status: 200,
        message: "Successfully fetched water data by month!",
        data: data
    });
};
