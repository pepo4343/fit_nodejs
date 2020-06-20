"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.mongoConnect = void 0;
const mongodb_1 = __importDefault(require("mongodb"));
const config_1 = __importDefault(require("../config"));
const MongoClient = mongodb_1.default.MongoClient;
let _db;
exports.mongoConnect = (callback) => {
    MongoClient.connect(`mongodb://${config_1.default.db.hostname}:27017/${config_1.default.db.dbname}`, {
        useUnifiedTopology: true
    })
        .then(client => {
        console.log("Connected to MongoDB!");
        _db = client.db();
        callback();
    })
        .catch(err => {
        console.log(err);
        throw err;
    });
};
exports.getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No database found!";
};
