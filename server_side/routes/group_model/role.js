module.exports = {
  "/api/roles": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get all roles",
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
      }, ],
      allowPermission: ['readRole'],
      responses: {}
    }
  },

  "/api/role-name": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get one by roleName",
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
        name: "roleName",
        in: "query",
        type: "string",
        required: true,
      }],
      allowPermission: ['readRole'],
      responses: {}
    }
  },

  "/api/role": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get one role by id",
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
        name: "roleId",
        in: "query",
        type: "string",
        required: true,
      }],
      allowPermission: ['readRole'],
      responses: {}
    },
    post: {
      "x-swagger-router-controller": "home",
      description: "get one by roleName",
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
          roleName: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['createRole'],
      responses: {}
    },
    patch: {
      "x-swagger-router-controller": "home",
      description: "update one by roleId",
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
          roleId: {
            type: "string",
            required: true
          },
          fields: {
            type: "Object",
            required: true,
            properties: {
              rolename: {
                type: "string",
                required: true
              }
            }
          }
        }
      }],
      allowPermission: ['updateRole'],
      responses: {}
    },
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete one by roleId",
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
          roleId: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['deleteRole'],
      responses: {}
    }
  }
}