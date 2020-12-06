module.exports = {
    "/api/account-permission": {
        controller: {},
        isCheckToken: true,
        post: {
            "x-swagger-router-controller": "home",
            description: "create account-permission",
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
                    permissions: {
                        type: "string",
                        required: true
                    }
                }
            }],
            allowPermission: ['assignPermission'],
            responses: {}
        }
    },

    "/api/account-permission-current": {
        controller: {},
        isCheckToken: true,
        get: {
            "x-swagger-router-controller": "home",
            description: "get permission-current",
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
                name: 'accountId',
                in: 'query',
                type: 'string',
                required: true
            }],
            allowPermission: [],
            responses: {}
        }
    }
}