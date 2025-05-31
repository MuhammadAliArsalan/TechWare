// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     host: process.env.NODEMAIL_HOST,
//     port: Number(process.env.NODEMAIL_PORT),
//     secure: false, 
//     auth: {
//       user: process.env.NODEMAIL_USER,
//       pass: process.env.NODEMAIL_PASS,
//     },
// });

// export default transporter;

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.NODEMAIL_SERVICE, // e.g., 'gmail', 'yahoo', etc.
  host: process.env.NODEMAIL_HOST,
  port: process.env.NODEMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.NODEMAIL_USER, // your email
    pass: process.env.NODEMAIL_PASS // use an app password, not your regular password
  }
});

// Test the configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log("SMTP server connection error:", error);
  } else {
    console.log("SMTP server connection established");
  }
});

export default transporter;

