const nodemailer = require('nodemailer');
const config = require('../config.json');
const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.json(),
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'log/combined.log'
        })
    ],
});
let mySendmail = function (fromMessage, toMessage, subjectMessage, textMessage, htmlMessage, attachments) {

    let transportConfig = {
        secure: config.secure, 
        auth: {
            user: config.user,
            pass: config.pass
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    }

    if( config.service == "NA"){
        transportConfig.host = config.host
        transportConfig.port = config.port
    }else{
        transportConfig.service = config.service
    }
    let transporter = nodemailer.createTransport(transportConfig);

    let mailOptions = {
        from: fromMessage,
        to: toMessage,
        subject: subjectMessage,
        text: textMessage,
        html: htmlMessage,
        attachments: attachments
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.response);
        logger.log({
            level: 'info',
            'timeStamp': new Date,
            'to': mailOptions.to,
            'status': info.response
        });
    });

}

module.exports = mySendmail
