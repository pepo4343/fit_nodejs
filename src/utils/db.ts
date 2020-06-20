import mongodb, { Db } from 'mongodb';

import config from '../config'

const MongoClient = mongodb.MongoClient;

let _db:Db;


export const mongoConnect = (callback: ()=>void ) => {
    MongoClient.connect(`mongodb://${config.db.hostname}:27017/${config.db.dbname}`, {
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
}

export const getDb:()=>Db = () => {
    if (_db) {
        return _db;
    }

    throw "No database found!";
}

