const multer = require("multer");
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if(!(fs.existsSync("storage"))){
      fs.mkdir("storage", (error)=>{
        console.log(error)
      })
    }
    cb(null, "storage");
  },
  filename: (req, file, cb) => {
    /* const ext = file.originalname.split(".").pop(); */
    const ext = file.mimetype.split("/").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage });

module.exports = upload;