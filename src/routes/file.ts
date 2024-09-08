import express from 'express';
import { upload } from '../middleware/upload';

const router = express.Router();

//route to get back fileurl 
router.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file as Express.MulterS3.File;

  if (!file) {
    return res.status(400).json({
      error: 'No file uploaded' 
    });
  }

  const fileUrl = file.location;

  res.status(200).json({
    message: 'File upl;oaded successfully',
    fileUrl: fileUrl,
  });
});

export default router;
