const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const multer = require("multer")

cloudinary.config({
  cloud_name: "dnnfclatd",   // thay bằng của bạn
  api_key: "135551877659497",         // thay bằng của bạn
  api_secret: "SQt-zFE0GOk2nq7WcatApzOWegk"    // thay bằng của bạn
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "quan-an",  // tên folder trên Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
})

const upload = multer({ storage })

module.exports = { upload }