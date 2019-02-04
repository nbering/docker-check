import {Router, Request, Response, NextFunction} from "express";
import * as Cors from "cors";

export function DiagnosticRouter(opts?: IDiagnosticRouterOptions): Router {
    const router = Router();

    opts = opts || {path: "/"};

    if (opts.cors)
        router.use(opts.path, Cors(opts.cors));

    router.all(opts.path, (req, res, next) => {
        console.log (`Diagnost Event: ${req.method} ${req.url} HTTP/${req.httpVersion}`);
        res.status(200);
        res.send({});
    });

    return router;
}

export interface IDiagnosticRouterOptions {
    path: string;
    cors?: Cors.CorsOptions;
}
