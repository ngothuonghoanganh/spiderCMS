import React from 'react';
import ViewProfile from './containers/ViewStaff';
import EditProfile from './containers/EditProfile';
import User from './containers/User';
import AddUser from './containers/AddUser/index';
import EditUser from './containers/EditUser';
import Staff from './containers/Staff';
import AddEmployee from './containers/AddEmployee';
import EditEmployee from './containers/EditEmployee';
import Payslip from './containers/Payslip';
import ViewCV from './containers/ViewCV';
import Dashboard from './containers/Dashboard';
import Roles from './containers/Roles';
import RoleForm from './containers/Roles/RoleForm';
import Permissions from './containers/Roles/Permissions';
import Settings from './containers/Settings';
import ShowNotification from './containers/ShowNotification';
import TimeSheet from './containers/TimeSheet';
import AddTimesheet from './containers/AddTimesheet';
import EditTimesheet from './containers/EditTimesheet';
import Timesheets from './containers/ViewAllTimesheets';
import Client from './containers/Client';
import ProjectManagement from './containers/ProjectManagement';
import ResourcesPlanning from './components/ResourcesPlanning';
import Payroll from './containers/Payroll';
import AddPayroll from './containers/AddPayroll';
import EditPayroll from './containers/EditPayroll';
import OrganizationChart from './containers/OrganizationChart';
import SkillsMatrix from './containers/SkillsMatrix';
import SkillsManagement from './containers/Skills';
import SubSkillsManagement from './containers/Skills/SubSkills';
import LeaveManagement from './containers/LeaveManagement';

const routes = [
  {
    path: '/',
    exact: true,
    breadcrumb: 'Dashboard',
    main: () => <Dashboard />,
  },
  {
    path: '/employees',
    exact: true,
    breadcrumb: 'Employees',
    main: ({ history }) => <Staff history={history} />,
  },
  {
    path: '/employees/add',
    exact: false,
    breadcrumb: 'Add',
    main: ({ history }) => <AddEmployee history={history} />,
  },
  {
    path: '/employees/edit/:id',
    exact: false,
    breadcrumb: 'Edit',
    main: ({ match, history }) => (
      <EditEmployee match={match} history={history} />
    ),
  },
  {
    path: '/company/timesheets/view/:id',
    exact: true,
    breadcrumb: 'View',
    main: ({ match, history }) => <TimeSheet match={match} history={history} />,
  },
  {
    path: '/company/timesheets/add',
    exact: true,
    breadcrumb: 'Add',
    main: ({ match, history }) => (
      <AddTimesheet match={match} history={history} />
    ),
  },
  {
    path: '/company/timesheets/edit/:id',
    exact: true,
    breadcrumb: 'Edit',
    main: ({ match, history }) => (
      <EditTimesheet match={match} history={history} />
    ),
  },
  {
    path: '/employees/view/:id',
    exact: false,
    breadcrumb: 'View',
    main: ({ match, history }) => (
      <ViewProfile match={match} history={history} />
    ),
  },
  {
    path: '/users',
    exact: true,
    breadcrumb: 'Users',
    main: ({ history }) => <User history={history} />,
  },
  {
    path: '/users/add',
    exact: false,
    breadcrumb: 'Add',
    main: ({ history }) => <AddUser history={history} />,
  },
  {
    path: '/users/edit/:id',
    exact: false,
    breadcrumb: 'Edit',
    main: ({ match, history }) => <EditUser match={match} history={history} />,
  },
  {
    path: '/users/view/:id',
    exact: false,
    breadcrumb: 'View',
    main: ({ match, history }) => (
      <ViewProfile match={match} history={history} />
    ),
  },
  {
    path: '/profile',
    exact: true,
    breadcrumb: 'Profile',
    main: ({ history }) => <EditProfile history={history} />,
  },
  {
    path: '/profile/view/:id',
    exact: false,
    breadcrumb: 'View',
    main: ({ history, match }) => (
      <ViewProfile match={match} history={history} />
    ),
  },
  {
    path: '/roles',
    exact: true,
    breadcrumb: 'Roles',
    main: () => <Roles />,
  },
  {
    path: '/roles/add',
    exact: false,
    breadcrumb: 'Add',
    main: ({ match, history }) => <RoleForm history={history} match={match} />,
  },
  {
    path: '/roles/:rolename/edit-role',
    exact: false,
    breadcrumb: 'Edit Role',
    main: ({ match, history }) => <RoleForm match={match} history={history} />,
  },
  {
    path: '/roles/:id/permissions/edit',
    exact: false,
    breadcrumb: 'Edit Permission',
    main: ({ match, history }) => (
      <Permissions match={match} history={history} />
    ),
  },
  {
    path: '/settings',
    exact: true,
    breadcrumb: 'Settings',
    main: () => <Settings />,
  },
  {
    path: '/employees/editCV/:id',
    exact: true,
    breadcrumb: 'Edit-CV',
    main: ({ match, history }) => <ViewCV match={match} history={history} />,
  },
  {
    path: '/notifications',
    exact: true,
    breadcrumb: 'Notification',
    main: ({ match, history }) => (
      <ShowNotification match={match} history={history} />
    ),
  },
  {
    path: '/company/resources/:year',
    exact: true,
    breadcrumb: 'Resources',
    main: ({ match, history }) => (
      <ResourcesPlanning match={match} history={history} />
    ),
  },
  {
    path: '/company/projects',
    exact: true,
    breadcrumb: 'Projects',
    main: ({ match, history }) => (
      <ProjectManagement match={match} history={history} />
    ),
  },
  {
    path: '/company/timesheets',
    exact: true,
    breadcrumb: 'Timesheets',
    main: () => <Timesheets />,
  },
  {
    path: '/company/leaves',
    exact: false,
    breadcrumb: 'Leaves',
    main: ({ match }) => <LeaveManagement match={match} />,
  },
  {
    path: '/company/payroll',
    exact: true,
    breadcrumb: 'Payroll',
    main: ({ match, history }) => <Payroll match={match} history={history} />,
  },
  {
    path: '/company/payroll/add',
    exact: true,
    breadcrumb: 'Add',
    main: ({ history }) => <AddPayroll history={history} />,
  },
  {
    path: '/company/payroll/edit/:id',
    exact: true,
    breadcrumb: 'Edit',
    main: ({ match, history }) => (
      <EditPayroll match={match} history={history} />
    ),
  },
  {
    path: '/company/payslip/:id',
    exact: false,
    breadcrumb: 'Payslip',
    main: ({ match, history }) => <Payslip match={match} history={history} />,
  },
  {
    path: '/company/clients',
    exact: false,
    breadcrumb: 'Clients',
    main: ({ match, history }) => <Client match={match} history={history} />,
  },
  {
    path: '/company/organization-chart',
    exact: false,
    breadcrumb: 'Organization Chart',
    main: ({ match, history }) => (
      <OrganizationChart match={match} history={history} />
    ),
  },
  {
    path: '/company/skillset',
    exact: true,
    breadcrumb: 'Skills',
    main: ({ match }) => <SkillsManagement match={match} />,
  },
  {
    path: '/company/skillset/:id',
    exact: false,
    breadcrumb: 'Sub',
    main: ({ match }) => <SubSkillsManagement match={match} />,
  },
  {
    path: '/company/skills-matrix',
    exact: false,
    breadcrumb: 'Skills Matrix',
    main: ({ match }) => <SkillsMatrix match={match} />,
  },
];

export default routes;
