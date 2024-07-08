// backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3501;

// Enable CORS
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());
// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({ storage }).single('file');

// Upload endpoint
app.post('/upload', (req, res) => {
  console.log(req.file);
  upload(req, res, (err) => {
    if (err) {
      res.status(500).json({ message: 'Upload failed!' });
    } else if (req.file == undefined || req.file == '' || req.file.filename == null) {
      res.status(400).json({ message: 'No file selected!' });
    } else {
      res.json({ message: 'File uploaded!', file: req.file.filename });
      console.log(req.file.filename);
    }
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));