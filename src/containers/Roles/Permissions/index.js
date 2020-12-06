// Import from node_module
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import PropTypes from 'prop-types';

// Import From File
import PermissionGroup from './PermissionGroup';
import APIcaller from './../../../utils/APIcaller';
import * as status from './../../../constants/response';
import * as constants from './../constants';
import { getItemLocalStore } from './../../../utils/handleLocalStore';
import { alertPopup } from './../../../utils/alertPopup';
import errorHandler from '../../../utils/handlerError';
import { constant } from '../../../constants/constant';
import { Redirect } from 'react-router-dom';
const { assignPermission } = constant.permissions;
class Permissions extends React.Component {
  constructor() {
    super();
    // SET YOUR DATA
    this.state = {
      loading: true,
      groupPermission: [],
      permissionsActive: [],
    };
  }

  componentWillMount() {
    const { headers, match, history } = this.props;
    if (!this.isAllow()) {
      history.push('/roles');
    }
    APIcaller('permissions-groups', 'GET', headers).then((res) => {
      const responseKey = get(res, `data.${constants.RESPONSE_KEY}`);
      const message = get(res, 'data.message');
      if (responseKey === status.getListSuccess) {
        if (get(match, 'params')) {
          APIcaller(
            `permissions-role?roleId=${match.params.id}`,
            'GET',
            headers
          ).then((result) => {
            const responseKey2 = get(res, `data.${constants.RESPONSE_KEY}`);
            const message1 = get(res, 'data.message');
            if (responseKey2 === status.getListSuccess) {
              this.setState({
                groupPermission: get(res, 'data.data', []),
                permissionsActive: get(result, 'data.data', []),
              });
            } else {
              alertPopup(constants.MESSAGE_FAILED, errorHandler(message1));
            }
          });
        } else {
          alertPopup(
            constants.MESSAGE_FAILED,
            'You have not role to fetch permission active !!!'
          );
        }
      } else {
        alertPopup(constants.MESSAGE_FAILED, errorHandler(message));
      }
    });
  }

  // OnCancel Event
  onCancel = () => {
    const { history } = this.props;
    history.push('/roles');
  };

  // OnSubmit Event
  onSubmit = () => {
    const { permissionsActive } = this.state;
    const { match, headers, history } = this.props;
    const data = {
      roleId: get(match, 'params.id'),
      rolePermissionsData: [...permissionsActive],
    };
    APIcaller('permissions-role', 'POST', headers, data).then((res) => {
      const responseKey = get(res, `data.${constants.RESPONSE_KEY}`);
      const message = get(res, 'data.message');
      if (responseKey === status.updateSuccess) {
        history.push('/roles');
      } else {
        alertPopup(constants.MESSAGE_FAILED, errorHandler(message));
      }
    });
  };

  // OnCheck Event
  onCheck = (permissionId) => {
    const { permissionsActive } = this.state;
    this.setState({
      permissionsActive: permissionsActive.map((per) => {
        if (per.id === Number(permissionId)) {
          per.isActive = per.isActive === 1 ? 0 : 1;
        }
        return per;
      }),
    });
  };

  // Check Permission
  checkPer = (permission) => {
    const { listPermissions } = this.props;
    return listPermissions && listPermissions.indexOf(permission) >= 0;
  };

  // Redirect Page
  isAllow = () =>
    this.checkPer(constants.PER_CREATE_ROLE) ||
    (this.checkPer(constants.PER_UPDATE_ROLE) &&
      get(this.props.match, 'params.rolename'));

  // Merge all permission with active
  mergePerGroupWithActive = (groupPermission = [], permissionsActive = []) => {
    if (groupPermission.length > 0 && permissionsActive.length > 0) {
      // for (let i = 0; i < groupPermission.length; i += 1) {
      //   for (let j = 0; j < groupPermission[i].permissions.length; j += 1) {
      //     const currentPermission = groupPermission[i].permissions[j];
      //     permissionsActive.forEach((element) => {
      //       if (currentPermission.id === element.id) {
      //         groupPermission[i].permissions[j].isActive = element.isActive;
      //       }
      //       element.permissionId = element.id;
      //     });
      //   }
      // }

      groupPermission = groupPermission.map((ele) => ({
        ...ele,
        permissions: ele.permissions.map((permis) => ({
          ...permis,
          isActive: get(
            permissionsActive.filter((permisActive) => {
              return permis.id === permisActive.id;
            })[0],
            'isActive'
          ),
        })),
      }));

      permissionsActive.map((ele) => ({ ...ele, permissionId: ele.id }));

      return groupPermission;
    }
    return [];
  };
  // Show Permission Group
  showPerGroup = (groupPermission) => {
    let result = <span>No data available</span>;
    // const userId = getItemLocalStore('userData.id');
    if (groupPermission.length > 0) {
      result = groupPermission.map((item) => {
        console.log(item);
        if (
          item.name === 'superAdmin' ||
          item.name === 'notification' ||
          item.name === 'account' ||
          item.name === 'useVariable'
        ) {
          return null;
        }
        return (
          <PermissionGroup
            key={`group-${item.id}`}
            id={item.id}
            name={item.label}
            permissions={item.permissions}
            onCheck={this.onCheck}
          />
        );
      });
    }
    return result;
  };

  render() {
    const { listPermissions } = this.props;
    const { groupPermission, permissionsActive } = this.state;
    const PerGroupWithActive = this.mergePerGroupWithActive(
      groupPermission,
      permissionsActive
    );
    return (
      <div className="container-fluid">
        {listPermissions.includes(assignPermission) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Edit Permissions</h3>
            </div>
            <section className="container-fluid pt-3 pb-5">
              {this.showPerGroup(PerGroupWithActive)}
              <div className="col-6 offset-4">
                <button
                  onClick={this.onSubmit}
                  className="btn btn-orange mr-3"
                  disabled={
                    get(PerGroupWithActive, 'length') > 0 ? null : true
                  }>
                  Save
                </button>
                <button onClick={this.onCancel} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </section>
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

Permissions.propTypes = {
  headers: PropTypes.shape({
    token: PropTypes.string.isRequired,
    accountid: PropTypes.number.isRequired,
  }),
  listPermissions: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = () => ({
  headers: {
    accountid: getItemLocalStore('accountid'),
    token: getItemLocalStore('token'),
  },
  listPermissions: getItemLocalStore('listPermissions'),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);
