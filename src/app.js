const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5500;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/clientDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB connection successful message
mongoose.connection.once('open', () => {
  console.log('MongoDB connected successfully');
});

// Define Client Schema
const clientSchema = new mongoose.Schema({
  clientName: String,
  companyName: String,
  profileImage: String,
  userName: String,
  password: String,
  emailId: String,
  phoneNo: String,
  description: String,
});

const Client = mongoose.model('Client', clientSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Serve static files (if needed)
app.use(express.static('public'));

// Routes
app.post('/api/clients', upload.single('profileImage'), async (req, res) => {
  try {
    const newClient = new Client({
      clientName: req.body.clientName,
      companyName: req.body.companyName,
      profileImage: req.file ? req.file.path : '',
      userName: req.body.userName,
      password: req.body.password,
      emailId: req.body.emailId,
      phoneNo: req.body.phoneNo,
      description: req.body.description,
    });

    await newClient.save();
    res.status(200).json({ message: 'Client profile created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client profile' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
