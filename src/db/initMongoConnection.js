import mongoose from 'mongoose';
import {
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_URL,
    MONGODB_DB,
  } from '../utils/env.js';

const DB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;


async function initMongoConnection(){
    try {
        await mongoose.connect(DB_URI);

        console.log("Mongo connection successfully established!");
    }
    catch(error){
            console.error(error);
            throw error;
    }
};

export{initMongoConnection};
