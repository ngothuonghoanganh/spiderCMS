module.exports = {
    "/api/permission-groups": {
        controller: {},
        isCheckToken: true,
        get: {
            "x-swagger-router-controller": "home",
            description: "get all permission-group",
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
            allowPermission: ['readRole'],
            responses: {}
        }
    },

    "/api/permissions-groups": {
        controller: {},
        isCheckToken: true,
        get: {
            "x-swagger-router-controller": "home",
            description: "get permissions-groups",
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
            allowPermission: ['readRole'],
            responses: {}
        }
    },
    "/api/permission-group": {
        controller: {},
        isCheckToken: true,
        get: {
            "x-swagger-router-controller": "home",
            description: "get one permissions-group",
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
                name: "groupId",
                in: "query",
                type: "string",
                required: true,
            }],
            allowPermission: ['readRole'],
            responses: {}
        }
    },
}