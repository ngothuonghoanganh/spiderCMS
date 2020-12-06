// Import From NodeModule
import $ from 'jquery';
import React from 'react';
import 'datatables.net-bs4';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';

// Import From File
import './roles.css';
import RoleItem from './roleItem';
import * as constants from './constants';
import Loading from './../../components/Loading';
import { fetchRoles, deleteRole } from './actions';
import { confirmPopup, alertPopup } from './../../utils/alertPopup';
import { getItemLocalStore } from './../../utils/handleLocalStore';
import { constant } from '../../constants/constant';
const { readRole } = constant.permissions;
// Roles Component
class Roles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.dataTable = React.createRef();
  }

  // component Did Mount
  componentDidMount() {
    const { fetchRoles } = this.props;
    fetchRoles((callback, title, message) => {
      if (callback) {
        $(this.dataTable.current).DataTable({
          // Disable order, search of last column
          columnDefs: [
            { orderable: false, targets: [-1] },
            { searchable: false, targets: [-1] },
            { targets: [-1], width: '15%' },
            { width: '10%', targets: 0 },
            { width: '35%', targets: 1 },
            { width: '65%', targets: 2 },
            { width: '20%', targets: 3 },
          ],
          lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, 'All'],
          ],
        });
        this.setState({
          loading: false,
        });
      } else {
        alertPopup(title, message);
      }
    });
  }

  // Delete A Role
  onDeleteRole = (role) => {
    const { deleteRole } = this.props;
    confirmPopup('Confirm', 'Are you sure you want to delete this role?', () =>
      deleteRole(role, (title, message) => {
        alertPopup(title, message);
      })
    );
  };

  // Show Role list
  showItems = (roleItems) => {
    let result = null;
    const roleSpAdmin = 'superadmin';
    roleItems = roleItems.filter(({ rolename }) => rolename !== roleSpAdmin);
    if (get(roleItems, 'length', -1) > 0) {
      result = roleItems.map((role, index) => (
        <RoleItem
          key={index}
          role={role}
          index={index}
          onDeleteRole={
            this.checkPer(constants.PER_DELETE_ROLE) && this.onDeleteRole
          }
          onUpdateRole={this.checkPer(constants.PER_UPDATE_ROLE)}
          isSpadmin={this.checkPer(constants.PER_SP_ADMIN)}
        />
      ));
    }
    return result;
  };

  // Check Permission
  checkPer = (permission) => {
    const { listPermissions } = this.props;
    return listPermissions && listPermissions.indexOf(permission) >= 0;
  };

  render() {
    const { roles, listPermissions } = this.props;
    const { loading } = this.state;
    return (
      <div className="container-fluid">
        {listPermissions.includes(readRole) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Role Management</h3>
            </div>
            <div className="container-fluid mt-3">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
                {this.checkPer(constants.PER_CREATE_ROLE) && (
                  <Link to="/roles/add" className="btn btn-orange float-right">
                    Add
                  </Link>
                )}

                {loading && <Loading />}
              </div>

              <table
                ref={this.dataTable}
                cellSpacing="0"
                className="table table-responsive-md table-bordered table-hover bg-white">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Role Name</th>
                    <th>Description</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{this.showItems(roles)}</tbody>
              </table>
            </div>
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

Roles.propTypes = {
  listPermissions: PropTypes.array.isRequired,
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      rolename: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
  fetchRoles: PropTypes.func.isRequired,
  deleteRole: PropTypes.func,
};

const mapStateToProps = (state) => ({
  listPermissions: getItemLocalStore('listPermissions'),
  roles: state.roles,
});

const mapDispatchToProps = (dispatch) => ({
  fetchRoles: bindActionCreators(fetchRoles, dispatch),
  deleteRole: bindActionCreators(deleteRole, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Roles);
