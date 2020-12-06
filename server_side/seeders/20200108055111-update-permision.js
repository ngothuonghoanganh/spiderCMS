const insertPermission = require('../config/update-data').dbPermission();

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
    queryInterface.bulkInsert('permissions', insertPermission, {}),

  down: queryInterface =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    queryInterface.bulkDelete('permissions', null, {}),

};
