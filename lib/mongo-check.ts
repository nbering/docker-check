import {MongoClient} from "mongodb";
import {Router} from "express";
import {MONGODB_URL} from "./config";

export const mongoRouter = Router();

mongoRouter.get("/mongodb-check", (req, res, next) => {
    console.log("Requested MongoDB health check...");
    MongoClient.connect(MONGODB_URL, (err, db) => {
        if (err){
            console.error(`MongoDB health check returned error:\n${err.toString()}`);
            return res.status(503).end();
        }
        db.close();
        console.log("MongoDB health check success.");
        res.status(200).end();
    })
});
