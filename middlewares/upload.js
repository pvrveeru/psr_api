const multer = require("multer");
const path = require("path");

// Function to clean filename
const cleanFileName = (originalname) => {
  const name = originalname
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9\-_.]/g, ""); // Remove special characters (except -, _, .)

  const timestamp = Date.now(); // Generate a timestamp
  const ext = path.extname(originalname); // Extract file extension
  const baseName = path.basename(name, ext); // Remove extension from name

  return `${baseName}-${timestamp}${ext}`;
};
// Multer Storage (Save Locally Before Upload)
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];
    if (!file.mimetype) {
      return cb(
        new Error(
          "Invalid file type. Only PDF, JPEG, PNG, and GIF files are allowed.",
          false
        )
      );
    }
    const cleanName = cleanFileName(file.originalname);
    cb(null, cleanName);
  },
});

const upload = multer({ storage });
module.exports = { upload };
