const accountController = require('../controllers/account');
const profileController = require('../controllers/profile');
const roleController = require('../controllers/role');
const permissionController = require('../controllers/permission');
const activeMailController = require('../controllers/active-mail');
const permissionGroupController = require('../controllers/permission-group');
const rolePermissionController = require('../controllers/role-permission');
const accountPermissionController = require('../controllers/account-permission');
const variableController = require('../controllers/variable');
const accountRoleController = require('../controllers/account-role');
const cronjobController = require('../controllers/cronjob');
const departmentController = require('../controllers/department');
const positionController = require('../controllers/position');
const curiculumVitaeController = require('../controllers/curriculum-vitae');
const notificationController = require('../controllers/notification');
const timeSheetController = require('../controllers/timesheet');
const payRollController = require('../controllers/pay-roll');
const projectContronller = require('../controllers/project');
const resourcePlanningController = require('../controllers/resourcePlanning');
const skillController = require('../controllers/skill');
const skillMatrixcontroller = require('../controllers/skillMatrices');
const ratesCardController = require('../controllers/ratesCard');
const clientController = require('../controllers/client');
const leaveManagentController = require('../controllers/leaveManagent');

module.exports = {
  configRouter: [
    /**
     * Model account
     */
    {
      router: '/login',
      controller: accountController.login,
      method: 'post',
      allowPermission: [],
    },
    {
      router: '/logout',
      controller: accountController.logout,
      method: 'post',
      allowPermission: ['readUser'],
    },
    {
      router: '/account-register',
      controller: accountController.register,
      method: 'post',
      allowPermission: [],
    },
    {
      router: '/account-existed-email',
      controller: accountController.createOneExistedEmail,
      method: 'post',
      allowPermission: ['updateEmployee', 'createUser'],
    },
    {
      router: '/account-no-email',
      controller: accountController.createOneNoEmail,
      method: 'post',
      allowPermission: ['createUser', 'createEmployee'],
    },
    {
      router: '/accounts',
      controller: accountController.getAll,
      method: 'get',
      allowPermission: ['readUser'],
    },
    {
      router: '/account',
      controller: accountController.getOne,
      method: 'get',
      allowPermission: ['readUser'],
    },
    {
      router: '/account',
      controller: accountController.deleteOne,
      method: 'delete',
      allowPermission: ['deleteUser'],
    },
    {
      router: '/account',
      controller: accountController.updateOne,
      method: 'patch',
      allowPermission: ['updateUser'],
    },

    /**
     * Model profile
     */
    {
      router: '/profiles',
      controller: profileController.getAllNoAccount,
      method: 'get',
      allowPermission: ['readUser'],
    },
    {
      router: '/profiles-account',
      controller: profileController.getAllHaveAccount,
      method: 'get',
      allowPermission: ['readUser'],
    },
    {
      router: '/profile',
      controller: profileController.getOneById,
      method: 'get',
      allowPermission: ['readUser'],
    },
    {
      router: '/profile-email',
      controller: profileController.getOneByEmail,
      method: 'get',
      allowPermission: ['readEmployee'],
    },
    {
      router: '/profile',
      controller: profileController.updateOne,
      method: 'patch',
      allowPermission: ['updateUser'],
    },
    {
      router: '/profile',
      controller: profileController.createOne,
      method: 'post',
      allowPermission: ['createEmployee'],
    },
    {
      router: '/profile',
      controller: profileController.deleteOneById,
      method: 'delete',
      allowPermission: ['deleteEmployee'],
    },
    {
      router: '/profile-email',
      controller: profileController.deleteOneByEmail,
      method: 'delete',
      allowPermission: ['deleteEmployee'],
    },
    {
      router: '/profiles-id',
      controller: profileController.getByIds,
      method: 'post',
      allowPermission: ['readEmployee'],
    },

    /**
     * Model role
     */
    {
      router: '/roles',
      controller: roleController.getAll,
      method: 'get',
      allowPermission: ['readRole'],
    },
    {
      router: '/role',
      controller: roleController.getOneById,
      method: 'get',
      allowPermission: ['readRole'],
    },
    {
      router: '/role-name',
      controller: roleController.getOneByName,
      method: 'get',
      allowPermission: ['readRole'],
    },
    {
      router: '/role',
      controller: roleController.createOne,
      method: 'post',
      allowPermission: ['createRole'],
    },
    {
      router: '/role',
      controller: roleController.updateOne,
      method: 'patch',
      allowPermission: ['updateRole'],
    },
    {
      router: '/role',
      controller: roleController.deleteOne,
      method: 'delete',
      allowPermission: ['deleteRole'],
    },

    /**
     * Model permission
     */
    {
      router: '/permission',
      controller: permissionController.getOne,
      method: 'get',
      allowPermission: [], // will be handled later.
    },
    {
      router: '/permission',
      controller: permissionController.createOne,
      method: 'post',
      allowPermission: [], // will be handled later.
    },
    {
      router: '/permission',
      controller: permissionController.deleteOne,
      method: 'delete',
      allowPermission: [], // will be handled later.
    },
    {
      router: '/permission',
      controller: permissionController.updateOne,
      method: 'patch',
      allowPermission: [], // will be handled later.
    },

    /**
     * Model role permission
     */
    {
      router: '/permissions-role',
      controller: rolePermissionController.getAllByRole,
      method: 'get',
      allowPermission: ['readRole'],
    },
    {
      router: '/permissions-role',
      controller: rolePermissionController.updateAllByRole,
      method: 'post',
      allowPermission: ['updateRole'],
    },

    /**
     * Model permission group
     */

    {
      router: '/permission-groups',
      controller: permissionGroupController.getAll,
      method: 'get',
      allowPermission: ['readRole'],
    },
    {
      router: '/permissions-groups',
      controller: permissionGroupController.getPermissionsGroup,
      method: 'get',
      allowPermission: ['readRole'],
    },
    {
      router: '/permission-group',
      controller: permissionGroupController.getOne,
      method: 'get',
      allowPermission: ['readRole'],
    },

    /**
     * model account permission.
     */
    {
      router: '/account-permission',
      controller: accountPermissionController.setPermissionForAccount,
      method: 'post',
      allowPermission: ['assignPermission'],
    },
    {
      router: '/account-permission-current',
      controller: accountPermissionController.getCurrentAccountPermissions,
      method: 'get',
      allowPermission: ['readUser'],
    },

    /**
     * model account role.
     */
    {
      router: '/account-role',
      controller: accountRoleController.setRoleForAccount,
      method: 'post',
      allowPermission: ['assignRole'],
    },
    {
      router: '/account-role',
      controller: accountRoleController.getOne,
      method: 'get',
      allowPermission: ['readUser'],
    },

    /**
     * model variable.
     */

    {
      router: '/set-variable',
      controller: variableController.setVariable,
      method: 'post',
      allowPermission: [],
    },
    {
      router: '/get-variable',
      controller: variableController.getVariable,
      method: 'post',
      allowPermission: [],
    },

    /**
     * model department.
     */
    {
      router: '/department',
      controller: departmentController.createOne,
      method: 'post',
      allowPermission: ['createOrgChart'],
    },
    {
      router: '/department',
      controller: departmentController.updateOne,
      method: 'patch',
      allowPermission: ['updateOrgChart'],
    },
    {
      router: '/department',
      controller: departmentController.deleteOne,
      method: 'delete',
      allowPermission: ['deleteOrgChart'],
    },
    {
      router: '/departments',
      controller: departmentController.getAll,
      method: 'get',
      allowPermission: [],
    },

    /**
     * model position.
     */
    {
      router: '/position',
      controller: positionController.createOne,
      method: 'post',
      allowPermission: ['createPosition'],
    },
    {
      router: '/position',
      controller: positionController.updateOne,
      method: 'patch',
      allowPermission: ['updatePosition'],
    },
    {
      router: '/position',
      controller: positionController.getOne,
      method: 'get',
      allowPermission: ['readPosition'],
    },
    {
      router: '/position',
      controller: positionController.deleteOne,
      method: 'delete',
      allowPermission: ['deletePosition'],
    },
    {
      router: '/positions',
      controller: positionController.getPositionsByDepartmentId,
      method: 'get',
      allowPermission: ['readPosition'],
    },

    /**
     * model profile position.
     */
    {
      router: '/profile-position',
      controller: positionController.deleteProfilePosition,
      method: 'delete',
      allowPermission: ['deletePosition'],
    },
    {
      router: '/profile-position',
      controller: positionController.setProfilePosition,
      method: 'post',
      allowPermission: ['createPosition'],
    },
    {
      router: '/set-position-chart',
      controller: positionController.setParentProfilePosition,
      method: 'post',
      allowPermission: ['updatePosition'],
    },
    {
      router: '/profile-position-parent',
      controller: positionController.removeParent,
      method: 'delete',
      allowPermission: ['updatePosition'],
    },
    {
      router: '/profile-position',
      controller: positionController.changePositionForProfilePosision,
      method: 'patch',
      allowPermission: ['updatePosition'],
    },
    {
      router: '/position-chart',
      controller: positionController.getChart,
      method: 'get',
      allowPermission: ['readPosition'],
    },

    /**
     * Curriculum Vitae
     */
    {
      router: '/cv-get-type',
      controller: curiculumVitaeController.getAllTypes,
      method: 'get',
      allowPermission: [],
    },
    {
      router: '/cv-get-one',
      controller: curiculumVitaeController.getOneCV,
      method: 'get',
      allowPermission: [],
    },
    {
      router: '/cv-delete-one',
      controller: curiculumVitaeController.deleteOne,
      method: 'delete',
      allowPermission: [],
    },
    {
      router: '/cv-delete-full',
      controller: curiculumVitaeController.deleteFull,
      method: 'delete',
      allowPermission: [],
    },
    {
      router: '/cv-create-new',
      controller: curiculumVitaeController.createCV,
      method: 'post',
      allowPermission: [],
    },
    {
      router: '/cv-update',
      controller: curiculumVitaeController.updateCV,
      method: 'patch',
      allowPermission: [],
    },

    /**
     * support routers.
     */
    {
      router: '/image-upload',
      controller: profileController.uploadImage,
      method: 'post',
      allowPermission: [],
    },
    {
      router: '/change-password',
      controller: accountController.updatePassword,
      method: 'patch',
      allowPermission: [],
    },
    {
      router: '/checkforgot',
      controller: profileController.checkEmail,
      method: 'post',
      allowPermission: [],
    },
    {
      router: '/active-account',
      controller: activeMailController.activeAccount,
      method: 'get',
      allowPermission: [],
    },
    {
      router: '/restart-job',
      controller: cronjobController.resetJob,
      method: 'get',
      allowPermission: [],
    },
    /**
     * Model Notification
     */
    {
      router: '/notifications',
      controller: notificationController.getAllNotifications,
      method: 'get',
      // allowPermission: ['readNotification'],
      allowPermission: [],
    },
    // {
    //   router: '/test',
    //   controller: positionController.test,
    //   method: 'use',
    //   allowPermission: [],
    // },

    // timesheet

    {
      router: '/create-timesheet',
      controller: timeSheetController.createTimeSheet,
      method: 'post',
      allowPermission: ['createTimeSheet'],
    },

    {
      router: '/timesheets',
      controller: timeSheetController.getAll,
      method: 'get',
      allowPermission: [],
    },

    {
      router: '/timesheet',
      controller: timeSheetController.getOne,
      method: 'get',
      allowPermission: ['readOneTimeSheet'],
    },

    {
      router: '/timesheet',
      controller: timeSheetController.deleteOne,
      method: 'delete',
      allowPermission: ['deleteTimeSheet'],
    },

    {
      router: '/timesheet',
      controller: timeSheetController.update,
      method: 'patch',
      allowPermission: ['updateTimeSheet'],
    },

    {
      router: '/timesheet-total',
      controller: timeSheetController.getAllTotalTimeSheetByProfileId,
      method: 'get',
      allowPermission: [],
    },
    {
      router: '/timesheet-totals',
      controller: timeSheetController.getAllTotal,
      method: 'get',
      allowPermission: [],
    },

    // payroll
    {
      router: '/payrolls',
      controller: payRollController.createOne,
      method: 'post',
      allowPermission: ['createPayRoll'],
    },

    {
      router: '/payrolls',
      controller: payRollController.getAll,
      method: 'get',
      allowPermission: ['readPayRoll'],
    },
    {
      router: '/payroll',
      controller: payRollController.getOneById,
      method: 'get',
      allowPermission: ['readPayRoll'],
    },
    {
      router: '/payrolls',
      controller: payRollController.updateOne,
      method: 'patch',
      allowPermission: ['updatePayRoll'],
    },

    {
      router: '/payrolls',
      controller: payRollController.deleteOne,
      method: 'delete',
      allowPermission: ['deletePayRoll'],
    },

    {
      router: '/payroll-clone',
      controller: payRollController.clonePayroll,
      method: 'post',
      allowPermission: [],
    },
    // paySlip
    {
      router: '/paySlip',
      controller: payRollController.getOne,
      method: 'get',
      allowPermission: ['readPaySlip'],
    },
    //client

    {
      router: '/client',
      controller: clientController.createOne,
      method: 'post',
      allowPermission: ['createClient'],
    },

    {
      router: '/client',
      controller: clientController.getOne,
      method: 'get',
      allowPermission: ['readClient'],
    },

    {
      router: '/clients',
      controller: clientController.getAll,
      method: 'get',
      allowPermission: [],
    },

    {
      router: '/client',
      controller: clientController.deleteOne,
      method: 'delete',
      allowPermission: ['deleteClient'],
    },

    {
      router: '/client',
      controller: clientController.update,
      method: 'patch',
      allowPermission: ['updateClient'],
    },
    // project
    {
      router: '/project',
      controller: projectContronller.createOneProject,
      method: 'post',
      allowPermission: ['createProject'],
    },

    {
      router: '/project',
      controller: projectContronller.getOneProject,
      method: 'get',
      allowPermission: ['readProject'],
    },

    {
      router: '/project',
      controller: projectContronller.updateProject,
      method: 'patch',
      allowPermission: ['updateProject'],
    },

    {
      router: '/project',
      controller: projectContronller.deleteProject,
      method: 'delete',
      allowPermission: ['deleteProject'],
    },

    {
      router: '/projects',
      controller: projectContronller.getAllProject,
      method: 'get',
      allowPermission: [],
    },

    // resourcePlanning

    {
      router: '/resouce-planning',
      controller: resourcePlanningController.createOne,
      method: 'post',
      allowPermission: ['createResources'],
    },

    {
      router: '/resouce-planning',
      controller: resourcePlanningController.getOne,
      method: 'get',
      allowPermission: [],
    },

    {
      router: '/resouce-planning',
      controller: resourcePlanningController.update,
      method: 'patch',
      allowPermission: ['updateResources'],
    },

    {
      router: '/resouce-planning',
      controller: resourcePlanningController.delete,
      method: 'delete',
      allowPermission: ['deleteResources'],
    },

    {
      router: '/resouce-plannings',
      controller: resourcePlanningController.getAll,
      method: 'get',
      allowPermission: [],
    },

    {
      router: '/resouce-plannings',
      controller: resourcePlanningController.CloneResoucres,
      method: 'post',
      allowPermission: [],
    },
    // Skill
    {
      router: '/group-skill',
      controller: skillController.createOneGroupSkill,
      method: 'post',
      allowPermission: [],
    },

    {
      router: '/group-skill',
      controller: skillController.getOneGroupSkill,
      method: 'get',
      allowPermission: [],
    },

    {
      router: '/group-skill',
      controller: skillController.updateGroupSkill,
      method: 'patch',
      allowPermission: [],
    },

    {
      router: '/group-skill',
      controller: skillController.deleteGroupSkill,
      method: 'delete',
      allowPermission: [],
    },

    {
      router: '/group-skills',
      controller: skillController.getAllGroupSkill,
      method: 'get',
      allowPermission: [],
    },

    // skill
    {
      router: '/skill',
      controller: skillController.createOneSkill,
      method: 'post',
      allowPermission: [],
    },

    {
      router: '/skill',
      controller: skillController.getOneSkill,
      method: 'get',
      allowPermission: [],
    },
    {
      router: '/skill-in-group',
      controller: skillController.getSkillsByGroup,
      method: 'get',
      allowPermission: [],
    },
    {
      router: '/skill',
      controller: skillController.updateSkill,
      method: 'patch',
      allowPermission: [],
    },

    {
      router: '/skill',
      controller: skillController.deleteSkill,
      method: 'delete',
      allowPermission: [],
    },

    {
      router: '/skills',
      controller: skillController.getAllSkill,
      method: 'get',
      allowPermission: [],
    },

    // skill matrix

    {
      router: '/skill-matrix',
      controller: skillMatrixcontroller.createOne,
      method: 'post',
      allowPermission: [],
    },

    {
      router: '/skill-matrix',
      controller: skillMatrixcontroller.getOne,
      method: 'get',
      allowPermission: [],
    },

    {
      router: '/skill-matrix',
      controller: skillMatrixcontroller.update,
      method: 'patch',
      allowPermission: [],
    },

    {
      router: '/skill-matrix',
      controller: skillMatrixcontroller.delete,
      method: 'delete',
      allowPermission: [],
    },

    {
      router: '/skill-matrices',
      controller: skillMatrixcontroller.getAll,
      method: 'get',
      allowPermission: [],
    },

    // rates card
    // {
    //   router: '/rates-card',
    //   controller: ratesCardController.create,
    //   method: 'post',
    //   allowPermission: [],
    // },

    // {
    //   router: '/rates-card',
    //   controller: ratesCardController.getOne,
    //   method: 'get',
    //   allowPermission: [],
    // },

    // {
    //   router: '/rates-card',
    //   controller: ratesCardController.updateOne,
    //   method: 'patch',
    //   allowPermission: [],
    // },

    // {
    //   router: '/rates-card',
    //   controller: ratesCardController.deleteRates,
    //   method: 'delete',
    //   allowPermission: [],
    // },

    // {
    //   router: '/rates-cards',
    //   controller: ratesCardController.getAll,
    //   method: 'get',
    //   allowPermission: [],
    // },

    // {
    //   router: '/rates-cards',
    //   controller: ratesCardController.deleteAll,
    //   method: 'delete',
    //   allowPermission: [],
    // },

    //leave management

    {
      router: '/leave',
      controller: leaveManagentController.createLeaveManagement,
      method: 'post',
      allowPermission: [],
    },

    {
      router: '/leave',
      controller: leaveManagentController.getLeaveManagement,
      method: 'get',
      allowPermission: [],
    },

    {
      router: '/leave',
      controller: leaveManagentController.updateLeaveManagement,
      method: 'patch',
      allowPermission: [],
    },

    {
      router: '/leave',
      controller: leaveManagentController.deleteOneLeave,
      method: 'delete',
      allowPermission: [],
    },

    {
      router: '/leave-approve',
      controller: leaveManagentController.updateApproveLeaveRequest,
      method: 'patch',
      allowPermission: [],
    },

    {
      router: '/leaves',
      controller: leaveManagentController.getAllLeaveInMonth,
      method: 'get',
      allowPermission: [],
    },
    {
      router: '/report-day-off',
      controller: leaveManagentController.reportDayOff,
      method: 'get',
      allowPermission: [],
    },
    // {
    //   router:,
    //   controller:
    //   method: '',
    //   allowPermission: []
    // },
  ],
};
