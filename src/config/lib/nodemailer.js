var nodemailer = require('nodemailer');
var aws = require('aws-sdk');
console.log(aws.config.credentials)

module.exports = function () {
var mailer = {};

// mailer.smtpTransport = nodemailer.createTransport(
//     {
//         service: 'SES',
//         auth: {
//             user: "AKIAIOJ4KLYW5MBQPYNQ",
//             pass: "AlY0gmwKdJXkT/KSLQt2xAi9N638sZhbvNWZvKUioodS"
//         }
//     });

mailer.sesTransport = nodemailer.createTransport({
        SES: new aws.SES({
            apiVersion: '2010-12-01'
        })
    });

return mailer;
}

// // send some mail
// mailer.sesTransport.sendMail({
//     from: 'sender@example.com',
//     to: 'recipient@example.com',
//     subject: 'Message',
//     text: 'I hope this message gets sent!',
//     ses: { // optional extra arguments for SendRawEmail
//         Tags: [{
//             Name: 'tag name',
//             Value: 'tag value'
//         }]
//     }
// }, (err, info) => {
//     console.log(info.envelope);
//     console.log(info.messageId);
// });
