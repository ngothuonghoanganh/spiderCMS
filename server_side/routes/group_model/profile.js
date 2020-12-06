module.exports = {
  "/api/profiles": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "List all of profiles no account",
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
      allowPermission: ['readProfile'],
      responses: {}
    }
  },

  "/api/profiles-account": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "List all of profiles have account",
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
      allowPermission: ['readProfile', 'readAccount'],
      responses: {}
    }
  },

  "/api/profile-email": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "api to get one profile by email",
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
        name: "email",
        in: "query",
        type: "string",
        required: true,
      }],
      allowPermission: ['readProfile'],
      responses: {}
    }
  },


  "/api/profile": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "api to get one profile by id",
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
        name: "profileId",
        in: "query",
        type: "string",
        required: true,
      }],
      allowPermission: ['readProfile'],
      responses: {}
    },
    patch: {
      "x-swagger-router-controller": "home",
      description: "api to update profile",
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
          profileId: {
            type: "string",
            required: true
          },
          fields: {
            type: "object",
            required: true,
            properties: {
              email: {
                type: "string"
              }
            }
          }
        }
      }],
      allowPermission: ['updateProfile'],
      responses: {}
    },
    post: {
      "x-swagger-router-controller": "home",
      description: "create new profile",
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
          email: {
            type: "string",
            required: true
          },
          avatar: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['createProfile'],
      responses: {}
    },
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete one profile by id",
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
          profileId: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['deleteProfile'],
      responses: {}
    },

  },

  "/api/profile-email": {
    controller: {},
    isCheckToken: true,
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete one profile by email",
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
          profileId: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['deleteProfile'],
      responses: {}
    }
  },

  "/api/profiles-id": {
    controller: {},
    isCheckToken: true,
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete one profile by profileIds",
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
          profileIds: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['deleteProfile'],
      responses: {}
    }
  }

}