module.exports = {
  "/api/position": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "create new position",
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
          departmentId: {
            type: "string",
            required: true
          },
          name: {
            type: "string",
            required: true
          },
          level: {
            type: "string",
            required: true
          },
          key: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['createPosition'],
      responses: {}
    },
    patch: {
      "x-swagger-router-controller": "home",
      description: "update position",
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
          positionId: {
            type: "string",
            required: true
          },
          fields: {
            type: "object",
            required: true,
            properties: {
              departmentId: {
                type: 'string',
                required: true
              },
              key: {
                type: 'string',
                required: true
              }
            }
          }
        }
      }],
      allowPermission: ['updatePosition'],
      responses: {}
    },
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete position",
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
          positionId: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['deletePosition'],
      responses: {}
    },
    get: {
      "x-swagger-router-controller": "home",
      description: "get position",
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
        name: "positionId",
        in: "query",
        type: "string",
        required: true,
      }],
      allowPermission: ['readPosition'],
      responses: {}
    }
  },

  "/api/positions": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get posiontions",
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
        name: "departmentId",
        in: "query",
        type: "string",
        required: true,
      }],
      allowPermission: ['readPosition'],
      responses: {}
    }
  }
}