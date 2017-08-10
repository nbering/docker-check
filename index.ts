import * as express from "express";

const app = express();

app.get("/health-check", (req, res, next) => {
    console.log("Request git /health-check");
    res.status(200)
        .end();
});

app.listen(8080, function(){
    console.log("Listening on port 8080.");
});
