const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const serverConfig = require(`${path.resolve()}/config/mail-server.js`);
const helpers = require(`${path.resolve()}/services/helpers`);
const serverCfg = require(`${path.resolve()}/config/server`);

const transporter = nodemailer.createTransport({
  service: serverConfig.service,
  host: serverConfig.host,
  secure: serverConfig.secure,
  auth: {
    user: serverConfig.auth.user,
    pass: serverConfig.auth.pass,
  },
  tls: {
    rejectUnauthorized: serverConfig.tls.rejectUnauthorized,
  },
});

module.exports = {
  sendEmail(params) {
    return new Promise((result) => {
      const template = `${path.resolve()}/views/active-mail-template.ejs`;

      helpers.getPublicIp().then((ip) => {
        const currentIp = `${ip}:${serverCfg.port}` || params.currentIp;
        // let currentIp = '192.168.0.2:3003';

        const templateParams = {
          stringEncrypted: `http://${currentIp}/api/active-account?enc=${params.token}`,
          imageURL: 'https://docs.google.com/uc?id=10gdFjYog5_rAnubcucM84llepOBOBux_',
        };

        ejs.renderFile(template, templateParams, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            const mainOptions = {
              from: '"Spider Company" quan@spider.vn',
              to: params.receiver,
              subject: 'Spider Registration confirmation',
              html: data,
            };

            transporter.sendMail(mainOptions, (errSending, info) => {
              if (errSending) {
                console.log(errSending);
                result('failed');
              } else {
                console.log(`Message sent: ${info.response}`);
                result('successfully');
              }
            });
          }
        });
      });
    });
  },
};
