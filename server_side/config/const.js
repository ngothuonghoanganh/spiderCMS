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
    'User-register',
    'active-User',
    'position-chart',
    'test',
    'notifications',
    'account-register',
    'leave',
    'leave-approve'
  ],
  dbRoles() {
    return [
      {
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
    return [
      {
        name: 'spadmin',
        description: 'all permission for super admin',
        permissionGroupId: 5,
        label: 'Super Admin',
      },
      {
        name: 'createEmployee',
        description: 'create Employee',
        permissionGroupId: 2,
        label: 'Create Employee',
      },
      {
        name: 'updateEmployee',
        description: 'update Employee',
        permissionGroupId: 2,
        label: 'Update Employee',
      },
      {
        name: 'readEmployee',
        description: 'get data from Employee',
        permissionGroupId: 2,
        label: 'Read Employee',
      },
      {
        name: 'deleteEmployee',
        description: 'delete data from Employee',
        permissionGroupId: 2,
        label: 'Delete Employee',
      },
      {
        name: 'createUser',
        description: 'create user',
        permissionGroupId: 3,
        label: 'Create User',
      },
      {
        name: 'updateUser',
        description: 'update user',
        permissionGroupId: 3,
        label: 'Update User',
      },
      {
        name: 'readUser',
        description: 'get data from user',
        permissionGroupId: 3,
        label: 'Read User',
      },
      {
        name: 'deleteUser',
        description: 'delete data from user',
        permissionGroupId: 3,
        label: 'Delete User',
      },
      {
        name: 'createRole',
        description: 'create role',
        permissionGroupId: 1,
        label: 'Create Role',
      },
      {
        name: 'updateRole',
        description: 'update role',
        permissionGroupId: 1,
        label: 'Update Role',
      },
      {
        name: 'readRole',
        description: 'get data from role',
        permissionGroupId: 1,
        label: 'Read Role',
      },
      {
        name: 'deleteRole',
        description: 'delete data from role',
        permissionGroupId: 1,
        label: 'Delete Role',
      },
      {
        name: 'assignRole',
        description: 'assign role for an User',
        permissionGroupId: 1,
        label: 'Assign Role',
      },
      {
        name: 'assignPermission',
        description: 'assign Permission for an User',
        permissionGroupId: 1,
        label: 'Assign Permission',
      },
      {
        name: 'readVariable',
        description: 'get data from variable',
        permissionGroupId: 4,
        label: 'Read Variable',
      },
      {
        name: 'createVariable',
        description: 'create variable',
        permissionGroupId: 4,
        label: 'Create Variable',
      },
      {
        name: 'updateVariable',
        description: 'update variable',
        permissionGroupId: 4,
        label: 'Update Variable',
      },
      {
        name: 'deleteVariable',
        description: 'delete variable',
        permissionGroupId: 4,
        label: 'Delete Variable',
      },

      {
        name: 'readPosition',
        description: 'read Position',
        permissionGroupId: 6,
        label: 'Read Position',
      },
      {
        name: 'createPosition',
        description: 'create Position',
        permissionGroupId: 6,
        label: 'Create Position',
      },
      {
        name: 'deletePosition',
        description: 'delete Position',
        permissionGroupId: 6,
        label: 'Delete Position',
      },
      {
        name: 'updatePosition',
        description: 'update Position',
        permissionGroupId: 6,
        label: 'Update Position',
      },
    ];
  },
  dbGroupPermission: [
    {
      name: 'role',
      label: 'Role',
    }, // id = 1
    {
      name: 'Employee',
      label: 'Employee',
    }, // id = 2
    {
      name: 'User',
      label: 'User',
    }, // id = 3
    {
      name: 'use variable',
      label: 'Use Variable',
    }, // id = 4
    {
      name: 'super admin',
      label: 'Super Admin',
    }, // id = 5
    {
      name: 'department',
      label: 'Department',
    }, // id = 6
  ],

  rolePermission() {
    const dataArr = [];
    const role = this.dbRoles();
    const dbPermission = this.dbPermission();

    for (let i = 1; i <= role.length; i += 1) {
      for (let j = 1; j <= dbPermission.length; j += 1) {
        const obj = {
          roleId: i,
          permissionId: j,
          isActive: 1,
        };

        if (
          role[i - 1].rolename !== 'superadmin' &&
          dbPermission[j - 1].name === 'spadmin'
        ) {
          obj.isActive = 0;
        }

        if (
          role[i - 1].rolename === 'employee' &&
          dbPermission[j - 1].permissionGroupId === 4
        ) {
          obj.isActive = 0;
        }

        // if for user then permission in role = 0
        if (role[i - 1].rolename === 'user') {
          obj.isActive = 0;
        }

        if (
          role[i - 1].rolename === 'user' &&
          dbPermission[j - 1].permissionGroupId === 3
        ) {
          obj.isActive = 1;
        }

        // if for employee then permission in role = 0
        if (
          role[i - 1].rolename === 'employee' &&
          dbPermission[j - 1].permissionGroupId === 2 &&
          dbPermission[j - 1].name !== 'readPofile'
        ) {
          obj.isActive = 0;
        }

        if (dbPermission[j - 1].name === 'readRole') {
          obj.isActive = 1;
        }

        dataArr.push(obj);
      }
    }

    return dataArr;
  },
};
