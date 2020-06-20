"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const watersystem_1 = __importDefault(require("./routes/watersystem"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = require("./utils/db");
const app = express_1.default();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
// Setup body-parser
app.use(body_parser_1.default.json()); // application/json
app.use(body_parser_1.default.urlencoded({ extended: true })); //application/x-www-form-urlencoded
app.use("/watersystem", watersystem_1.default);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
db_1.mongoConnect(() => {
    app.listen(3000, () => {
        console.log("running on port 300");
    });
});
