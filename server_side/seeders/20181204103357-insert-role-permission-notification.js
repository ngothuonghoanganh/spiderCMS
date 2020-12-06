'use strict';

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
    let groupNotification = [
      {
        name: 'notification',
        label: 'Notification',
      },
    ];

    return queryInterface.bulkInsert('permissionGroups', groupNotification, {}).then((inserted) => {
      let dataInsert = [
        {
          name: 'readNotification',
          description: 'read Notification',
          permissionGroupId: inserted,
          label: 'Read Notification',
        },
        {
          name: 'createNotification',
          description: 'create Notification',
          permissionGroupId: inserted,
          label: 'Create Notification',
        },
        {
          name: 'deleteNotification',
          description: 'delete Notification',
          permissionGroupId: inserted,
          label: 'Delete Notification',
        },
        {
          name: 'updateNotification',
          description: 'update Notification',
          permissionGroupId: inserted,
          label: 'Update Notification',
        },
      ];
      return queryInterface.bulkInsert('permissions', dataInsert, {});
    });
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
