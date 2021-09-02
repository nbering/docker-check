import {readFileSync} from "fs"
import {IDiagnosticRouterOptions} from "./request-diagnostic";

export const S3_BUCKET = process.env["S3_BUCKET"];
export const S3_PREFIX = process.env["S3_PREFIX"] || "tests/";

var configJSON: string;

if (typeof process.env["DOCKER_CHECK_CONFIG"] === "string") {
    console.log("Collecting CONFIG from DOCKER_CHECK_CONFIG.")
    configJSON = <string>process.env["DOCKER_CHECK_CONFIG"];
} else if (typeof process.env["DOCKER_CHECK_CONFIG_B64"] === "string") {
    console.log("Collecting CONFIG from DOCKER_CHECK_CONFIG_B64.")
    configJSON = Buffer.from(<string>process.env["DOCKER_CHECK_CONFIG_B64"], "base64").toString("utf8");
} else if (typeof process.env["DOCKER_CHECK_CONFIG_FILE"] === "string") {
    console.log("Collecting CONFIG from DOCKER_CHECK_CONFIG_FILE.")
    configJSON = readFileSync(<string>process.env["DOCKER_CHECK_CONFIG_FILE"], "utf8")
} else {
    console.log("No config found in environment, defaulting to empty config object.")
    configJSON = "{}"
}

export const CONFIG: IDockerCheckConfig = tryParseJSON(configJSON);

function tryParseJSON(str: string): any{
    try {
        return JSON.parse(str)
    } catch (e) {
        console.error("Failed to parse JSON configuration...")
        return;
    }
}

export interface IDockerCheckConfig {
    diagnostics?: IDiagnosticRouterOptions[];
}
