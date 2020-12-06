module.exports = {
  titleNotiBirthday: 'Birthday Notification',
  fromNotiBirthday: 'System',
  expireTime: 8 * 60 * 60,
  expireTimeRemember: 7 * 24 * 60 * 60,
  salKey: 'ahihi',
  limitLoadNotification: 20,
  employeyyRoleDefault: 3,
  adminRoleDefault: 2,
  arrPassToken: [
    'login',
    'logout',
    'checkforgot',
    'change-password',
    'account-register',
    'active-account',
    'position-chart',
    'test',
    'notifications',
  ],
  dbRoles() {
    return [{
        rolename: 'superadmin',
        description: 'role for superadmin',
        level: 1,
        label: 'Super Admin',
      },
      {
        rolename: 'admin',
        description: 'role for admin',
        level: 2,
        label: 'Admin',
      },
      {
        rolename: 'user',
        description: 'role for user',
        level: 3,
        label: 'User',
      },
      {
        rolename: 'employee',
        description: 'role for employee',
        level: 4,
        label: 'Employee',
      },
    ];
  },
  dbPermission() {
    return [{
        name: 'readSetting',
        description: 'get data from setting',
        permissionGroupId: 8,
        label: 'Read Setting',
      },
      {
        name: 'createSetting',
        description: 'create setting',
        permissionGroupId: 8,
        label: 'Create Setting',
      },
      {
        name: 'updateSetting',
        description: 'update setting',
        permissionGroupId: 8,
        label: 'Update Setting',
      },
      {
        name: 'deleteSetting',
        description: 'delete setting',
        permissionGroupId: 8,
        label: 'Delete Setting',
      },
      {
        name: 'readOrgChart',
        description: 'read OrgChart',
        permissionGroupId: 6,
        label: 'Read OrgChart',
      },
      {
        name: 'createOrgChart',
        description: 'create OrgChart',
        permissionGroupId: 6,
        label: 'Create OrgChart',
      },
      {
        name: 'deleteOrgChart',
        description: 'delete OrgChart',
        permissionGroupId: 6,
        label: 'Delete OrgChart',
      },
      {
        name: 'updateOrgChart',
        description: 'update OrgChart',
        permissionGroupId: 6,
        label: 'Update OrgChart',
      },
      // update

      {
        name: 'createTimeSheet',
        description: 'create time sheet',
        permissionGroupId: 9,
        label: 'Create Time Sheet',
      },

      {
        name: 'readOneTimeSheet',
        description: 'read one time sheet',
        permissionGroupId: 9,
        label: 'Read One Time Sheet',
      },

      {
        name: 'updateTimeSheet',
        description: 'update time sheet',
        permissionGroupId: 9,
        label: 'Update Time Sheet',
      },

      {
        name: 'deleteTimeSheet',
        description: 'delete time sheet',
        permissionGroupId: 9,
        label: 'Delete Time Sheet',
      },

      {
        name: 'readPayRoll',
        description: 'read pay roll',
        permissionGroupId: 10,
        label: 'Read Pay Roll',
      },

      {
        name: 'updatePayRoll',
        description: 'update pay roll',
        permissionGroupId: 10,
        label: 'Update Pay Roll',
      },

      {
        name: 'deletePayRoll',
        description: 'delete pay roll',
        permissionGroupId: 10,
        label: 'Delete Pay Roll',
      },

      {
        name: 'createPayRoll',
        description: 'create pay roll',
        permissionGroupId: 10,
        label: 'Create Pay Roll',
      },

      {
        name: 'readPaySlip',
        description: 'read pay slip',
        permissionGroupId: 10,
        label: 'Read Pay Slip',
      },

      {
        name: 'readProject',
        description: 'read project',
        permissionGroupId: 11,
        label: 'Read Project',
      },

      {
        name: 'createProject',
        description: 'create project',
        permissionGroupId: 11,
        label: 'Create Project',
      },

      {
        name: 'updateProject',
        description: 'update project',
        permissionGroupId: 11,
        label: 'Update Project',
      },

      {
        name: 'deleteProject',
        description: 'delete project',
        permissionGroupId: 11,
        label: 'Delete Project',
      },

      {
        name: 'readClient',
        description: 'read client',
        permissionGroupId: 13,
        label: 'Read Client',
      },

      {
        name: 'createClient',
        description: 'create client',
        permissionGroupId: 13,
        label: 'Create Client',
      },

      {
        name: 'updateClient',
        description: 'update client',
        permissionGroupId: 13,
        label: 'Update Client',
      },

      {
        name: 'deleteClient',
        description: 'delete client',
        permissionGroupId: 13,
        label: 'Delete Client',
      },

      {
        name: 'readResources',
        description: 'read Resources',
        permissionGroupId: 12,
        label: 'Read Resources',
      },

      {
        name: 'createResources',
        description: 'create Resources',
        permissionGroupId: 12,
        label: 'Create Resources',
      },

      {
        name: 'updateResources',
        description: 'update Resources',
        permissionGroupId: 12,
        label: 'Update Resources',
      },

      {
        name: 'deleteResources',
        description: 'delete Resources',
        permissionGroupId: 12,
        label: 'Delete Resources',
      },

    ];
  },
  dbGroupPermission: [{
      name: 'useSetting',
      label: 'Use Setting',
    },
    {
      name: 'timesheet',
      label: 'Timesheet',
    },

    {
      name: 'payroll',
      label: 'PayRoll',
    },
    {
      name: 'project',
      label: 'Project',
    },

    {
      name: 'Resources',
      label: 'Resources',
    },
    {
      name: 'client',
      label: 'Client',
    },
  ],

  rolePermission() {
    const dataArr = [];
    const role = this.dbRoles();
    const dbPermission = this.dbPermission();
    for (let i = 1; i <= role.length; i += 1) {
      for (let j = 28; j <= 27 + dbPermission.length; j += 1) {
        const obj = {
          roleId: i,
          permissionId: j,
          isActive: 1,
        };
        if (
          role[i - 1].rolename !== 'superadmin' &&
          dbPermission[j - 28].name === 'spadmin' 
        ) {
          obj.isActive = 0;
        }

        if (
          role[i - 1].rolename === 'employee' ) {
          obj.isActive = 0;
        }

        // if for user then permission in role = 0
        if (
          role[i - 1].rolename === 'user'
        ) {
          obj.isActive = 0;
        }
        
        // if for employee then permission in role = 0
        if (
          role[i - 1].rolename === 'employee' &&
          dbPermission[j - 28].permissionGroupId === 2 &&
          dbPermission[j - 28].name !== 'readProfile' 
        ) {
          obj.isActive = 0;
        }

        if (dbPermission[j - 28].name === 'readRole') {
          obj.isActive = 1;
        }

        dataArr.push(obj);
      }
    }

    return dataArr;
  },
};