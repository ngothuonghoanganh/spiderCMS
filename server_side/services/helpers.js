const uid = require('rand-token').uid;
const _ = require('underscore');
const Cryptr = require('cryptr');
const salKey = require('../config/const').salKey;

const cryptr = new Cryptr(salKey);
const dateformat = require('dateformat');
const fileExtension = require('file-extension');
const path = require('path');
const publicIp = require('public-ip');
const fs = require('fs');
const response = require('../config/response');

module.exports = {
  getResponse(key, dataResponse) {
    if (!this.checkVariable(response[key])) {
      console.log('missing key to response');
    }
    const responseObj = response[key];

    if (this.checkVariable(dataResponse)) {
      if (this.checkVariable(dataResponse.data)) {
        responseObj.data = dataResponse.data;
      }

      const listObjKeys = Object.keys(dataResponse);

      listObjKeys.forEach((objKey) => {
        responseObj[objKey] = dataResponse[objKey];
      });
    }

    responseObj.responseKey = key;

    return responseObj;
  },
  setTagForAPIInModel(model, baseName) {
    let tags = [baseName];
    let listAPI = Object.keys(model);
    let listMethod = ['get', 'put', 'patch', 'post', 'delete'];
    for (let api of listAPI) {
      let APIObjectKeys = Object.keys(model[api]);

      for (let key of APIObjectKeys) {
        // if (key == 'get' || key == 'post' || key == 'put' || key == 'patch' || key == 'delete') {
        if (listMethod.includes(key)) {
          if (!this.checkArray(model[api][key].tags)) {
            model[api][key].tags = tags;
          }

          model[api] = {
            ...model[api],
            ...{
              method: key,
            },
          };

          if (!this.checkVariable(model[api][key].operationId)) {
            model[api][key].operationId = `[${key.toUpperCase()}] ${
              model[api].controller.name
            }`;
          }
        }
      }
    }

    return model;
  },

  handleResponse(res, key, dataResponse) {
    const responseInstance = this.getResponse(key, dataResponse);
    if (this.checkArray(res.notifications)) {
      responseInstance.notifications = res.notifications;
    }

    return res.status(responseInstance.requestStatus).send(responseInstance);
  },

  getNow() {
    return Math.round(Date.now() / 1000);
  },

  dateToInt(date) {
    return Math.round(new Date(date) / 1000);
  },

  dateString(valueInt) {
    const dateObj = new Date(valueInt * 1000);
    return dateformat(dateObj, 'dd/mm/yyyy HH:MM:ss');
  },

  generateToken() {
    const token = uid(50);
    return token;
  },

  checkVariable(variable) {
    if (_.isNull(variable) || _.isUndefined(variable) || variable === '') {
      return false;
    }
    return true;
  },

  checkArray(variable) {
    if (!_.isUndefined(variable) && !_.isEmpty(variable)) {
      return true;
    }
    return false;
  },

  encryptPassword(password) {
    return cryptr.encrypt(password);
  },

  decryptPassword(encryptStr) {
    return cryptr.decrypt(encryptStr);
  },

  clearIsActive(dataValues) {
    if (this.checkVariable(dataValues.isActive)) {
      delete dataValues.isActive;
    }

    return dataValues;
  },

  clearPassword(dataValues) {
    if (this.checkVariable(dataValues.password)) {
      delete dataValues.password;
    }

    return dataValues;
  },

  getRealPath() {
    return path.resolve();
  },

  handleUploadAvatar(fileObject, accountId) {
    const time = Math.round(Date.now());
    const newFileName = `${accountId}_${time}.${fileExtension(
      fileObject.name
    )}`;

    fileObject.mv(
      `${this.getRealPath()}/public/images/temp/${newFileName}`,
      (err) => {
        if (err) {
          return {
            status: 'failed',
            message: err,
          };
        }
      }
    );

    return {
      status: 'success',
      message: 'upload image successfully',
      url: newFileName,
    };
  },

  moveImageAvatar(from, to) {
    const inStr = fs.createReadStream(from);
    const outStr = fs.createWriteStream(to);

    inStr.pipe(outStr);
  },

  deleteImage(pathToImage) {
    fs.unlink(pathToImage, (err) => {
      if (err) {
        console.log(err);
      }
      // console.log(`deleted /images/avatar/${file}`);
    });
  },

  getPublicIp() {
    return publicIp.v4().then((ip) => ip);
  },

  isInArray(parent, child) {
    if (!this.checkArray(parent)) {
      return false;
    }

    if (parent.indexOf(child) !== -1) {
      return true;
    }

    return false;
  },

  isContainArray(parent, child) {
    if (!this.checkArray(parent) || !this.checkArray(child)) {
      return false;
    }

    for (let i = 0; i < child.length; i += 1) {
      if (!this.isInArray(parent, child[i])) {
        return false;
      }
    }

    return true;
  },

  arrayClean(arrayInstance, dataToClean) {
    for (let i = 0; i < arrayInstance.length; i += 1) {
      if (arrayInstance[i] === dataToClean) {
        arrayInstance.splice(i, 1);
        i -= 1;
      }
    }
  },
};
