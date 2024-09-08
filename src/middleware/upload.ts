import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3Client } from '../config/aws'; 

//middleware to upload file
export const upload = multer({
  storage: multerS3({
    s3: s3Client, 
    bucket: process.env.AWS_S3_BUCKET_NAME as string, 
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueName = `${Date.now().toString()}_${file.originalname}`;
      cb(null, uniqueName); 
    },
  }),
});
