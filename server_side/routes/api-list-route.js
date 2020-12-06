const helper = require('../services/helpers')
let indexFile = require('./indexFile')
let pathAPI = {}

Object.keys(indexFile).forEach(modelName => {
    let modelAPIs = require(`./group_model/${modelName}`);
    // remove ".js" in file's name
    let baseModelName = modelName.substring(0, modelName.length - 3);
    modelAPIs = helper.setTagForAPIInModel(modelAPIs, baseModelName);
    pathAPI = {...pathAPI,...modelAPIs}
});

module.exports = {
    swagger: "2.0",
    info: {
        title: "CMS Project Swagger",
        description: "List all api/URL(s) of the project",
        version: "CMS-v1.0"
    },
    produces: ["application/json"],
    paths: pathAPI
};