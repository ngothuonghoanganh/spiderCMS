const cron = require('node-cron');
const helpers = require('../services/helpers');
const cronJob = require('../config/cronjob');
const job = require('../jobs/job');
const model = require('../config/model');

const arrFind = [];

cronJob.forEach((item) => {
  arrFind.push(item.key);
});

const arrayTask = [];

module.exports = {
  init() {
    return model.variable.findAll({
      where: {
        key: { $in: arrFind },
      },
    })
      .then((jobs) => {
        if (!helpers.checkArray(jobs)) {
          return [];
        }

        jobs.forEach((rowJob) => {
          const objectJob = JSON.parse(rowJob.dataValues.data);
          // console.log(objectJob)
          arrayTask.push({
            key: objectJob.job,
            status: 'init',
            task: cron.schedule(objectJob.time, job[objectJob.job]),
          });
          
        });
        arrayTask.forEach((objectTask) => {
          this.startTask(objectTask.key);
        });
      });
  },

  startTask(key) {
    arrayTask.forEach((objectTask) => {
      if (objectTask.key === key) {
        console.log(`start cronjob: ${objectTask.key}`);
        objectTask.status = 'started';
        objectTask.task.start();
      }
    });
  },
  
  stopTask(key) {
    arrayTask.forEach((objectTask) => {
      if (objectTask.key === key) {
        console.log(`stop cronjob: ${objectTask.key}`);
        objectTask.status = 'stopped';
        objectTask.task.stop();
      }
    });
  },
  
  restartTask(key) {
    console.log(key)
    for (let i = 0; i < arrayTask.length; i += 1) {
      if (arrayTask[i].key === key) {
        console.log(`restart cronjob: ${key}`);
        arrayTask[i].task.destroy();
        delete arrayTask[i];

        model.variable.findOne({
          where: {
            key,
          },
        }).then((row) => {
          const objectJob = JSON.parse(row.dataValues.data);
          arrayTask.push({
            key: objectJob.job,
            status: 'init',
            task: cron.schedule(objectJob.time, job[objectJob.job]),
          });

          this.startTask(key);
        });

        break;
      }
    }
  },
};
