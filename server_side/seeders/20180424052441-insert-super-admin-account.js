const insertSpAdmin = require('../config/super-admin');
const helper = require('../services/helpers');

module.exports = {
  up: (queryInterface) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const encryptPassword = helper.encryptPassword(insertSpAdmin.password);
    return queryInterface.bulkInsert('accounts', [{
      username: insertSpAdmin.username, password: encryptPassword, profileId: 1, tokenId: 1,
    }], {});
  },

  down: queryInterface =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    queryInterface.bulkDelete('accounts', null, {}),

};
