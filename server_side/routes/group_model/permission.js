module.exports = {
  "/api/permission": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get one permission by permissionId",
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
        name: "permissionId",
        in: "query",
        type: "string",
        required: true,
      }],
      allowPermission: [],
      responses: {}
    },
    post: {
      "x-swagger-router-controller": "home",
      description: "create one permission",
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
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          name: {
            type: "string",
            required: true
          },
          description: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: [],
      responses: {}
    },
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete one permission by permissionId",
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
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          permissionId: {
            type: "string",
            required: true
          },
          name: {
            type: "string",
            required: true
          },
          description: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: [],
      responses: {}
    },
    patch: {
      "x-swagger-router-controller": "home",
      description: "update one permission by permissionId",
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
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          permissionId: {
            type: "string",
            required: true
          },
          name: {
            type: "string",
            required: true
          },
          description: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: [],
      responses: {}
    }
  }
}