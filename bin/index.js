const SMTPServer = require('smtp-server').SMTPServer;
const simpleParser = require('mailparser').simpleParser;
const sendMail = require('./send');
const express = require('express');
const app = express();
const config = require('../config.json');

const startApp = () => {
    const server = new SMTPServer({
        secure: false,
        authOptional: true,
        logger: true,
        hideSTARTTLS: true,
        onData(stream, session, callback) {
            stream.on('data', () => { null });
            stream.on('end', callback);
            simpleParser(stream)
                .then(mail => {
                    sendMail(mail.from.text, mail.to.text, mail.subject, mail.text, mail.html,mail.attachments)
                })
                .catch(err => { });
        }
    });
    
    if (server.listen(config.mport, '0.0.0.0')){
        
        app.get('/', function (req, res) {
            res.send('Email Relay Running');
        });
        app.listen(3000, function () {
            console.log('Email Relay has started');
        });
    }

}

exports.startApp = startApp