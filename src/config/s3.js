const {S3Client} = require("@aws-sdk/client-s3")

const s3Client = new S3Client({
    region: process.env.S3_REGION || "us-east-1",
    endpoint: process.env.S3_ENDPOINT || "http://host.docker.internal:9000",
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
    credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
     }
})

module.exports = s3Client;