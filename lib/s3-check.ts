import * as express from "express";
import {S3} from "aws-sdk";
import * as uuid from "uuid/v1";

import {S3_BUCKET, S3_PREFIX} from "./config";

export const s3Router = express.Router();

s3Router.get('/s3-check', testSetup, testPutObject, testGetObject,
    testDeleteObject, testGetObjectVersion, testListObjectVersions,
    testListObjects, doneTests)

function testSetup(
    req: IS3Request,
    res: express.Response,
    next: express.NextFunction)
{
    if (!S3_BUCKET)
        return res.status(500).json({error:"No S3 Bucket Configured."});
    
    req.test = {
        results: [],
        guid: uuid(),
        client: new S3(),
        bucket: S3_BUCKET
    };

    next();
}

function testPutObject(
    req: IS3Request,
    res: express.Response,
    next: express.NextFunction
)
{
    if (!req.test)
        return next(new Error("Test properties missing on request object."));

    let test = req.test;

    let params = {
        Bucket: req.test.bucket,
        Key: `${S3_PREFIX}${req.test.guid}`,
        ServerSideEncryption: "AES256"
    }

    req.test.client.putObject(params, (err, result) => {
        let results: IS3TestResult = {
            action: "s3:PutObject",
            success: !err,
            message: `Object key: ${params.Key}`
        };
        test.results.push(results);
        if (result && result.VersionId)
            test.savedObjectVersion = result.VersionId;
        next();
    });
}

function testGetObject(
    req: IS3Request,
    res: express.Response,
    next: express.NextFunction
)
{
    if (!req.test)
        return next(new Error("Test properties missing on request object."));
    let test = req.test;
    if (checkForError(test.results))
        return next();
    
    let params = {
        Bucket: req.test.bucket,
        Key: `${S3_PREFIX}${req.test.guid}`
    }
    
    req.test.client.getObject(params, (err, result) => {
        let results: IS3TestResult = {
            action: "s3:GetObject",
            success: !err
        };
        test.results.push(results);
        next();
    });
}

function testDeleteObject(
    req: IS3Request,
    res: express.Response,
    next: express.NextFunction
)
{
    if (!req.test)
        return next(new Error("Test properties missing on request object."));
    let test = req.test;
    if (checkForError(test.results))
        return next();
    
    let params = {
        Bucket: req.test.bucket,
        Key: `${S3_PREFIX}${req.test.guid}`
    }
    
    req.test.client.deleteObject(params, (err, result) => {
        let results: IS3TestResult = {
            action: "s3:DeleteObject",
            success: !err
        };
        test.results.push(results);
        next();
    });
}

function testListObjectVersions(
    req: IS3Request,
    res: express.Response,
    next: express.NextFunction
)
{
    if (!req.test)
        return next(new Error("Test properties missing on request object."));
    let test = req.test;
    if (checkForError(test.results))
        return next();
    
    let params = {
        Bucket: req.test.bucket,
        Prefix: `${S3_PREFIX}${req.test.guid}`
    }
    
    req.test.client.listObjectVersions(params, (err, result) => {
        let results: IS3TestResult = {
            action: "s3:ListBucketVersions",
            success: !err
        };
        test.results.push(results);
        next();
    });
}

function testGetObjectVersion(
    req: IS3Request,
    res: express.Response,
    next: express.NextFunction
)
{
    if (!req.test)
        return next(new Error("Test properties missing on request object."));
    let test = req.test;
    if (checkForError(test.results))
        return next();
    if (!test.savedObjectVersion){
        test.results.push({
            action:"s3:GetObjectVersion",
            success: false,
            message: "Did not have a vesion ID to get. Is versioning enabled?"
        });
        return next()
    }
    
    let params = {
        Bucket: req.test.bucket,
        Key: `${S3_PREFIX}${req.test.guid}`,
        VersionId: test.savedObjectVersion
    }
    
    req.test.client.getObject(params, (err, result) => {
        let results: IS3TestResult = {
            action: "s3:GetObjectVersion",
            success: !err,
            message: `Object version: ${test.savedObjectVersion}`
        };
        test.results.push(results);
        next();
    });
}

function testListObjects(
    req: IS3Request,
    res: express.Response,
    next: express.NextFunction
)
{
    if (!req.test)
        return next(new Error("Test properties missing on request object."));
    let test = req.test;
    
    let params = {
        Bucket: req.test.bucket
    }
    
    req.test.client.listObjects(params, (err, result) => {
        let results: IS3TestResult = {
            action: "s3:ListBucket",
            success: !err
        };
        test.results.push(results);
        next();
    });
}

function doneTests(
    req: IS3Request,
    res: express.Response,
    next: express.NextFunction
)
{
    if (!req.test)
        return next(new Error("Test properties missing on request object."));
    let test = req.test;
    if (checkForError(test.results))
        res.status(500)
    else
        res.status(200)
    res.json({results:test.results})
}

function checkForError(results: IS3TestResult[]){
    if (!results || !results.length)
        return true;
    return !results[results.length - 1].success;
}


interface IS3Request extends express.Request{
    test?: {
        results: IS3TestResult[];
        guid: string;
        client: S3;
        bucket: string;
        savedObjectVersion?: string;
    }
}

interface IS3TestResult{
    action: string;
    success: boolean;
    message?: string;
}
