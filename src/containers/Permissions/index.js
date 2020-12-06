import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Container } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './Permission.css';
import PermissionHOC from './PermisstionsHOC';
import PermissionItem from './PermissionItem';
import {
  actFetchPermissionsRequest,
  actDeletePermissionRequest,
} from './action';

class Permission extends React.Component {
  constructor(props) {
    super(props);
  }

  onDeleteItem = (id) => {
    if (window.confirm('Do you want to delete this permission???')) {
      // eslint-disable-line no-alert
      this.props.deletePermission(this.props.headers, id);
    }
  };

  showItems = (permissions) => {
    let result = null;
    if (permissions.length > 0) {
      result = permissions.map((permission, index) => (
        <PermissionItem
          key={index}
          permission={permission}
          index={index + 1}
          onDeleteItem={this.onDeleteItem}
        />
      ));
    }
    return result;
  };

  render() {
    const { permissions } = this.props;
    return (
      <Container>
        <Link to="/permissions/add">
          <Button className="btn-add btn btn-orange">
            <FontAwesomeIcon icon="plus-circle" />
            &nbsp;&nbsp;Add Permission
          </Button>
        </Link>
        <Table bordered hover responsive className="permissions">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{this.showItems(permissions)}</tbody>
        </Table>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  permissions: state.permissions,
  headers: {
    account_id: window.localStorage.getItem('id_account'),
    token: window.localStorage.getItem('id_token'),
  },
});

const mapDispatchToProps = (dispatch, props) => ({
  fetchAllPermissions: (headers) => {
    dispatch(actFetchPermissionsRequest(headers));
  },
  deletePermission: (headers, id) => {
    dispatch(actDeletePermissionRequest(headers, id));
  },
});

/** Props validation */
Permission.propTypes = {
  headers: PropTypes.object.isRequired,
  deletePermission: PropTypes.func.isRequired,
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PermissionHOC(Permission));
