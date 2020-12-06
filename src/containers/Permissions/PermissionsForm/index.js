import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, Col } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  actAddPermissionRequest,
  actUpdatePermissionRequest,
  actGetEditPermissionRequest,
} from './../action';
import './PermissionForm.css';

class PermissionsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      permission_id: '',
      name: '',
      description: '',
    };
    if (props.match && props.match.params.id) {
      props.getEditPermission(props.headers, props.match.params.id);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps && nextProps.match) {
      const { permissions } = nextProps;
      if (permissions && permissions.length > 0) {
        return {
          permission_id: permissions[0].id,
          ...permissions[0],
        };
      }
    }
    return {
      id: '',
      permission_id: '',
      name: '',
      description: '',
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { history, headers, updatePermission, addPermission } = this.props;
    const { id } = this.state;
    if (id !== '') {
      updatePermission(headers, this.state);
    } else {
      addPermission(headers, this.state);
    }
    history.goBack();
  };

  onChangeInput = ({ target }) => {
    const { name } = target;
    const value = name === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { name, description } = this.state;
    return (
      <div className="container-fluid">
        <h2 className="text-center per-title">
          Permission Form
          <br />
          <small>Create Form</small>
        </h2>
        <div className="offset-1 col-10">
          <Form onSubmit={this.onSubmit}>
            <FormGroup row>
              <Label for="permission-name" sm={2}>
                Permission Name:
              </Label>
              <Col sm={10}>
                <Input
                  required
                  type="text"
                  name="name"
                  id="permission-name"
                  placeholder="Permission Name"
                  value={name}
                  onChange={this.onChangeInput}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="description-desc" sm={2}>
                Description:
              </Label>
              <Col sm={10}>
                <Input
                  required
                  type="textarea"
                  name="description"
                  id="permission-desc"
                  placeholder="Description"
                  value={description}
                  onChange={this.onChangeInput}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={{ size: 10, offset: 2 }}>
                <Button className="btn btn-orange">
                  <FontAwesomeIcon icon="arrow-circle-up" /> Submit
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Link to="/permissions">
                  <Button type="reset" className="btn btn-orange">
                    <FontAwesomeIcon icon="times-circle" /> Cancel
                  </Button>
                </Link>
              </Col>
            </FormGroup>
          </Form>
        </div>
      </div>
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
  getEditPermission: (headers, id) => {
    dispatch(actGetEditPermissionRequest(headers, id));
  },
  addPermission: (headers, permission) => {
    dispatch(actAddPermissionRequest(headers, permission));
  },
  updatePermission: (headers, permission) => {
    dispatch(actUpdatePermissionRequest(headers, permission));
  },
});

/** Props validation */
PermissionsForm.propTypes = {
  history: PropTypes.object.isRequired,
  headers: PropTypes.object.isRequired,
  getEditPermission: PropTypes.func.isRequired,
  updatePermission: PropTypes.func.isRequired,
  addPermission: PropTypes.func.isRequired,
  match: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsForm);
