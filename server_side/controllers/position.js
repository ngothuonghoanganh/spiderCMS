const model = require('../config/model');
const helpers = require('../services/helpers');

function handleUpdate(res, position, fields) {
  return position
    .updateAttributes(fields)
    .then((updated) =>
      helpers.handleResponse(res, 'updateSuccess', { data: updated.dataValues })
    )
    .catch((err) =>
      helpers.handleResponse(res, 'error', { data: { error: err.name } })
    );
}

module.exports = {
  createOne(req, res) {
    if (
      !helpers.checkVariable(req.body.name) ||
      !helpers.checkVariable(req.body.key) ||
      !helpers.checkVariable(req.body.level) ||
      !helpers.checkVariable(req.body.departmentId)
    ) {
      return helpers.handleResponse(res, 'missingParams');
    }

    return model.position
      .isExisted(req.body.key, req.body.departmentId)
      .then((isPositionExisted) => {
        if (isPositionExisted) {
          return helpers.handleResponse(res, 'objectExisted');
        }

        return model.position
          .create(req.body)
          .then((newPosition) =>
            helpers.handleResponse(res, 'insertSuccess', {
              data: newPosition.dataValues,
            })
          )
          .catch((err) =>
            helpers.handleResponse(res, 'error', { data: { error: err.name } })
          );
      });
  },

  updateOne(req, res) {
    if (!helpers.checkVariable(req.body.positionId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    if (!helpers.checkVariable(req.body.fields)) {
      return helpers.handleResponse(res, 'noData');
    }

    return model.position.findById(req.body.positionId).then((position) => {
      if (!helpers.checkVariable(position)) {
        return helpers.handleResponse(res, 'notFound');
      }

      const departmentIdCheck =
        req.body.fields.departmentId || position.dataValues.departmentId;

      // if update itself.
      if (
        position.dataValues.key === req.body.fields.key &&
        position.dataValues.departmentId === departmentIdCheck
      ) {
        return handleUpdate(res, position, req.body.fields);
      }

      return model.position
        .isExisted(req.body.fields.key, departmentIdCheck)
        .then((isPositionExisted) => {
          if (isPositionExisted) {
            return helpers.handleResponse(res, 'objectExisted', {
              message: "the position's infomation is existed",
            });
          }

          return handleUpdate(res, position, req.body.fields);
        });
    });
  },

  deleteOne(req, res) {
    if (!helpers.checkVariable(req.body.positionId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    return model.position
      .isExistedById(req.body.positionId)
      .then((isPositionExisted) => {
        if (!isPositionExisted) {
          return helpers.handleResponse(res, 'notFound');
        }
        return model.profilePosition
          .findAll({
            where: {
              positionId: req.body.positionId,
            },
          })
          .then((profilePositions) => {
            if (helpers.checkArray(profilePositions)) {
              return helpers.handleResponse(res, 'isUsing');
            }

            return model.position
              .destroy({
                where: {
                  id: req.body.positionId,
                },
              })
              .then(() => helpers.handleResponse(res, 'deleteSuccess'));
          });
      });
  },

  getPositionsByDepartmentId(req, res) {
    if (!helpers.checkVariable(req.query.departmentId)) {
      return helpers.handleResponse(res, 'missingParams');
    }
    return model.department
      .isExistedById(req.query.departmentId)
      .then((isDepartmentExisted) => {
        if (!isDepartmentExisted) {
          return helpers.handleResponse(res, 'notFound');
        }
        return model.position
          .findAll({
            where: {
              departmentId: req.query.departmentId,
            },
          })
          .then((positions) => {
            if (!helpers.checkArray(positions)) {
              return helpers.handleResponse(res, 'notFound');
            }
            return helpers.handleResponse(res, 'getListSuccess', {
              data: positions,
            });
          });
      });
  },

  deleteProfilePosition(req, res) {
    console.log(req.body);
    if (!helpers.checkVariable(req.body.profilePositionId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    const query = `SELECT pp1.*, COUNT(pp2.parentInChart) as 'childnumber'
    FROM profilePositions pp1 LEFT JOIN profilePositions pp2 ON pp1.id = pp2.parentInChart
    WHERE pp1.id = ${req.body.profilePositionId}
    GROUP BY pp1.id;`;
    
    return model.sequelize.query(query)
    .then((results) => {
      if (!helpers.checkArray(results) || !helpers.checkVariable(results[0])) {
        return helpers.handleResponse(res, 'notFound');
      }
      let result = results[0];
      if (result.childnumber > 0) {
        return helpers.handleResponse(res, 'rejectDelete', {
          message: 'this instance has children',
        });
      }

      model.profilePosition.destroy({
        where: {
          id: result[0].id
        }
      });

      return helpers.handleResponse(res, 'deleteSuccess');
    });
  },

  setProfilePosition(req, res) {
    if (
      !helpers.checkVariable(req.body.positionId) ||
      !helpers.checkVariable(req.body.profileId)
    ) {
      return helpers.handleResponse(res, 'missingParams');
    }

    return model.position
      .isExistedById(req.body.positionId)
      .then((isPositionExisted) => {
        if (!isPositionExisted) {
          return helpers.handleResponse(res, 'notFound', {
            message: 'position is not found',
          });
        }

        return model.profile.findById(req.body.profileId).then((profile) => {
          if (!helpers.checkVariable(profile)) {
            return helpers.handleResponse(res, 'notFound', {
              message: 'profile is not found',
            });
          }

          return model.profilePosition
            .findOne({
              where: {
                profileId: req.body.profileId,
                positionId: req.body.positionId,
              },
            })
            .then((profilePosition) => {
              if (helpers.checkVariable(profilePosition)) {
                return helpers.handleResponse(res, 'objectExisted');
              }

              return model.profilePosition
                .create({
                  profileId: req.body.profileId,
                  positionId: req.body.positionId,
                })
                .then(() => helpers.handleResponse(res, 'insertSuccess'));
            });
        });
      });
  },

  setParentProfilePosition(req, res) {
    if (
      !helpers.checkVariable(req.body.departmentId) ||
      !helpers.checkVariable(req.body.profilePositionIdParent) ||
      !helpers.checkVariable(req.body.profilePositionIdChild)
    ) {
      return helpers.handleResponse(res, 'missingParams');
    }

    const query = `CALL loadProfilePositionChart(${req.body.departmentId});`;

    return model.sequelize.query(query).then((results) => {
      if (!helpers.checkArray(results)) {
        return helpers.handleResponse(res, 'notFound');
      }

      let parent = null;
      let children = null;

      for (let i = 0; i < results.length; i += 1) {
        if (results[i].profilePositionId == req.body.profilePositionIdParent) {
          parent = results[i];
        }

        if (results[i].profilePositionId == req.body.profilePositionIdChild) {
          children = results[i];
        }
      }

      if (!helpers.checkVariable(parent) || !helpers.checkVariable(children)) {
        return helpers.handleResponse(res, 'notFound');
      }

      if (children.level <= parent.level) {
        return helpers.handleResponse(res, 'rejectUpdate', {
          message: "children's level is smaller parent's one",
        });
      }

      return model.profilePosition
        .update(
          {
            parentInChart: parent.profilePositionId,
          },
          {
            where: {
              id: children.profilePositionId,
            },
          }
        )
        .then(() => {
          return helpers.handleResponse(res, 'updateSuccess');
        });
    });
  },

  getChart(req, res) {
    if (!helpers.checkVariable(req.query.departmentId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    const query = `CALL loadProfilePositionChart(${req.query.departmentId});`;

    return model.sequelize
      .query(query)
      .then((results) => {
        if (!helpers.checkArray(results)) {
          return helpers.handleResponse(res, 'notFound');
        }

        let maxLevel = 0;
        let minLevel = 1000;
        const dataRes = [];

        for (let i = 0; i < results.length; i += 1) {
          maxLevel = results[i].level > maxLevel ? results[i].level : maxLevel;
          minLevel = results[i].level < minLevel ? results[i].level : minLevel;
          results[i].children = [];
        }

        // Sort by level
        for (let i = minLevel; i <= maxLevel; i += 1) {
          for (let j = 0; j < results.length; j += 1) {
            if (results[j].level == i) {
              dataRes.push(results[j]);
            }
          }
        }

        const length = dataRes.length;

        for (let i = length; i >= 0; i -= 1) {
          if (helpers.checkVariable(dataRes[i])) {
            if (helpers.checkVariable(dataRes[i].parentInChart)) {
              for (let j = length; j >= 0; j -= 1) {
                if (helpers.checkVariable(dataRes[j])) {
                  if (
                    dataRes[i].parentInChart == dataRes[j].profilePositionId &&
                    dataRes[i].level != dataRes[j].level &&
                    dataRes[i].positionId != dataRes[j].positionId
                  ) {
                    dataRes[j].children.push(dataRes[i]);
                    delete dataRes[i];
                    break;
                  }
                }
              }
            }
          }
        }

        helpers.arrayClean(dataRes);

        return helpers.handleResponse(res, 'getListSuccess', {
          data: dataRes,
          freshData: results,
        });
      })
      .catch((err) =>
        helpers.handleResponse(res, 'error', { data: { error: err.name } })
      );
  },

  getOne(req, res) {
    if (!helpers.checkVariable(req.query.positionId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.position.findById(req.query.positionId).then((result) => {
      if (!helpers.checkVariable(result)) {
        return helpers.handleResponse(res, 'notFound');
      }

      return helpers.handleResponse(res, 'getOneSuccess', {
        data: result.dataValues,
      });
    });
  },

  //them 1 function update profilePosision qua 1 position mới.
  changePositionForProfilePosision(req, res) {
    if (
      !helpers.checkVariable(req.body.profilePosisionId) ||
      !helpers.checkVariable(req.body.positionId)
    ) {
      return helpers.handleResponse(res, 'missingParams');
    }

    return model.profilePosition
      .loadProfilePositionDetail(req.body.profilePosisionId)
      .then((result) => {
        if (!helpers.checkArray(result) || !helpers.checkVariable(result[0])) {
          return helpers.handleResponse(res, 'notFound');
        }

        result = result[0];
        if (result.childnumber > 0) {
          return helpers.handleResponse(res, 'rejectUpdate', {
            message: 'this instance has children',
          });
        }

        let currentPosition = result.positionId;
        if (currentPosition == req.query.positionId) {
          return helpers.handleResponse(res, 'rejectUpdate', {
            message: 'this position have been setted for the profile',
          });
        }

        return model.position
          .findAll({
            where: {
              id: [currentPosition, req.body.positionId],
            },
          })
          .then((positions) => {
            if (!helpers.checkArray(positions)) {
              return helpers.handleResponse(res, 'notFound');
            }

            if (positions.length < 2) {
              return helpers.handleResponse(res, 'rejectUpdate', {
                message: 'found only 1 position, cannot handle update',
              });
            }

            if (
              positions[0].dataValues.departmentId !=
              positions[1].dataValues.departmentId
            ) {
              return helpers.handleResponse(res, 'rejectUpdate', {
                message: 'new position and old position need same department',
              });
            }

            //nếu có cha thì position mới fải cùng department vs position của cha. nhưng vì khi set cha cho 1 profilePosition đã filter thành viên trong 1 department r nên khỏi.s

            model.profilePosition.update(
              {
                positionId: req.body.positionId,
              },
              {
                where: {
                  id: req.body.profilePosisionId,
                },
              }
            );

            return helpers.handleResponse(res, 'updateSuccess', {
              message: 'change position successfully',
            });
          });
      });
  },

  removeParent(req, res) {
    if (!helpers.checkVariable(req.body.profilePosisionId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    let whereCondition = {
      id: req.body.profilePosisionId,
    };

    if (helpers.checkVariable(req.body.profilePosisionParentId)) {
      whereCondition.parentInChart = req.body.profilePosisionParentId;
    }

    return model.profilePosition
      .update(
        {
          parentInChart: null,
        },
        {
          where: whereCondition,
        }
      )
      .then((updated) => {
        if (!helpers.checkVariable(updated)) {
          return helpers.handleResponse(res, 'notFound');
        }

        //tìm hết những thằng nào đang lấy thằng này làm cha, set cha cho những thằng vừa tìm dc là cha của thằng vừa set null.
        if (helpers.checkVariable(req.body.profilePosisionParentId)) {
          model.profilePosition.update(
            {
              parentInChart: req.body.profilePosisionParentId,
            },
            {
              where: {
                parentInChart: req.body.profilePosisionId,
              },
            }
          );
        }

        return helpers.handleResponse(res, 'updateSuccess', {
          message: 'remove parent successfully',
        });
      });
  },

  test(req, res) {
    res.send('this is test');
  },
};
