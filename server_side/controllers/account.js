const model = require('../config/model');
const _ = require('underscore');
const helpers = require('../services/helpers');
const constVal = require('../config/const');
const mailService = require('../services/mail-service/gmail');
var lruCache = require('../cache/lru-cache');

function handleUpdate(res, dataUpdate, account) {
  return account.updateAttributes(dataUpdate.fields)
    .then(accountUpdated => model.accountRole.setRoles(
        dataUpdate.accountId,
        dataUpdate.roles,
      )
      .then(() => accountUpdated.getProfile()
        .then((profile) => {
          accountUpdated.dataValues.profile = profile.dataValues || {};
          helpers.clearPassword(accountUpdated.dataValues);

          return helpers.handleResponse(res, 'updateSuccess', {
            data: accountUpdated.dataValues
          });
        })));
}

module.exports = {

  /**
   * Handle login.
   */
  async login(req, res) {
    if (!helpers.checkVariable(req.body.username) || !helpers.checkVariable(req.body.password)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.account.findOne({
      where: {
        username: req.body.username,
        password: helpers.encryptPassword(req.body.password),
        isActive: 1,
      },
    }).then((account) => {
      // if not found any account.
      if (!helpers.checkVariable(account)) {
        return helpers.handleResponse(res, 'wrongUsernamePassword');
      }

      // if success.
      // generate new token.
      const newToken = helpers.generateToken();
      const expiredToken = helpers.getNow() + (req.body.remember ?
        constVal.expireTimeRemember :
        constVal.expireTime);

      model.token.create({
        token: newToken,
        expiredAt: expiredToken,
      }).then(inserted =>
        // update token to account.
        account.updateAttributes({
          isLogin: 1,
          tokenId: inserted.dataValues.id,
          updatedAt: helpers.getNow(),
        })
        .then(() => account.getProfile().then((profile) => {
            account.dataValues.profile = profile.dataValues;

            helpers.clearPassword(account.dataValues);

            return account;
          })
          .then((accountReturn) => {
            const query = `CALL loadAccountPermissionByAccountId(${accountReturn.dataValues.id});`;

            return model.sequelize.query(query).then((results) => {
              const arrAccountPermissions = [];

              if (helpers.checkArray(results)) {
                results.forEach((item) => {
                  arrAccountPermissions.push(item.name);
                });
              }

              accountReturn.dataValues.permissions = arrAccountPermissions;

              const query2 = `CALL loadAccountRolePermissionByAccountId(${accountReturn.dataValues.id});`;

              return model.sequelize.query(query2).then((results2) => {
                const arrRolePermissions = [];

                if (helpers.checkArray(results2)) {
                  results2.forEach((item) => {
                    arrRolePermissions.push(item.name);
                  });
                }

                accountReturn.dataValues.rolePermissions = arrRolePermissions;

                return accountReturn.getAccountRoles().then((roleResults) => {
                  const arrRoleIds = [];
                  const arrRoles = [];

                  roleResults.forEach((accountRole) => {
                    arrRoleIds.push(accountRole.dataValues.roleId);
                  });

                  return model.role.findAll({
                    where: {
                      id: {
                        $in: arrRoleIds
                      },
                    },
                  }).then((roles) => {
                    roles.forEach((item) => {
                      arrRoles.push(item.dataValues);
                    });

                    accountReturn.dataValues.roles = arrRoles;

                    const resData = {
                      data: accountReturn.dataValues,
                      token: newToken,
                    };

                    lruCache.set(`accountID_${accountReturn.dataValues.id}`, newToken);

                    return helpers.handleResponse(res, 'loginSuccess', resData);
                  });
                });
              });
            });
          })));
    });
  },

  /**
   * Handle logout.
   */
  logout(req, res) {
    if (!helpers.checkVariable(req.body.username)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.account.findOne({
        where: {
          username: req.body.username,
        },
      })
      // .then(account => account.updateAttributes({
      //   isLogin: false,
      //   tokenId: null,
      //   updatedAt: helpers.getNow(),
      // }));
      .then((account) => {
        lruCache.delete(`accountID_${account.dataValues.id}`);
        lruCache.delete(req.accountTOken);

        return account.updateAttributes({
          isLogin: false,
          tokenId: null,
          updatedAt: helpers.getNow(),
        });
      });

    return helpers.handleResponse(res, 'logoutSuccess');
  },

  register(req, res) {
    if (!helpers.checkVariable(req.body.email) ||
      !helpers.checkVariable(req.body.username) ||
      !helpers.checkVariable(req.body.password)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.account.isExisted(req.body.username)
      .then((isExistedAccount) => {
        if (isExistedAccount) {
          return helpers.handleResponse(res, 'usernameExisted');
        }

        model.profile.isExisted(req.body.email)
          .then((isExistedEmail) => {
            if (isExistedEmail) {
              return helpers.handleResponse(res, 'emailExisted');
            }

            model.profile.create({
                email: req.body.email,
                isActive: 1,
                haveAccount: req.body.haveAccount || 1,
              })
              .then(newProfile => model.account.create({
                  username: req.body.username,
                  password: helpers.encryptPassword(req.body.password),
                  profileId: newProfile.dataValues.id,
                  isActive: 1, // (helpers.checkVariable(req.body.isRegister) ? 0 : 1)
                }).then((newAccount) => {
                  // .then(newAccount => model.accountRole.setRoles(newAccount.dataValues.id, [3])
                  //   .then(() => {
                  //     helpers.clearPassword(newAccount.dataValues);

                  //     return model.activeMail.create({
                  //         accountId: newAccount.dataValues.id,
                  //         token: helpers.encryptPassword(Date.now()),
                  //       })
                  //       .then((newTokenActive) => {
                  //         const params = {
                  //           token: newTokenActive.dataValues.token,
                  //           currentIp: req.get('host'),
                  //           receiver: req.body.email,
                  //         };
                  //         return mailService.sendEmail(params)
                  //         .then((result) => {
                  //           console.log(params);

                  //             if (result === 'failed') {
                  //               return res.send(result);
                  //             }
                  //           }).then(() => {
                  //             newAccount.dataValues.profile = newProfile.dataValues;

                  return helpers.handleResponse(res, 'createAccountSuccess', {
                    data: newAccount.dataValues
                  });
                })
                //       });
                //   }))
              );
          });
      });
  },

  createOneExistedEmail(req, res) {
    if (!helpers.checkArray(req.body.roles) ||
      !helpers.checkVariable(req.body.profileId) ||
      !helpers.checkVariable(req.body.username) ||
      !helpers.checkVariable(req.body.password)) {
      return helpers.handleResponse(res, 'missingParams', {
        data: req.body
      });
    }

    model.profile.findOne({
        where: {
          id: req.body.profileId,
          isActive: 1,
        },
      })
      .then((profile) => {
        if (!helpers.checkVariable(profile)) {
          return helpers.handleResponse(res, 'notFoundEmail');
        }

        model.account.isExisted(req.body.username).then((isExistedAccount) => {
          if (isExistedAccount) {
            return helpers.handleResponse(res, 'usernameExisted');
          }

          return profile.updateAttributes({
            haveAccount: 1,
            isPromoted: 1,
          }).then(updatedProfile => model.account.create({
              username: req.body.username,
              password: helpers.encryptPassword(req.body.password),
              profileId: updatedProfile.dataValues.id,
              isActive: 1,
            })
            .then(newAccount => model.accountRole.setRoles(
                newAccount.dataValues.id,
                req.body.roles,
              )
              .then(() => {
                helpers.clearPassword(newAccount.dataValues);
                newAccount.dataValues.profile = updatedProfile.dataValues;

                return helpers.handleResponse(res, 'createAccountSuccess', {
                  data: newAccount.dataValues
                });
              })));
        });
      });
  },

  /**
   * Handle create one.
   */
  createOneNoEmail(req, res) {
    if (!helpers.checkArray(req.body.roles) ||
      !helpers.checkVariable(req.body.email) ||
      !helpers.checkVariable(req.body.username) ||
      !helpers.checkVariable(req.body.password)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.account.isExisted(req.body.username)
      .then((isExistedAccount) => {
        if (isExistedAccount) {
          return helpers.handleResponse(res, 'usernameExisted');
        }

        model.profile.isExisted(req.body.email)
          .then((isExistedEmail) => {
            if (isExistedEmail) {
              return helpers.handleResponse(res, 'emailExisted');
            }

            model.profile.create({
                email: req.body.email,
                haveAccount: 1,
              })
              .then(newProfile => model.account.create({
                username: req.body.username,
                password: helpers.encryptPassword(req.body.password),
                roleId: req.body.roleId,
                profileId: newProfile.dataValues.id,
                isActive: 1,
              }).then(newAccount => model.accountRole.setRoles(
                  newAccount.dataValues.id,
                  req.body.roles,
                )
                .then(() => {
                  helpers.clearPassword(newAccount.dataValues);
                  newAccount.dataValues.profile = newProfile.dataValues;

                  return helpers.handleResponse(res, 'createAccountSuccess', {
                    data: newAccount.dataValues
                  });
                })));
          });
      });
  },

  updateOne(req, res) {
    if (!helpers.checkArray(req.body.roles) || !helpers.checkVariable(req.body.accountId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    if (req.accountObj.dataValues.id !== 1 && req.body.accountId === 1) {
      return helpers.handleResponse(res, 'spadminRejectUpdate', {
        message: 'reject updating spadmin\'s account'
      });
    }

    if (!helpers.checkVariable(req.body.fields)) {
      return helpers.handleResponse(res, 'noData');
    }
    model.account.findById(req.body.accountId)
      .then((account) => {
        if (!helpers.checkVariable(account)) {
          return helpers.handleResponse(res, 'notFoundAccount');
        }

        if (helpers.checkVariable(req.body.fields.username)) {
          if (req.body.fields.username === account.dataValues.username) {
            return handleUpdate(res, req.body, account);
          }
        }

        return model.account.isExisted(req.body.fields.username).then((isAccountExisted) => {
          if (isAccountExisted) {
            return helpers.handleResponse(res, 'objectExisted', {
              message: "account's name is existed"
            });
          }

          return handleUpdate(res, req.body, account);
        });
      });
  },

  /**
   * Handle get list.
   */
  getAll(req, res) {
    // console.log(req.query.roleId)
    // if (!helpers.checkVariable(req.query.roleId)) {
    //   return helpers.handleResponse(res, 'missingParams');
    // }

    model.account.findAndCountAll({
        where: {
          // roleId: req.query.roleId,
          isActive: 1,
        },
        offset: 0, // lay tu vi tri thu
        limit: 10, // gioi han moi lan load
      })
      .then((result) => {
        if (result.count < 1 || _.isEmpty(result.rows)) {
          return helpers.handleResponse(res, 'notFoundAccount');
        }

        const arrData = [];
        result.rows.forEach((element) => {
          helpers.clearPassword(element.dataValues);
          arrData.push(element.dataValues);
        });

        const resData = {
          total: result.count,
          data: arrData,
        };
        return helpers.handleResponse(res, 'getListSuccess', resData);
      });
  },

  /**
   * Handle get an account by id.
   */
  getOne(req, res) {
    if (!helpers.checkVariable(req.query.accountId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.account.findOne({
        where: {
          id: req.query.accountId,
          isActive: 1,
        },
      })
      .then((result) => {
        if (!helpers.checkVariable(result)) {
          return helpers.handleResponse(res, 'notFoundAccount');
        }

        helpers.clearPassword(result.dataValues);

        return helpers.handleResponse(res, 'getOneSuccess', {
          data: result.dataValues
        });
      });
  },

  /**
   * Handle delete an account by id. (we will set active to 0 in database)
   */
  deleteOne(req, res) {
    if (!helpers.checkVariable(req.body.accountId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    if (req.body.accountId === req.headers.accountId) {
      return helpers.handleResponse(res, 'rejectDelete', {
        message: 'you can not delete yourself'
      });
    }

    if (req.accountObj.dataValues.id !== 1 && req.body.accountId === 1) {
      const resData = {
        message: 'reject delete spadmin\'s account',
      };

      return helpers.handleResponse(res, 'rejectDelete', resData);
    }

    model.account.findById(req.body.accountId)
      .then((row) => {
        if (!helpers.checkVariable(row)) {
          return helpers.handleResponse(res, 'notFoundAccount');
        }

        return row.updateAttributes({
          isActive: 0,
          profileId: null,
          username: `${row.dataValues.username}_${Date.now()}`,
        }).then(() => helpers.handleResponse(res, 'deleteSuccess'));
      });
  },

  /**
   * Handle update password for an account by username
   */
  updatePassword(req, res) {
    if (!helpers.checkVariable(req.body.username) || !helpers.checkVariable(req.body.password)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.account.findOne({
        where: {
          username: req.body.username,
          isActive: 1,
        },
      })
      .then((account) => {
        if (!helpers.checkVariable(account)) {
          return helpers.handleResponse(res, 'notFoundAccount');
        }
        return account.updateAttributes({
          password: helpers.encryptPassword(req.body.password),
        });
      });

    return helpers.handleResponse(res, 'updateSuccess');
  },
};