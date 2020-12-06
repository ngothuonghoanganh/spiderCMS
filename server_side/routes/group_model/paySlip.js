module.exports = {
  "/api/paySlip": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get payslip",
      parameters: [{
        name: "profileId",
        in: "query",
        type: "string",
        required: true,
      }, {
        name: "month",
        in: "query",
        type: "string",
        required: true,
      }, {
        name: "year",
        in: "query",
        type: "string",
        required: true,
      }],
      allowPermission: ['readProfile'],
      responses: {}
    }
  },
}