module.exports = {
  "/api/login": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "api to login",
      parameters: [{
          name: "username",
          in: "formData",
          type: "string",
          required: true,
        },
        {
          name: "password",
          in: "formData",
          required: true,
          type: "string"
        }
      ],
      allowPermission: [],
      responses: {}
    }
  },

  "/api/logout": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "api to logout",
      parameters: [{
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          username: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['readAccount'],
      responses: {}
    }
  },

  "/api/account-register": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "api to register",
      parameters: [{
        name: "email",
        in: "formData",
        type: "string",
        required: true,
      }, {
        name: "username",
        in: "formData",
        type: "string",
        required: true,
      }, {
        name: "password",
        in: "formData",
        type: "string",
        required: true,
      }, {
        name: "haveAccount",
        in: "formData",
        type: "string",
        required: true,
      }],
      allowPermission: ['updateProfile', 'createAccount'],
      responses: {}
    }
  },

  "/api/account-existed-email": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "api to register existed email",
      parameters: [{
        name: "roles",
        in: "formData",
        type: "string",
        required: true,
      }, {
        name: "profileId",
        in: "formData",
        type: "string",
        required: true,
      }, {
        name: "username",
        in: "formData",
        type: "string",
        required: true,
      }, {
        name: "password",
        in: "formData",
        type: "string",
        required: true,
      }],
      allowPermission: ['createAccount', 'createProfile'],
      responses: {}
    }
  },

  "/api/account-no-email": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "api to register no email",
      parameters: [{
        name: "roles",
        in: "formData",
        type: "string",
        required: true,
      }, {
        name: "email",
        in: "formData",
        type: "string",
        required: true,
      }, {
        name: "username",
        in: "formData",
        type: "string",
        required: true,
      }, {
        name: "password",
        in: "formData",
        type: "string",
        required: true,
      }],
      allowPermission: ['createAccount', 'createProfile'],
      responses: {}
    }
  },

  "/api/accounts": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get accounts",
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
      allowPermission: ['readAccount'],
      responses: {}
    }
  },

  "/api/account": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get a account",
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
        name: "accountId",
        in: "query",
        type: "string",
        required: true,
      }],
      responses: {},
      allowPermission: ['readAccount']
    },
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete account",
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
          accountId: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['deleteAccount'],
      responses: {}
    },
    patch: {
      "x-swagger-router-controller": "home",
      description: "update account",
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
          accountId: {
            type: "string",
            required: true
          },
          fields: {
            type: "object",
            required: true,
            properties: {
              username: {
                type: "string",
                required: true
              }
            }
          }
        }
      }],
      allowPermission: ['updateAccount'],
      responses: {}
    }
  }
}