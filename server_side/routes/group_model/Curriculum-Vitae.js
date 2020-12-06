module.exports = {
  "/api/cv-get-type": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "Get type of CV",
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
  },
  "/api/cv-get-one": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "get one CV",
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
      allowPermission: [],
      responses: {}
    }
  },
  "/api/cv-delete-one": {
    controller: {},
    isCheckToken: true,
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete one CV",
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
        cvId: {
          accountObj: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: [],
      responses: {}
    }
  },
  "/api/cv-delete-full": {
    controller: {},
    isCheckToken: true,
    delete: {
      "x-swagger-router-controller": "home",
      description: "Delete CV and profile",
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
      allowPermission: ['updatePosition'],
      responses: {}
    }
  },
  "/api/cv-create-new": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "Create New CV",
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
          datas: {
            type: "string",
            required: true
          },
          profileId: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: [],
      responses: {}
    }
  },
  "/api/cv-update": {
    controller: {},
    isCheckToken: true,
    patch: {
      "x-swagger-router-controller": "home",
      description: "Update CV",
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
          datas: {
            type: "string",
            required: true
          },
          profileId: {
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