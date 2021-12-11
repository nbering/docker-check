import {Router, Request, Response, NextFunction} from "express";
import * as Cors from "cors";
import * as path from "path";

export function ErrorsRouter(opts?: IErrorsRouterOptions): Router {
    const router = Router();

    opts = opts || {basePath: "/errors"};

    if (opts.cors)
        router.use(opts.basePath, Cors(opts.cors));

    router.all(path.join(opts.basePath, "/server-error"), (req, res, next) => {
        console.log (`Invoked Error (intentional): ${req.method} ${req.url} HTTP/${req.httpVersion}`);
        res.status(500);
        res.send({
            status_code: 500,
            message: "Internal Server Error"
        });
    });

    router.all(path.join(opts.basePath, "/not-implemented"), (req, res, next) => {
        console.log (`Invoked Error (intentional): ${req.method} ${req.url} HTTP/${req.httpVersion}`);
        res.status(501);
        res.send({
            status_code: 501,
            message: "Not Implemented"
        });
    });

    router.all(path.join(opts.basePath, "/bad-gateway"), (req, res, next) => {
        console.log (`Invoked Error (intentional): ${req.method} ${req.url} HTTP/${req.httpVersion}`);
        res.status(502);
        res.send({
            status_code: 502,
            message: "Bad Gateway"
        });
    });

    router.all(path.join(opts.basePath, "/service-unavailable"), (req, res, next) => {
        console.log (`Invoked Error (intentional): ${req.method} ${req.url} HTTP/${req.httpVersion}`);
        res.status(503);
        res.send({
            status_code: 503,
            message: "Service Unavailable"
        });
    });

    router.all(path.join(opts.basePath, "/gateway-timeout"), (req, res, next) => {
        console.log (`Invoked Error (intentional): ${req.method} ${req.url} HTTP/${req.httpVersion}`);
        res.status(504);
        res.send({
            status_code: 504,
            message: "Service Unavailable"
        });
    });

    router.all(path.join(opts.basePath, "/version-not-supported"), (req, res, next) => {
        console.log (`Invoked Error (intentional): ${req.method} ${req.url} HTTP/${req.httpVersion}`);
        res.status(505);
        res.send({
            status_code: 505,
            message: "HTTP Version Not Supported"
        });
    });

    return router;
}

export interface IErrorsRouterOptions {
    basePath: string;
    cors?: Cors.CorsOptions;
}
