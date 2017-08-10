import * as express from "express";
import {mongoRouter} from "./lib/mongo-check";

const app = express();

app.get("/health-check", (req, res, next) => {
    console.log("Request get /health-check");
    res.status(200)
        .end();
});

app.use("/", mongoRouter);

app.listen(8080, function(){
    console.log("Listening on port 8080.");
});
