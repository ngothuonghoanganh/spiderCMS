'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let dataInsert = [
      {
        objectUse: 'cv',
        name: 'Skills',
      },
      {
        objectUse: 'cv',
        name: 'Experience',
      },
      {
        objectUse: 'cv',
        name: 'Languages',
      },
      {
        objectUse: 'cv',
        name: 'Certification',
      },
      {
        objectUse: 'cv',
        name: 'Awards',
      },
      {
        objectUse: 'cv',
        name: 'Summary',
      },
      {
        objectUse: 'cv',
        name: 'Education',
      },
      {
        objectUse: 'cv',
        name: 'Hobbies',
      },
    ];
    return queryInterface.bulkInsert('typeObjects', dataInsert, {});
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
