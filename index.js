require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const cors = require('cors')
const bodyParser = require('body-parser')
const aws = require("aws-sdk");
app.use(cors())
app.use(bodyParser.json())
const https = require('https')
const aws4 = require('aws4')
const request = require('request');
const crypto = require("crypto-js");


aws.config.setPromisesDependency()
aws.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: 'us-east-1',
    signatureVersion: 'v4',
})
const s3 = new aws.CloudWatch()
console.log(s3.config)

const params = {
    EndTime: new Date() /* required */,
    /* required */
    MetricName: 'EngineCPUUtilization',
    Namespace: 'AWS/S3',
    StartTime: new Date('Mon Dec 6 2021') /* required */,
    /* required */
    Dimensions: [
        {
            Name: 'Per-Instance Metrics' /* required */,
            Value: 'i-abbc12a7' /* required */,
        },
        {
            Name: 'StorageType',
            Value: 'AllStorageTypes',
        },
        /* more items */
    ],

    Period: 300 /* required */,
    Statistics: ['Average'] /* required */,
}


 function asyncMethod() {
    return  s3.getMetricStatistics(params).promise()
        .then(data => {
            console.log(data)
            /* do stuff with d here */
        })
        .catch(err => {
            console.log(err);
        });
}

const d = asyncMethod()



let date_ob = getAmzDate(new Date().toISOString());

const test = getSignatureKey('WPjPCzTrt78ZZq4yVlpM8gqRI1z8M1F0RUF31iLB', '20220407', 'us-east-1', 'monitoring')

const options1 = {
    'method': 'POST',
    'url': 'https://monitoring.us-east-1.amazonaws.com/?Action=ListMetrics&Version=2010-08-01&signatureVersion=v4',
    'headers': {
        'X-Amz-Date': date_ob,
        'Authorization': 'AWS4-HMAC-SHA256 Credential=AKIA6G4NF3L246WTBCXY/20220407/us-east-1/monitoring/aws4_request, SignedHeaders=host;x-amz-date, Signature=' + test
    }
};


const options = {
    'method': 'POST',
    'url': 'https://monitoring.us-east-1.amazonaws.com/?Action=ListMetrics&Version=2010-08-01&signatureVersion=v4',
    'headers': {
        'X-Amz-Date': '20220407T150800Z',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=AKIA6G4NF3L246WTBCXY/20220407/us-east-1/monitoring/aws4_request, SignedHeaders=host;x-amz-date, Signature=2e27a777c0f51107089389eaa6fb63cf03f4257ed14a2231b5dd48adfed893d2'
    }
};
// request(options, function (error, response) {
//     if (error) throw new Error(error);
//     console.log("AWS OUTPUT" + response.body);
// });


function getSignatureKey(key, dateStamp, regionName, serviceName) {
    const kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
    const kRegion = crypto.HmacSHA256(regionName, kDate);
    const kService = crypto.HmacSHA256(serviceName, kRegion);
    const kSigning = crypto.HmacSHA256("aws4_request", kService);
    return kSigning.toString();
}


function getAmzDate(dateStr) {
    const chars = [":", "-"];
    for (let i = 0; i < chars.length; i++) {
        while (dateStr.indexOf(chars[i]) != -1) {
            dateStr = dateStr.replace(chars[i], "");
        }
    }
    dateStr = dateStr.split(".")[0] + "Z";
    return dateStr;
}


// function getSignatureKey(key, dateStamp, regionName, serviceName) {
//     const kDate = crypto.createHmac('sha256', `${dateStamp} AWS4 ${key}`).update('nodejsera').digest('hex')
//     const kRegion = crypto.createHmac('sha256', `${regionName} ${kDate}`).update('nodejsera').digest('hex')
//     const kService = crypto.createHmac('sha256', `${serviceName} ${kRegion}`).update('nodejsera').digest('hex')
//     const kSigning = crypto.createHmac('sha256', `aws4_request ${kService}`).update('nodejsera').digest('hex')
//     return kSigning;
// }

app.get('/', (req, res) => {

    const payload = [
        {argument: 1, value: 10},
        {argument: 2, value: 20},
        {argument: 3, value: 30},
    ]

    res.send(JSON.stringify({"status": 200, "error": null, "response": payload}));
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
