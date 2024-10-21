const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/otpdb', { useNewUrlParser: true, useUnifiedTopology: true });

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String
});

const Otp = mongoose.model('Otp', otpSchema);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password'
  }
});

app.post('/api/send-otp', async (req, res) => {
  const email = req.body.email;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  await Otp.create({ email, otp });

  transporter.sendMail({
    to: email,
    subject: 'Your OTP',
    text: `Your OTP is ${otp}`
  });

  res.sendStatus(200);
});

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email, otp });
  
  if (record) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
