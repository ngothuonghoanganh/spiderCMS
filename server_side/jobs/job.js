const fs = require('fs');
const path = require('path');
const Batch = require('batch');
const helpers = require('../services/helpers');
const model = require('../config/model');
const configs = require('../config/const');
const sequelize = require('sequelize')
module.exports = {
  deleteAvatarsTemp() {
    model.variable.findOne({
      where: {
        key: 'deleteAvatarsTemp',
      },
    }).then((variable) => {
      if (helpers.checkVariable(variable)) {
        const objectVariable = JSON.parse(variable.dataValues.data);

        if (objectVariable.active === true) {
          const avatarFolder = `${path.resolve()}/public/images/temp/`;

          return fs.readdir(avatarFolder, (err, files) => {
            if (helpers.checkArray(files)) {
              const batch = new Batch();
              batch.concurrency(10);
              console.log('start job delete unuse avatar images');
              files.forEach((file) => {
                batch.push((done) => {
                  setTimeout(() => {
                    helpers.deleteImage(`${avatarFolder}${file}`);
                    done();
                  }, 200);
                });
              });

              let percentage;
              batch.on('progress', (job) => {
                console.log(job);
                if (!helpers.checkVariable(percentage)) {
                  percentage = job.percent;
                }

                if (job.percent > percentage) {
                  percentage = job.percent;
                  console.log(`percentage: ${percentage}%`);
                }
              });

              batch.end((batchErr, handledFiles) => {
                console.log(`deleted ${handledFiles.length} files`);
              });
            } else {
              console.log('folder temp is clean');
            }
          });
        }
      }
    });
  },
  createBirthdayNotification() {

    model.variable.findOne({
      where: {
        key: 'createBirthdayNotification',
      },
    }).then((variable) => {
      if (helpers.checkVariable(variable)) {
        const objectVariable = JSON.parse(variable.dataValues.data);
        if (objectVariable.active === true) {
          let today = new Date();
          let currentMonth = today.getMonth(); // January is 0;
          let currentYear = today.getFullYear();
          let nextMonth = currentMonth + 1;
          let nextYear = currentYear;
          if (currentMonth == 11) {
            nextMonth = 0;
            nextYear++;
          }
          let endNextMonth = nextMonth + 1;
          let endNextYear = nextYear;
          if (nextMonth == 11) {
            endNextMonth = 0;
            endNextYear++;
          }
          // let startDate = new Date(nextYear, nextMonth, 1, 0, 0, 0, 0) / 1000;
          // let endDate = new Date(endNextYear, endNextMonth, 1, 0, 0, 0, 0) / 1000;
          // console.log(endNextMonth)
          let query = `SELECT id FROM profiles 
                      WHERE MONTH(birthday) = ${endNextMonth}
                      AND isActive = 1
                      AND haveAccount = 0`;
          let now = helpers.getNow();

          // return model.sequelize.query(`SELECT id FROM profiles 
          //                               WHERE MONTH(birthday) = ${endNextMonth}
          //                               AND isActive = 1
          //                               AND haveAccount = 0`, { type: sequelize.QueryTypes.SELECT})
          //                             .then((results) => {
          //                               console.log(results)
          //                             })
          return model.sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
          }).then((results) => {
            console.log(results)
            if (helpers.checkArray(results)) {
              let arrProfileId = [];
              results.forEach((result) => {
                arrProfileId.push(result.id);
              });

              return model.profile.findAll({
                where: {
                  haveAccount: 1,
                  isActive: 1,
                },
                attributes: ['id'],
              }).then((profileIds) => {
                if (helpers.checkArray(profileIds)) {
                  let notiContents = JSON.stringify(arrProfileId);
                  let dataContentInsert = {
                    title: configs.titleNotiBirthday,
                    teaser: `Birthday notification in month ${nextMonth + 1} of year ${nextYear}`,
                    content: notiContents,
                    createdAt: now,
                    updatedAt: now
                  };

                  return model.typeObject.findOne({
                    where: {
                      name: 'NotiBirthday'
                    }
                  }).then((typeObject) => {
                    if (helpers.checkVariable(typeObject)) {
                      return model.content.create(dataContentInsert).then((inserted) => {
                        let dataNotiInsert = [];
                        profileIds.forEach((profileId) => {
                          dataNotiInsert.push({
                            from: configs.fromNotiBirthday,
                            to: profileId.id,
                            content: inserted.dataValues.id,
                            type: typeObject.dataValues.id,
                            isRead: 0,
                            createdAt: now,
                            updatedAt: now
                          });
                        });
                        return model.notification.bulkCreate(dataNotiInsert);
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  },
};