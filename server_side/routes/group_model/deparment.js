module.exports = {
  "/api/department": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "create new depament",
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
          data: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['createDepartment'],
      responses: {}
    },
    patch: {
      "x-swagger-router-controller": "home",
      description: "update department",
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
          fields: {
            type: "object",
            required: true,
            properties: {
              name: {
                type: "string",
              }
            }
          }
        }
      }],
      allowPermission: ['updateDepartment'],
      responses: {}
    },
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete department",
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
          fields: {
            type: "object",
            required: true,
            properties: {
              name: {
                type: "string",
              }
            }
          }
        }
      }],
      allowPermission: ['deleteDepartment'],
      responses: {}
    },

  },
  "/api/departments": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get permissions-group",
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
      }],
      allowPermission: [],
      responses: {}
    }
  }
}