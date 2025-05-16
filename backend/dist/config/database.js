"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("dotenv/config");
const typeorm_1 = require("typeorm");
const User_1 = require("../models/User");
const Feedback_1 = require("../models/Feedback");
const Suggestion_1 = require("../models/Suggestion");
const env_1 = require("./env");
const commonOptions = {
    entities: [User_1.User, Feedback_1.Feedback, Suggestion_1.Suggestion],
    subscribers: [],
    migrations: [],
    synchronize: true,
    logging: false,
};
exports.AppDataSource = new typeorm_1.DataSource(Object.assign({ type: 'postgres', host: env_1.env.DB_HOST, port: parseInt(env_1.env.DB_PORT), username: env_1.env.DB_USER, password: env_1.env.DB_PASS, database: env_1.env.DB_NAME, poolSize: 20, maxQueryExecutionTime: 1000, extra: {
        statement_timeout: 30000,
        idle_in_transaction_session_timeout: 30000,
    } }, commonOptions));
