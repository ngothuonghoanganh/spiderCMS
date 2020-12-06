module.exports = {
  "/api/project": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "create new project",
      parameters: [{
        name: "projectName",
        in: "header",
        type: "string",
        required: true,
      }],
      allowPermission: [],
      responses: {}
    }
  },

}