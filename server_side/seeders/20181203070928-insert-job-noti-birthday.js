'use strict';
const data = require('../config/cronjob');

const dataInsert = [];

data.forEach((item) => {
  if (item.key === 'createBirthdayNotification') {
    dataInsert.push({
      key: item.key,
      data: item.data,
    });
  }
});


module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('variables', dataInsert, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
