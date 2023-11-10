import Imap from 'node-imap';
import nodemailer from 'nodemailer';
import EmailParser from 'email-reply-parser';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { transporter } from '../util.js';

const mailSenderRouter = express.Router();

const imapConfig = {
  user: 'read@login.roonberg.com',
  password: 'pass@$123',
  host: 'login.roonberg.com',
  port: 143, // IMAP port
  tls: false, // Use TLS if required
};



const imap = new Imap(imapConfig);

// Function to send an email
function sendEmail(to, subject, message) {
  const mailOptions = {
    from: 'deepraj41352@email.com', 
    to,
    subject,
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

imap.once('ready', () => {
  imap.openBox('INBOX', false, (err, mailbox) => {
    if (err) throw err;

    imap.search(['UNSEEN'], (err, results) => {
      if (err) throw err;

      results.forEach((emailNumber) => {
        const emailMessage = imap.fetch(emailNumber, { bodies: '' });
        emailMessage.on('message', (msg) => {
          msg.on('body', (stream) => {
            let message = '';
            stream.on('data', (chunk) => {
              message += chunk.toString('utf8');
            });
            stream.once('end', () => {
              const parser = new EmailParser(message);
              const { text, from, to, subject, date } = parser.parseReply();

              // Your processing logic here

              console.log('From:', from);
              console.log('To:', to);
              console.log('Subject:', subject);
              console.log('Text:', text);

              // Example: Send an email reply
              sendEmail(from, 'Re: ' + subject, 'Your reply message goes here');

              // Mark the email as seen
              imap.addFlags(emailNumber, ['\\Seen'], (err) => {
                if (err) console.error(err);
              });
            });
          });
        });
      });

      // Close the connection
      imap.end();
    });
  });
});

imap.once('error', (err) => {
  console.error(err);
});

imap.connect();
export default mailSenderRouter;
