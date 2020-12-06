module.exports = {
  "/api/create-timesheet": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "create-timesheet ",
      parameters: [{
        name: 'accountId',
        in: 'query',
        type: 'string',
        required: true
      }, {
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          date: {
            type: "string",
          },
          project: {
            type: "string",
          },
          workTime: {
            type: "number",
          },
          overTime: {
            type: "number",
          },
          restTime: {
            type: "number",
          },
          note: {
            type: "string",
          }
        }
      }],
      allowPermission: [],
      responses: {}
    }
  },
  "/api/timesheets-by-profileId": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get all timesheet by profile Id ",
      parameters: [{
        name: 'profileId',
        in: 'query',
        type: 'string',
        required: true
      }, {
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          month: {
            type: "number",
          }
        }
      }],
      allowPermission: [],
      responses: {}
    }
  },
  "/api/timesheets": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get all time sheet in this month ",
      parameters: [{
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          month: {
            type: "number",
          }
        }
      }],
      allowPermission: [],
      responses: {}
    }
  },
  "/api/timesheet": {
    controller: {},
    isCheckToken: true,
    get: {
      "x-swagger-router-controller": "home",
      description: "get one time sheet in this month ",
      parameters: [{
        name: 'timesheetId',
        in: 'query',
        type: 'number',
        required: true,
      }],
      allowPermission: [],
      responses: {}
    },
    delete: {
      "x-swagger-router-controller": "home",
      description: "delete time sheet in this month ",
      parameters: [{
        name: 'timesheetId',
        in: 'query',
        type: 'number',
        required: true,
      }],
      allowPermission: [],
      responses: {}
    },
    patch: {
      "x-swagger-router-controller": "home",
      description: "delete time sheet in this month ",
      parameters: [{
        name: 'timesheetId',
        in: 'query',
        type: 'number',
        required: true,
      }, {
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          date: {
            type: "string",
          },
          project: {
            type: "string",
          },
          workTime: {
            type: "number",
          },
          overTime: {
            type: "number",
          },
          restTime: {
            type: "number",
          },
          note: {
            type: "string",
          }
        }
      }],
      allowPermission: [],
      responses: {}
    }
  },
  "/api/timesheet-total": {
    controller: {},
    isCheckToken: true,
    post: {
      "x-swagger-router-controller": "home",
      description: "create-timesheet total ",
      parameters: [{
        name: 'profileId',
        in: 'query',
        type: 'string',
        required: true
      }, {
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        properties: {
          month: {
            type: "number",
          },
          year: {
            type: "number",
          },
          dayMustWork: {
            type: "number",
          },
        }
      }],
      allowPermission: [],
      responses: {}
    },
    get: {
      "x-swagger-router-controller": "home",
      description: "create-timesheet total ",
      parameters: [{
        name: 'profileId',
        in: 'query',
        type: 'string',
        required: true
      }, {
        name: 'month',
        in: 'query',
        type: 'number',
        required: true
      }],
      allowPermission: [],
      responses: {}
    }
  },

}