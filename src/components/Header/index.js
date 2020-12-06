import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import $ from 'jquery';
import './index.css';
import PopoverProfile from './PopoverProfile';
import PopoverNotifi from './PopoverNotifi';
import { toggleSidebar } from './actions';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { constant } from '../../constants/constant';
const {
  createUser,
  readUser,
  updateUser,
  deleteUser,
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
} = constant.permissions;
class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      popoverOpen: false,
    };
  }

  componentWillMount() {
    $(window).resize((e) => {
      const screenWidth = $(window).width();
      const { visible } = this.state;
      if (screenWidth >= 768) {
        if (!visible) this.handleClick();
      } else {
        if (visible) this.handleClick();
      }
    });
  }

  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  };

  handleClick = () => {
    this.setState({ visible: !this.state.visible }, () => {
      const { visible } = this.state;
      this.props.toggleSidebar(visible);
    });
  };

  render() {
    const { minimized } = this.props;
    const listPermissions = getItemLocalStore('listPermissions');
    return (
      <nav className="navbar navbar-toggleable-md navbar-expand-md navbar-light sticky-top pl-0">
        <NavLink
          to="/"
          className={`navbar-brand ${minimized ? 'minimized' : ''}`}></NavLink>
        <div
          className="navbar-toggle d-md-none d-block"
          onClick={this.handleClick}>
          <FontAwesomeIcon icon="bars" />
        </div>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-3 menu-bar">
            <li>
              <NavLink exact to="/">
                <span>Dashboard</span>
              </NavLink>
            </li>
            {listPermissions.includes(createUser) &&
            listPermissions.includes(readUser) &&
            listPermissions.includes(updateUser) &&
            listPermissions.includes(deleteUser) ? (
              <li className="nav-item dropdown breadHeader">
                <div>
                  <NavLink
                    to={`/${endpoint.users}`}
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <span>Users</span>
                  </NavLink>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink">
                    {listPermissions.includes(createUser) && (
                      <NavLink
                        exact
                        to={`/${endpoint.addUser}`}
                        className="dropdown-item">
                        <span>Add User</span>
                      </NavLink>
                    )}
                    {listPermissions.includes(readUser) && (
                      <NavLink
                        exact
                        to={`/${endpoint.users}`}
                        className="dropdown-item">
                        <span>List Users</span>
                      </NavLink>
                    )}
                  </div>
                </div>
              </li>
            ) : (
              ''
            )}
            {(listPermissions.includes(createEmployee) ||
              listPermissions.includes(readEmployee)) && (
              <li className="nav-item dropdown breadHeader">
                <div>
                  <NavLink
                    to={`/${endpoint.employees}`}
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <span>Employees</span>
                  </NavLink>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink">
                    {listPermissions.includes(createEmployee) && (
                      <NavLink
                        exact
                        to={`/${endpoint.addEmployee}`}
                        className="dropdown-item">
                        <span>Add Employee</span>
                      </NavLink>
                    )}
                    {listPermissions.includes(readEmployee) && (
                      <NavLink
                        exact
                        to={`/${endpoint.employees}`}
                        className="dropdown-item">
                        <span>List Employees</span>
                      </NavLink>
                    )}
                    {/* {
                    <NavLink exact to={`/timesheets`} className="dropdown-item">
                      <span>Timesheets</span>
                    </NavLink>
                  }
                  {
                    <NavLink exact to={`/payslip`} className="dropdown-item">
                      <span>Payslip</span>
                    </NavLink>
                  } */}
                  </div>
                </div>
              </li>
            )}

            {(listPermissions.includes(readRole) ||
              listPermissions.includes(createRole)) && (
              <li className="nav-item dropdown breadHeader">
                <div>
                  <NavLink
                    to="/roles"
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <span>Roles</span>
                  </NavLink>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink">
                    {listPermissions.includes(createRole) && (
                      <NavLink exact to="/roles/add" className="dropdown-item">
                        <span>Add Role</span>
                      </NavLink>
                    )}
                    {listPermissions.includes(readRole) && (
                      <NavLink exact to="/roles" className="dropdown-item">
                        <span>List Roles</span>
                      </NavLink>
                    )}
                  </div>
                </div>
              </li>
            )}

            {(listPermissions.includes(readClient) ||
              listPermissions.includes(readProject) ||
              listPermissions.includes(readResources) ||
              listPermissions.includes(readOneTimeSheet) ||
              listPermissions.includes(readPayRoll) ||
              listPermissions.includes(readOrgChart)) && (
              <li className="nav-item dropdown breadHeader">
                <div>
                  <NavLink
                    to="/company"
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <span>Company</span>
                  </NavLink>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink">
                    {listPermissions.includes(readClient) ? (
                      <NavLink
                        exact
                        to="/company/clients"
                        className="dropdown-item">
                        <span>Clients</span>
                      </NavLink>
                    ) : (
                      ''
                    )}
                    {listPermissions.includes(readProject) ? (
                      <NavLink
                        exact
                        to="/company/projects"
                        className="dropdown-item">
                        <span>Projects</span>
                      </NavLink>
                    ) : (
                      ''
                    )}
                    {listPermissions.includes(readResources) && (
                      <NavLink
                        exact
                        to={`/company/resources/${new Date().getFullYear()}`}
                        className="dropdown-item">
                        <span>Resources</span>
                      </NavLink>
                    )}
                    {listPermissions.includes(readOneTimeSheet) ? (
                      <NavLink
                        exact
                        to="/company/timesheets"
                        className="dropdown-item">
                        <span>Timesheets</span>
                      </NavLink>
                    ) : (
                      ''
                    )}
                    {listPermissions.includes(readOneTimeSheet) ? (
                      <NavLink
                        exact
                        to="/company/leaves"
                        className="dropdown-item">
                        <span>Leaves</span>
                      </NavLink>
                    ) : (
                      ''
                    )}
                    {listPermissions.includes(readPayRoll) ? (
                      <NavLink
                        exact
                        to="/company/payroll"
                        className="dropdown-item">
                        <span>Payroll</span>
                      </NavLink>
                    ) : (
                      ''
                    )}
                    {listPermissions.includes(readOrgChart) ? (
                      <NavLink
                        exact
                        to="/company/organization-chart"
                        className="dropdown-item">
                        <span>Organization Chart</span>
                      </NavLink>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
        <ul className="navbar-nav flex-row ml-md-auto d-md-flex">
          <PopoverNotifi />
          <PopoverProfile />
        </ul>
      </nav>
    );
  }
}

Header.propTypes = {
  minimized: PropTypes.bool,
  toggleSidebar: PropTypes.func,
};

const mapStateToProps = (state) => ({
  minimized: state.minimized,
});

function mapDispatchToProps(dispatch) {
  return {
    toggleSidebar: bindActionCreators(toggleSidebar, dispatch),
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
