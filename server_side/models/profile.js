const _ = require('underscore');

module.exports = (sequelize, DataTypes) => {
  const profile = sequelize.define(
    'profile',
    {
      firstName: DataTypes.STRING.BINARY,
      lastName: DataTypes.STRING.BINARY,
      position: DataTypes.STRING.BINARY,
      skype: DataTypes.STRING.BINARY,
      birthday: DataTypes.STRING.BINARY,
      email: DataTypes.STRING.BINARY,
      gender: DataTypes.STRING.BINARY,
      employeeType: DataTypes.STRING,
      phone: DataTypes.STRING.BINARY,
      maritalStatus: DataTypes.STRING,
      avatar: DataTypes.STRING.BINARY,
      startDate: DataTypes.STRING.BINARY,
      endDate: DataTypes.STRING.BINARY,
      isActive: DataTypes.INTEGER,
      haveAccount: DataTypes.INTEGER,
      isPromoted: DataTypes.INTEGER,
      createdAt: DataTypes.STRING,
      updatedAt: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );
  profile.associate = function(models) {
    // associations can be defined here
    profile.hasMany(models.account, {
      as: 'Accounts',
      foreignKey: 'profileId',
      sourceKey: 'id',
    });
    profile.hasMany(models.profilePosition, {
      as: 'ProfilePositions',
      foreignKey: 'profileId',
      sourceKey: 'id',
    });
    profile.hasMany(models.payRolls, {
      as: 'payroll',
      foreignKey: 'profileId',
      sourceKey: 'id',
    });
    profile.hasMany(models.totalTimeSheets, {
      as: 'totaltimesheets',
      foreignKey: 'profileId',
      sourceKey: 'id',
    });

    profile.hasMany(models.timeSheetDay, {
      as: 'timesheetday',
      foreignKey: 'profileId',
      sourceKey: 'id',
    });
    profile.hasMany(models.resourcePlanning, {
      as: 'resourceplanning',
      foreignKey: 'profileId',
      sourceKey: 'id',
    });
    profile.hasMany(models.skillMatrix, {
      as: 'skillmatrix',
      foreignKey: 'profileId',
      sourceKey: 'id',
    });
    profile.hasMany(models.leaveManagement, {
      as: 'leaveManagement',
      foreignKey: 'profileId',
      sourceKey: 'id',
    });
  };

  profile.isExisted = function(email) {
    return new Promise((result) =>
      profile
        .findOne({
          where: {
            email,
          },
        })
        .then((row) => {
          if (_.isNull(row) || _.isUndefined(row)) {
            result(false);
          }
          result(true);
        })
    );
  };

  return profile;
};
