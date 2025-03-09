const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const { S3Client } = require("@aws-sdk/client-s3");

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to clean and generate a unique filename
const cleanFileName = (originalname) => {
  const name = originalname
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_.]/g, "");
  const timestamp = Date.now();
  const ext = path.extname(originalname);
  const baseName = path.basename(name, ext);
  return `${baseName}-${timestamp}${ext}`;
};

// Multer configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    // acl: "public-read", // Adjust based on your requirements
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(
        null,
        `assignments/images/${req.params.assignmentId}/${cleanFileName(
          file.originalname
        )}`
      );
    },
  }),
});

module.exports = { upload };
