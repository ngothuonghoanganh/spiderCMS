module.exports = {
  "/api/set-variable": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "set variable",
      parameters: [{
        name: "token",
        in: "header",
        type: "string",
        required: true,
      }, {
        name: "accountId",
        in: "header",
        type: "string",
        required: true,
      },{
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          key: {
            type: "string",
            required: true
          },
          data: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: [],
      responses: {}
    }
  },

  "/api/get-variable": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "get variable",
      parameters: [{
        name: "token",
        in: "header",
        type: "string",
        required: true,
      }, {
        name: "accountId",
        in: "header",
        type: "string",
        required: true,
      }, {
        name: "key",
        in: "body",
        type: "string",
        required: true,
      }],
      allowPermission: [],
      responses: {}
    }
  },

}