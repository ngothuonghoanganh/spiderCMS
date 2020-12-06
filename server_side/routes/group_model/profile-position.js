module.exports = {
  "/api/profile-position": {
    controller: {},
    isCheckToken: true,
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete profile-position",
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
          profilePosisionId: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['deletePosition'],
      responses: {}
    },
    post: {
      "x-swagger-router-controller": "home",
      description: "create profile-position",
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
          profileId: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['createPosition'],
      responses: {}
    },
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete profile-position",
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
          profilePosisionId: {
            type: "string",
            required: true
          },
          positionId: {
            type: "string",
            required: true
          }
        }
      }, {
        name: "positionId",
        in: "query",
        type: "string",
        required: true,
      }],
      allowPermission: ['updatePosition'],
      responses: {}
    }
  },
  "/api/set-position-chart": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "create position-chart",
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
          profilePositionIdParent: {
            type: "string",
            required: true
          },
          profilePositionIdChild: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['updatePosition'],
      responses: {}
    }
  },
  "/api/profile-position-parent": {
    controller: {},
    isCheckToken: true,
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete position-parent",
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
          profilePosisionId: {
            type: "string",
            required: true
          },
          profilePosisionParentId: {
            type: "string",
            required: true
          }
        }
      }],
      allowPermission: ['updatePosition'],
      responses: {}
    }
  },
  "/api/position-chart": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get position-chart",
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