const helpers = require('../services/helpers');
const model = require('../config/model');

function handleUpdate(res, dataUpdate, profile) {
  return profile.updateAttributes(dataUpdate.fields)
    .then((updated) => {
      if (helpers.checkVariable(dataUpdate.fields.avatar)) {
        const from = `${helpers.getRealPath()}/public/images/temp/${dataUpdate.fields.avatar}`;
        const to = `${helpers.getRealPath()}/public/images/avatar/${dataUpdate.fields.avatar}`;

        helpers.moveImageAvatar(from, to);
      }

      return helpers.handleResponse(res, 'updateSuccess', {
        data: updated.dataValues
      });
    });
}

function handleDeleteProfilePosition(res, profilePosition, profileId) {
  return profilePosition.destroy({
      where: {
        profileId,
      },
    })
    .then(() => {
      helpers.handleResponse(res, 'deleteSuccess');
    });
}

module.exports = {
  deleteOneById(req, res) {
    if (!helpers.checkVariable(req.body.profileId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    if (req.accountObj.dataValues.id !== 1 && req.body.profileId === 1) {
      return helpers.handleResponse(res, 'rejectDelete', {
        message: 'reject delete spadmin\'s profile'
      });
    }

    model.profile.findById(req.body.profileId)
      .then((profile) => {
        if (!helpers.checkVariable(profile)) {
          return helpers.handleResponse(res, 'notFound', {
            message: 'not found any profile'
          });
        }

        if (helpers.checkVariable(profile.dataValues.avatar)) {
          const imagePath = `${helpers.getRealPath()}/public/images/avatar/${profile.dataValues.avatar}`;
          helpers.deleteImage(imagePath);
        }

        return profile.updateAttributes({
          isActive: 0,
          avatar: null,
          email: `${profile.dataValues.email}_${Date.now()}`,
        }).then(() => {
          handleDeleteProfilePosition(res, model.profilePosition, req.body.profileId);
        });
      });
  },

  deleteOneByEmail(req, res) {
    if (!helpers.checkVariable(req.body.email)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.profile.find({
        where: {
          email: req.body.email,
        },
      })
      .then((profile) => {
        if (!helpers.checkVariable(profile)) {
          return helpers.handleResponse(res, 'notFound', {
            message: 'not found any profile'
          });
        }

        if (req.accountObj.dataValues.id !== 1 && profile.dataValues.id === 1) {
          return helpers.handleResponse(res, 'rejectDelete', {
            message: 'reject delete spadmin\'s profile'
          });
        }

        return profile.updateAttributes({
          isActive: 0,
          email: `${profile.dataValues.email}_${Date.now()}`,
        }).then((profileUpdate) => {
          handleDeleteProfilePosition(res, model.profilePosition, profileUpdate.id);
        });
      });
  },

  getAllHaveAccount(req, res) {

    model.accountRole.find({
      where: {
        accountId: req.headers.accountid
      }
    }).then(result => {
      if (result.roleId === 3) {
        return model.profile.findAll({
            where: {
              haveAccount: 1,
              isActive: 1,
            },
          })
          .then((profiles) => {
            if (!helpers.checkVariable(profiles)) {
              return helpers.handleResponse(res, 'notFound', {
                message: 'not found any profile'
              });
            }

            const arrProfile = [];
            const arrPromise = [];

            profiles.forEach((profile) => {
              const promiseItem = model.account.findOne({
                where: {
                  id: req.headers.accountid,
                  profileId: profile.dataValues.id,
                  isActive: 1,
                },
              }).then((account) => {
                if (!helpers.checkVariable(account)) {
                  return {};
                }

                delete account.dataValues.password;

                return account.dataValues || {};
              });

              arrPromise.push(promiseItem);
              arrProfile.push(profile.dataValues);
            });

            return Promise.all(arrPromise)
              .then((results) => {
                let i = 0;

                arrProfile.forEach((profileInstance) => {
                  profileInstance.account = results[i];
                  i += 1;
                });
                return helpers.handleResponse(res, 'getListSuccess', {
                  data: arrProfile
                });
              });
          });
      }
      return model.profile.findAll({
          where: {
            haveAccount: 1,
            isActive: 1,
          },
        })
        .then((profiles) => {
          if (!helpers.checkVariable(profiles)) {
            return helpers.handleResponse(res, 'notFound', {
              message: 'not found any profile'
            });
          }

          const arrProfile = [];
          const arrPromise = [];

          profiles.forEach((profile) => {
            const promiseItem = model.account.findOne({
              where: {
                profileId: profile.dataValues.id,
                isActive: 1,
              },
            }).then((account) => {
              if (!helpers.checkVariable(account)) {
                return {};
              }

              delete account.dataValues.password;

              return account.dataValues || {};
            });

            arrPromise.push(promiseItem);
            arrProfile.push(profile.dataValues);
          });

          return Promise.all(arrPromise)
            .then((results) => {
              let i = 0;

              arrProfile.forEach((profileInstance) => {
                profileInstance.account = results[i];
                i += 1;
              });

              return helpers.handleResponse(res, 'getListSuccess', {
                data: arrProfile
              });
            });
        });

    })

  },

  getAllNoAccount(req, res) {
    return model.profile.findAll({
        where: {
          isActive: 1,
          $or: [{
              haveAccount: {
                $eq: 0
              }
            },
            {
              isPromoted: {
                $eq: 1
              }
            }
          ]
        },
        include: [{
          model: model.profilePosition,
          as: 'ProfilePositions',
          attributes: ['id', 'parentInChart', 'positionId'],
          include: [{
            model: model.position,
            required: false,
            attributes: ['id', 'name', 'key', 'level', 'departmentId'],
          }]
        }]
      })
      .then((profiles) => {
        if (!helpers.checkArray(profiles)) {
          return helpers.handleResponse(res, 'notFound', {
            message: 'not found any profile'
          });
        }

        let arrProfile = [];
        profiles.forEach((profile) => {
          // delete profile.dataValues.haveAccount;
          arrProfile.push(profile.dataValues);
        });

        return helpers.handleResponse(res, 'getListSuccess', {
          data: arrProfile
        });
      });
  },

  createOne(req, res) {
    if (!helpers.checkVariable(req.body.email)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.profile.isExisted(req.body.email)
      .then((isExisted) => {
        if (isExisted) {
          return helpers.handleResponse(res, 'emailExisted');
        }

        if (helpers.checkVariable(req.body.avatar)) {
          const from = `${helpers.getRealPath()}/public/images/temp/${req.body.avatar}`;
          const to = `${helpers.getRealPath()}/public/images/avatar/${req.body.avatar}`;

          helpers.moveImageAvatar(from, to);
        }

        return model.profile.create(req.body).then(newProfile => helpers.handleResponse(res, 'insertSuccess', {
          data: newProfile.dataValues
        }));
      });
  },

  getOneByEmail(req, res) {
    if (!helpers.checkVariable(req.query.email)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.profile.findOne({
        where: {
          email: req.query.email,
          isActive: 1,
        },
      })
      .then((result) => {
        if (!helpers.checkVariable(result)) {
          return helpers.handleResponse(res, 'notFound');
        }

        return helpers.handleResponse(res, 'getOneSuccess', {
          data: result.dataValues
        });
      });
  },

  /**
   * Handle get an profile by id.
   */
  getOneById(req, res) {
    if (!helpers.checkVariable(req.query.profileId)) {
      return helpers.handleResponse(res, 'missingParams');
    }
    model.accountRole.find({
      where: {
        accountId: req.headers.accountid
      }
    }).then(results => {
      if (results.roleId === 3) {
        return model.account.find({
          where: {
            id: results.accountId,
            profileId: req.query.profileId
          }
        }).then(account => {
          if (!helpers.checkVariable(account)) {
            return helpers.handleResponse(res, 'noPermission', {
              message: 'you have no permission to access this feature',
            });
          }
          return model.profile.findOne({
            where: {
              id: req.query.profileId,
              isActive: 1,
            },
          }).then((result) => {
            if (!helpers.checkVariable(result)) {
              return helpers.handleResponse(res, 'notFound');
            }

            const query = `CALL getProfilePositionDetail(${result.dataValues.id});`;

            return model.sequelize.query(query).then((positions) => {
              result.dataValues.positions = positions || [];

              return model.account.findOne({
                  where: {
                    profileId: result.dataValues.id,
                    isActive: 1,
                  },
                })
                .then((account) => {
                  let accountResponse = {};

                  if (helpers.checkVariable(account)) {
                    helpers.clearPassword(account.dataValues);
                    accountResponse = account.dataValues;
                  }

                  result.dataValues.account = accountResponse;

                  return helpers.handleResponse(res, 'getOneSuccess', {
                    data: result.dataValues
                  });
                });
            });
          });
        });
      }

      return model.profile.findOne({
        where: {
          id: req.query.profileId,
          isActive: 1,
        },
      }).then((result) => {
        if (!helpers.checkVariable(result)) {
          return helpers.handleResponse(res, 'notFound');
        }

        const query = `CALL getProfilePositionDetail(${result.dataValues.id});`;

        return model.sequelize.query(query).then((positions) => {
          result.dataValues.positions = positions || [];

          return model.account.findOne({
              where: {
                profileId: result.dataValues.id,
                isActive: 1,
              },
            })
            .then((account) => {
              let accountResponse = {};

              if (helpers.checkVariable(account)) {
                helpers.clearPassword(account.dataValues);
                accountResponse = account.dataValues;
              }

              result.dataValues.account = accountResponse;

              return helpers.handleResponse(res, 'getOneSuccess', {
                data: result.dataValues
              });
            });
        });
      });
    })

  },

  /**
   * handle update profile
   */
  updateOne(req, res) {
    if (!helpers.checkVariable(req.body.profileId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    if (req.accountObj.dataValues.id !== 1 && req.body.profileId === 1) {
      return helpers.handleResponse(res, 'spadminRejectUpdate');
    }

    if (!helpers.checkVariable(req.body.fields)) {
      return helpers.handleResponse(res, 'noData');
    }

    model.accountRole.find({
      where: {
        accountId: req.headers.accountid
      }
    }).then(results => {
      if (results.roleId === 3) {
        model.account.find({
          where: {
            id: req.headers.accountid,
            profileId: req.body.profileId
          }
        }).then(account => {
          if (!helpers.checkVariable(account)) {
            return helpers.handleResponse(res, 'noPermission', {
              message: 'you have no permission to access this feature',
            });
          }
        })
      }
    }).then(() => {
      model.profile.findById(req.body.profileId)
        .then((profile) => {
          if (!helpers.checkVariable(profile)) {
            return helpers.handleResponse(res, 'notFound');
          }
          console.log(req.body)
          if (helpers.checkVariable(req.body.fields.email) || helpers.checkVariable(req.body.fields.employeeType)) {
            if (req.body.fields.email === profile.dataValues.email) {
              return handleUpdate(res, req.body, profile);
            }
          }

          return model.profile.isExisted(req.body.fields.email).then((isAccountExisted) => {
            if (isAccountExisted) {
              return helpers.handleResponse(res, 'objectExisted', {
                message: "profile's name is existed"
              });
            }

            return handleUpdate(res, req.body, profile);
          });
        });
    })
  },

  uploadImage(req, res) {
    if (!helpers.checkVariable(req.body.profileId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    if (!req.files) {
      return helpers.handleResponse(res, 'noFileUpload');
    }

    const uploaded = req.files.file;
    const filename = helpers.handleUploadAvatar(uploaded, req.body.profileId);

    return helpers.handleResponse(res, 'fileUploadSuccess', {
      data: filename
    });
  },

  /**
   * Handle check username and email to reset password.
   */
  checkEmail(req, res) {
    if (!helpers.checkVariable(req.body.email)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.profile.findOne({
        where: {
          email: req.body.email,
        },
      })
      .then((profile) => {
        if (!helpers.checkVariable(profile)) {
          return helpers.handleResponse(res, 'notFoundEmail');
        }

        model.account.findOne({
            where: {
              profileId: profile.dataValues.id,
              isActive: 1,
            },
          })
          .then((account) => {
            if (!helpers.checkVariable(account)) {
              return helpers.handleResponse(res, 'notFoundAccount');
            }

            return helpers.handleResponse(res, 'getOneSuccess', {
              data: account.dataValues,
              message: 'this account is owned by the email'
            });
          });
      });
  },

  /**
   * Handle get profiles by ids.
   */
  getByIds(req, res) {
    if (!helpers.checkArray(req.body.profileIds)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.profile.findAll({
        where: {
          id: req.body.profileIds,
          isActive: 1,
        },
      })
      .then((results) => {
        if (!helpers.checkArray(results)) {
          return helpers.handleResponse(res, 'notFound');
        }
        let arrProfile = [];
        results.forEach((result) => {
          arrProfile.push(result.dataValues);
        });

        return helpers.handleResponse(res, 'getListSuccess', {
          data: arrProfile
        });
      });
  },
};