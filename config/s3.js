const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1", // Default to us-east-1 if not set
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// AWS.config.update({ region: process.env.AWS_REGION });

// const s3 = new AWS.S3();

module.exports = { s3 };
