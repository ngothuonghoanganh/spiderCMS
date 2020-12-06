module.exports = {
  "/api/payrolls": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "create payrolls",
      parameters: [{
        name: "profileId",
        in: "query",
        type: "string",
        required: true,
      }, {
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          salary: {
            type: "number",
          },
          onsite: {
            type: "number",
          },
          holiday: {
            type: "number",
          },
          lunch: {
            type: "number",
          },
          car: {
            type: "number",
          },
          dayMustWork: {
            type: "number",
          },
          month: {
            type: "number",
          },
          year: {
            type: "number",
          },
          payment: {
            type: "number",
          }
        }
      }],
      allowPermission: [],
      responses: {}
    },
    get: {
      "x-swagger-router-controller": "home",
      description: "get all payroll",
      parameters: [{
        name: "profileId",
        in: "query",
        type: "string",
        required: true,
      }, {
        name: "month",
        in: "query",
        type: "number",
        required: true,
      }, {
        name: "year",
        in: "query",
        type: "number",
        required: true,
      }],
      allowPermission: [],
      responses: {}
    },
    patch: {
      "x-swagger-router-controller": "home",
      description: "update payrolls",
      parameters: [{
        name: "profileId",
        in: "query",
        type: "string",
        required: true,
      }, {
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          salary: {
            type: "number",
          },
          onsite: {
            type: "number",
          },
          holiday: {
            type: "number",
          },
          lunch: {
            type: "number",
          },
          car: {
            type: "number",
          },
          dayMustWork: {
            type: "number",
          },
          month: {
            type: "number",
          },
          year: {
            type: "number",
          },
          payment: {
            type: "number",
          }
        }
      }],
      allowPermission: [],
      responses: {}
    },
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete payroll",
      parameters: [{
        name: "payrollId",
        in: "query",
        type: "string",
        required: true,
      }],
      allowPermission: [],
      responses: {}
    },
  },
}