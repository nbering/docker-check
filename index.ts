import * as express from "express";
import {CONFIG} from  "./lib/config";
import {s3Router} from "./lib/s3-check";
import {DiagnosticRouter} from "./lib/request-diagnostic";

const app = express();

const cors = {
    origin: "https://nicholasbering.ca",
    methods: ["GET", "PUT", "POST"],
    allowedHeaders: ["Content-Type"]
}

app.get("/health-check", (req, res, next) => {
    console.log("Request get /health-check");
    res.status(200)
        .end();
});

app.use("/", s3Router);

if (CONFIG.diagnostics){
    CONFIG.diagnostics.forEach(val => {
        app.use(DiagnosticRouter(val));
    });
}

const server = app.listen(8080, function(){
    console.log("Listening on port 8080.");
});

process.on("SIGINT", () => {
    console.log("Server received SIGINT, shutting down...");
    console.log("Closing HTTP server...");
    server.close(() => {
        console.log("HTTP server closed.");
    });
});
