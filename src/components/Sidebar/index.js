import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { minimizedSidebar } from './actions';
import { endpoint } from './../../constants/config';
import * as number from './constants';
import './index.css';
// import SkillsSolidIcon from './icons/skills-solid';
// import UserGraduateSolidIcon from './icons/user-graduate-solid';
// import DateOffIcon from './icons/day-off';
import ProjectDiagramSolidIcon from './icons/project-diagram-solid';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { constant } from '../../constants/constant';
const {
  createUser,
  readUser,
  createEmployee,
  readEmployee,
  createRole,
  readRole,
  readClient,
  readProject,
  readResources,
  readOneTimeSheet,
  readPayRoll,
  readOrgChart,
  createSetting,
  readSetting,
} = constant.permissions;
class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      activeMenu: null,
      activeShow: 0,
      ativeCurent: null,
    };
  }
  componentWillMount() {
    $(window).resize((e) => {
      const screenWidth = $(window).width();
      const { active } = this.state;
      if (screenWidth >= 768) {
      } else {
        if (active) this.sidebarCollapse();
      }
    });
  }
  onShow = (index) => {
    this.setState({ activeShow: index, activeMenu: index, ativeCurent: index });
  };

  sidebarCollapse = () => {
    const { active } = this.state;
    this.setState(
      {
        active: !this.state.active,
      },
      () => {
        this.props.minimizedSidebar(active);
      }
    );
  };

  render() {
    const { active, activeMenu, ativeCurent } = this.state;
    const { visible } = this.props;
    const LIST_PERMISSION = getItemLocalStore('listPermissions');
    const arrRoles = getItemLocalStore('userData.roles');
    const listRoles = [];
    const mainSidebar = 'main-sidebar style-3 pl-0 pr-0';
    if (arrRoles) {
      let arrLength = 0;
      arrLength = arrRoles.length;
      for (let i = 0; i < arrLength; i += 1) {
        if (arrRoles[i] && arrRoles[i].id) {
          listRoles.push(arrRoles[i].id);
        }
      }
    }
    return (
      <React.Fragment>
        <aside
          id="sidebar"
          className={`${mainSidebar} ${active ? '' : 'active'} ${
            !visible ? 'hide' : ''
          }`}>
          <section className="sidebar">
            <ul className="list-unstyled components">
              <li
                className="menu-bar"
                onClick={this.onShow.bind(this, `${number.c0}`)}>
                <NavLink
                  exact
                  to="/"
                  aria-current={
                    ativeCurent === `${number.c0}` ? 'true' : 'false'
                  }>
                  <FontAwesomeIcon icon="chart-pie" />
                  <span className="hidden-menu">Dashboard</span>
                </NavLink>
              </li>
              {(LIST_PERMISSION.includes(readUser) ||
                LIST_PERMISSION.includes(createUser)) && (
                <li
                  className="drop"
                  onClick={this.onShow.bind(this, `${number.c1}`)}>
                  <a
                    className="hoverBar"
                    aria-current={
                      ativeCurent === `${number.c1}` ? 'true' : 'false'
                    }
                    href="#homeSubmenu"
                    data-toggle="collapse"
                    aria-expanded={
                      activeMenu === `${number.c1}` ? 'true' : 'false'
                    }
                    onClick={this.onShow.bind(this, `${number.c1}`)}>
                    <FontAwesomeIcon icon="user-secret" />
                    <span>Users</span>
                    <span className="pull-right">
                      <FontAwesomeIcon
                        icon="angle-left"
                        className="faArrow ml-2"
                      />
                    </span>
                  </a>
                  <ul
                    className={
                      this.state.activeShow === `${number.c1}`
                        ? 'collapse list-unstyled show'
                        : 'collapse list-unstyled'
                    }
                    id="homeSubmenu">
                    {LIST_PERMISSION.includes(createUser) && (
                      <li>
                        <NavLink exact to={`/${endpoint.addUser}`}>
                          <FontAwesomeIcon icon="user-plus" />
                          <span className="iconActive">Add User</span>
                        </NavLink>
                      </li>
                    )}
                    {LIST_PERMISSION.includes(readUser) && (
                      <li>
                        <NavLink exact to={`/${endpoint.users}`}>
                          <FontAwesomeIcon icon="list-alt" />
                          <span className="iconActive">List Users</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </li>
              )}

              {(LIST_PERMISSION.includes(readEmployee) ||
                LIST_PERMISSION.includes(createEmployee)) && (
                <li className="drop" onClick={() => this.onShow(number.c2)}>
                  <a
                    className="hoverBar"
                    href="#employSub"
                    aria-current={
                      ativeCurent === `${number.c2}` ? 'true' : 'false'
                    }
                    data-toggle="collapse"
                    aria-expanded={
                      activeMenu === `${number.c2}` ? 'true' : 'false'
                    }
                    onClick={this.onShow.bind(this, `${number.c2}`)}>
                    <FontAwesomeIcon icon="user" />
                    <span>Employees</span>
                    <span className="pull-right">
                      <FontAwesomeIcon
                        icon="angle-left"
                        className="faArrow ml-2"
                      />
                    </span>
                  </a>
                  <ul
                    className={
                      this.state.activeShow === `${number.c2}`
                        ? 'collapse list-unstyled show'
                        : 'collapse list-unstyled'
                    }
                    id="employSub">
                    {LIST_PERMISSION.includes(createEmployee) && (
                      <li>
                        <NavLink exact to={`/${endpoint.addEmployee}`}>
                          <FontAwesomeIcon icon="user-plus" />
                          <span className="iconActive">Add Employee</span>
                        </NavLink>
                      </li>
                    )}
                    {LIST_PERMISSION.includes(readEmployee) && (
                      <li>
                        <NavLink exact to={`/${endpoint.employees}`}>
                          <FontAwesomeIcon prefix="far" icon="list-alt" />
                          <span className="iconActive">List Employees</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </li>
              )}

              {(LIST_PERMISSION.includes(readRole) ||
                LIST_PERMISSION.includes(createRole)) && (
                <li
                  className="drop"
                  onClick={this.onShow.bind(this, `${number.c9}`)}>
                  <a
                    className="hoverBar"
                    href="#rolesSub"
                    aria-current={
                      ativeCurent === `${number.c9}` ? 'true' : 'false'
                    }
                    data-toggle="collapse"
                    aria-expanded={
                      activeMenu === `${number.c9}` ? 'true' : 'false'
                    }
                    onClick={this.onShow.bind(this, `${number.c9}`)}>
                    <FontAwesomeIcon icon="lock" />
                    <span>Roles</span>
                    <span className="pull-right">
                      <FontAwesomeIcon
                        icon="angle-left"
                        className="faArrow ml-2"
                      />
                    </span>
                  </a>
                  <ul
                    className={
                      this.state.activeShow === `${number.c9}`
                        ? 'collapse list-unstyled show'
                        : 'collapse list-unstyled'
                    }
                    id="rolesSub">
                    {LIST_PERMISSION.includes(createRole) ? (
                      <li>
                        <NavLink exact to="/roles/add">
                          <FontAwesomeIcon icon="user-plus" />
                          <span className="iconActive">Add Role</span>
                        </NavLink>
                      </li>
                    ) : (
                      ''
                    )}
                    {LIST_PERMISSION.includes(readRole) ? (
                      <li>
                        <NavLink exact to="/roles">
                          <FontAwesomeIcon icon="list-alt" />
                          <span className="iconActive">List Roles</span>
                        </NavLink>
                      </li>
                    ) : (
                      ''
                    )}
                  </ul>
                </li>
              )}

              {(LIST_PERMISSION.includes(readClient) ||
                LIST_PERMISSION.includes(readProject) ||
                LIST_PERMISSION.includes(readResources) ||
                LIST_PERMISSION.includes(readOneTimeSheet) ||
                LIST_PERMISSION.includes(readPayRoll) ||
                LIST_PERMISSION.includes(readOrgChart)) && (
                <li
                  className="drop"
                  onClick={this.onShow.bind(this, `${number.c10}`)}>
                  <a
                    className="hoverBar"
                    href="#positionSub"
                    aria-current={
                      ativeCurent === `${number.c10}` ? 'true' : 'false'
                    }
                    data-toggle="collapse"
                    aria-expanded={
                      activeMenu === `${number.c10}` ? 'true' : 'false'
                    }
                    onClick={this.onShow.bind(this, `${number.c10}`)}>
                    <FontAwesomeIcon icon={['fas', 'building']} />
                    <span>Company</span>
                    <span className="pull-right">
                      <FontAwesomeIcon
                        icon="angle-left"
                        className="faArrow ml-2"
                      />
                    </span>
                  </a>
                  <ul
                    className={
                      this.state.activeShow === `${number.c10}`
                        ? 'collapse list-unstyled show'
                        : 'collapse list-unstyled'
                    }
                    id="positionSub">
                    {LIST_PERMISSION.includes(readClient) && (
                      <li>
                        <NavLink exact to="/company/clients">
                          <FontAwesomeIcon icon="users" />
                          <span className="iconActive">Clients</span>
                        </NavLink>
                      </li>
                    )}
                    {LIST_PERMISSION.includes(readProject) && (
                      <li>
                        <NavLink exact to="/company/projects">
                          <FontAwesomeIcon icon="tasks" />
                          <span className="iconActive">Projects</span>
                        </NavLink>
                      </li>
                    )}
                    {LIST_PERMISSION.includes(readResources) && (
                      <li>
                        <NavLink
                          exact
                          to={`/company/resources/${new Date().getFullYear()}`}>
                          {/* <FontAwesomeIcon icon="object-group" /> */}
                          <ProjectDiagramSolidIcon />
                          <span className="iconActive">Resources</span>
                        </NavLink>
                      </li>
                    )}
                    {LIST_PERMISSION.includes(readOneTimeSheet) && (
                      <li>
                        <NavLink exact to={`/company/timesheets`}>
                          <FontAwesomeIcon icon={['fas', 'calendar-alt']} />
                          <span className="iconActive">Timesheets</span>
                        </NavLink>
                      </li>
                    )}
                    {LIST_PERMISSION.includes(readOneTimeSheet) && (
                      <li>
                        <NavLink exact to={`/company/leaves`}>
                          <FontAwesomeIcon icon="sign-out-alt" />
                          <span className="iconActive">Leaves</span>
                        </NavLink>
                      </li>
                    )}
                    {LIST_PERMISSION.includes(readPayRoll) && (
                      <li>
                        <NavLink exact to="/company/payroll">
                          <FontAwesomeIcon icon="hand-holding-usd" />
                          <span className="iconActive">Payroll</span>
                        </NavLink>
                      </li>
                    )}
                    {/* {LIST_PERMISSION.includes('readRateCart') && (
                      <li>
                        <NavLink exact to="/company/rate-card">
                          <FontAwesomeIcon icon="clipboard-check" />
                          <span className="iconActive">Rate Card</span>
                        </NavLink>
                      </li>
                    )} */}
                    {/* {LIST_PERMISSION.includes('readSkillset') && (
                      <li>
                        <NavLink exact to="/company/skillset">
                          <SkillsSolidIcon />
                          <span className="iconActive">Skillset</span>
                        </NavLink>
                      </li>
                    )}
                    {LIST_PERMISSION.includes('readSkillMatrix') && (
                      <li>
                        <NavLink exact to="/company/skills-matrix">
                          <UserGraduateSolidIcon />
                          <span className="iconActive">Skills Matrix</span>
                        </NavLink>
                      </li>
                    )} */}
                    {LIST_PERMISSION.includes(readOrgChart) && (
                      <li>
                        <NavLink exact to="/company/organization-chart">
                          <FontAwesomeIcon icon="sitemap" />
                          <span className="iconActive">Organization Chart</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </li>
              )}

              {(LIST_PERMISSION.includes(createSetting) ||
                LIST_PERMISSION.includes(readSetting)) && (
                <li
                  className="menu-bar"
                  onClick={this.onShow.bind(this, `${number.c8}`)}>
                  <NavLink
                    aria-current={
                      ativeCurent === `${number.c8}` ? 'true' : 'false'
                    }
                    exact
                    to="/settings">
                    <FontAwesomeIcon icon="cog" />
                    <span className="hidden-menu">Settings</span>
                  </NavLink>
                </li>
              )}
            </ul>
            <ul className="list-unstyled showIconSidebar">
              <li className="icon-collapse">
                <a
                  onClick={this.sidebarCollapse}
                  className="sidebar-toggle"
                  data-toggle="push-menu">
                  <FontAwesomeIcon icon="arrow-circle-left" />
                  <span className={`${active ? 'ml-2' : 'text-hide'}`}>
                    Collapse
                  </span>
                </a>
              </li>
            </ul>
          </section>
        </aside>
      </React.Fragment>
    );
  }
}
SideBar.propTypes = {
  visible: PropTypes.bool,
  minimizedSidebar: PropTypes.func,
};

const mapStateToProps = (state) => ({
  visible: state.visible,
});

function mapDispatchToProps(dispatch) {
  return {
    minimizedSidebar: bindActionCreators(minimizedSidebar, dispatch),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SideBar)
);
