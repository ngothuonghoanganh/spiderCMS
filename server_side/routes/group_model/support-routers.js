module.exports = {
  "/api/image-upload": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "image-upload",
      parameters: [{
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          profileId: {
            type: "string",
            required: true
          }
        }
      }, {
        name: "file",
        in: "files",
        type: "string",
        required: true,
      }],
      allowPermission: [],
      responses: {}
    }
  },
  "/api/change-password": {
    controller: {},
    isCheckToken: true,
    patch: {
      "x-swagger-router-controller": "home",
      description: "change-password ",
      parameters: [{
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          username: {
            type: "string",
            required: true
          },
          password: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: [],
      responses: {}
    }
  },
  "/api/checkforgot": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "check forgot password",
      parameters: [{
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          email: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: [],
      responses: {}
    }
  },
  "/api/active-account": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "active-account",
      parameters: [{
        name: "enc",
        in: "query",
        type: "string",
        required: true,
      }],
      allowPermission: [],
      responses: {}
    }
  },
  "/api/restart-job": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "restart-job",
      parameters: [{
        name: "key",
        in: "query",
        type: "string",
        required: true,
      }],
      allowPermission: [],
      responses: {}
    }
  }
}