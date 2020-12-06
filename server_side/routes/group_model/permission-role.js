module.exports = {
  "/api/permissions-role": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get permission-role",
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
      description: "update permission-role",
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
          rolePermissionsData: {
            type: "object",
            required: true,
            properties: {
              name: {
                type: "string",
              },
              permissionId: {
                type: "string"
              }
            }
          }
        }
      }],
      allowPermission: ['assignRole'],
      responses: {}
    }
  },
}