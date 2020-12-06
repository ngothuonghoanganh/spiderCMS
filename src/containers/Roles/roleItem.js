/** @format */

// Import From NodeModule
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Import from file
import './roles.css';
import * as constants from './constants';
// Roles Component
class RolesItem extends React.Component {
  // Show Button Controls
  showControls = (role, onUpdateRole, onDeleteRole, isSpadmin) => {
    if (onUpdateRole || onDeleteRole) {
      return (
        <div className="btn-group">
          <button
            className="btn btn-orange dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            disabled={role.id < 2 && !isSpadmin}>
            Action
          </button>
          <div className="dropdown-menu dropdown-menu-right">
            {onUpdateRole && (
              <Link
                className="dropdown-item"
                to={`/roles/${role.id}/permissions/edit`}>
                Edit Permission
              </Link>
            )}
            {onUpdateRole && (
              <Link
                className="dropdown-item"
                to={`/roles/${role.rolename}/edit-role`}>
                Edit Role
              </Link>
            )}
            {onDeleteRole && !role.isUsing && role.id !== constants.SPADMIN_ID && (
              <span
                className="dropdown-item"
                onClick={() => {
                  onDeleteRole(role);
                }}>
                Delete Role
              </span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  render() {
    const { index, role, onUpdateRole, onDeleteRole, isSpadmin } = this.props;
    const { label, description } = role;
    return (
      <tr>
        <td>{index + 1}</td>
        <td>{label}</td>
        <td>{description}</td>
        <td>
          {this.showControls(role, onUpdateRole, onDeleteRole, isSpadmin)}
        </td>
      </tr>
    );
  }
}

RolesItem.propTypes = {
  role: PropTypes.shape({
    label: PropTypes.string,
    rolename: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onDeleteRole: PropTypes.func,
  index: PropTypes.number.isRequired,
  onUpdateRole: PropTypes.bool.isRequired,
  isSpadmin: PropTypes.bool.isRequired,
};

export default RolesItem;
