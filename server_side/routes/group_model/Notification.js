module.exports = {
  "/api/notifications": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get notifications",
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
          accountObj: {
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