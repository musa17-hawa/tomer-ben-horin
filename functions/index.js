const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

const gmailEmail = 'fatimaabuabed14902@gmail.com'; // sender and receiver
const gmailPassword = 'YOUR_APP_PASSWORD'; // <-- Replace with your Gmail App Password
const adminReceiver = 'fatimaabuabed14902@gmail.com'; // receiver

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendRegistrationEmail = functions.firestore
  .document('registrations/{registrationId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const mailOptions = {
      from: gmailEmail,
      to: adminReceiver,
      subject: 'New Exhibition Registration',
      text: `A new registration was submitted by ${data.fullName} for exhibition ID: ${data.exhibitionId}.`,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent to admin');
    } catch (error) {
      console.error('Error sending email:', error);
    }
    return null;
  }); 