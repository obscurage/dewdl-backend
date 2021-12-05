const mongoose = require("mongoose");
const helper = require("../v1/tests/test_helper");
const Event = require("../v1/models/event");
const config = require("./config");
const logger = require("./logger");

const clearDatabase = async () => {
    logger.info("emptying db");
    await Event.deleteMany({});
};

const initializeDatabase = async () => {
    logger.info("initializing db");
    await Event.insertMany(helper.initialEvents);
};

const seedDb = async () => {
    await mongoose.connect(config.MONGODB_URI)
        .then(() => {
            logger.info("connected to MongoDB");
        })
        .catch((error) => {
            logger.error("error connecting to MongoDB:", error.message);
        });

    await clearDatabase();
    await initializeDatabase();
    mongoose.connection.close();
};

seedDb();