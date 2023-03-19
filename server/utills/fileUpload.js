import cloudinaryy from 'cloudinary'
const cloudinary = cloudinaryy.v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
import {CloudinaryStorage} from "multer-storage-cloudinary";
import multer from 'multer';
// const multer = require("multer");

cloudinary.config({
    cloud_name: 'dyoq8stgr',
    api_key: '196779951973952',
    api_secret: '2NpoAIaBwD0HHfX-hEr-ERGDIDI'
  });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Accountill",
  },
});

const upload = multer({ storage });

export default upload;