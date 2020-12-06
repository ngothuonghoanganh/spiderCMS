const data = require('../config/cronjob');

const dataInsert = [];

data.forEach((item) => {
  if (item.key === 'deleteAvatarsTemp') {
    dataInsert.push({
      key: item.key,
      data: item.data,
    });
  }
});


module.exports = {
  up: queryInterface =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    queryInterface.bulkInsert('variables', dataInsert, {}),

  down: () => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  },
};
