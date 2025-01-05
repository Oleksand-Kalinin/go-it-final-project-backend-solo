import { startServer } from './server.js';
import dotenv from "dotenv";
import {initMongoConnection} from './db/initMongoConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

dotenv.config();

async function bootstrap() {
try {
    await initMongoConnection();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
    startServer();
} catch (error) {
    console.error(error);
}
};

bootstrap();
