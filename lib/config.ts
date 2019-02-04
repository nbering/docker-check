import {readFileSync} from "fs"
import {IDiagnosticRouterOptions} from "./request-diagnostic";

export const MONGODB_URL = process.env["MONGODB_URL"] || "mongodb://localhost:27017/admin";
export const S3_BUCKET = process.env["S3_BUCKET"];
export const S3_PREFIX = process.env["S3_PREFIX"] || "tests/";

var configJSON: string;

if (typeof process.env["DOCKER_CHECK_CONFIG"] === "string") {
    configJSON = <string>process.env["DOCKER_CHECK_CONFIG"];
} else if (typeof process.env["DOCKER_CHECK_CONFIG_B64"] === "string") {
    configJSON = Buffer.from(<string>process.env["DOCKER_CHECK_CONFIG_B64"], "base64").toString("utf8");
} else if (typeof process.env["DOCKER_CHECK_CONFIG_FILE"] === "string") {
    configJSON = readFileSync(<string>process.env["DOCKER_CHECK_CONFIG_FILE"], "utf8")
} else {
    configJSON = "{}"
}

export const CONFIG: IDockerCheckConfig = tryParseJSON(configJSON);

function tryParseJSON(str: string): any{
    try {
        return JSON.parse(str)
    } catch (e) {
        return;
    }
}

export interface IDockerCheckConfig {
    diagnostics?: IDiagnosticRouterOptions[];
}
