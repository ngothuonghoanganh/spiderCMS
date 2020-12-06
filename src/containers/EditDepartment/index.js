import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { loadDepartment } from './../Department/helpers';
import { updateDepartment, deleteDepartment } from './actions';
import './index.css';
import { endpoint } from '../../constants/config';
import { alertPopup } from '../../utils/alertPopup';

class EditDepartment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
    };
  }
  componentWillMount() {
    const { match } = this.props;
    const id = get(match, 'params.id');
    this.props.loadDepartment((result, listDepartment) => {
      if (result) {
        listDepartment.forEach((item) => {
          if (item.id === Number(id)) {
            this.setState({
              name: item.name,
              description: item.description,
              departmentId: item.id,
            });
          }
        });
      }
    });
  }
  onChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
  };
  onSave = (e) => {
    e.preventDefault();
    const { history } = this.props;
    this.props.updateDepartment(
      this.state,
      (result, title = '', message = '') => {
        if (result) {
          history.push(`/${endpoint.department}`);
        } else {
          alertPopup(title, message);
        }
      }
    );
  };
  onDelete = (id) => {
    const { history } = this.props;
    if (window.confirm('Do you want to delete department? ')) {
      this.props.deleteDepartment(id, (result, title = '', message = '') => {
        if (result) {
          history.push(`/${endpoint.positions}`);
        } else {
          alertPopup(title, message);
        }
      });
    }
  };
  render() {
    const { name, description, departmentId } = this.state;
    return (
      <div className="container-fluid">
        <div className="form-add card-border-orange bg-white position">
          <div className="card-header card-header-divider">Edit Department</div>
          <div className="container mt-3">
            <div className="row">
              <div className="col-md-12 personal-info">
                <form
                  className="form-horizontal text-center"
                  onSubmit={this.onSave}>
                  <div className="row form-group mt-3">
                    <label className="col-md-3 col-sm-3 col-form-label">
                      Name
                    </label>
                    <div className="col-md-9 col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={name}
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="row form-group mt-3">
                    <label className="col-md-3 col-sm-3 col-form-label">
                      Decription
                    </label>
                    <div className="col-md-9 col-sm-9">
                      <input
                        type="text"
                        className="form-department"
                        name="description"
                        value={description}
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="row form-group mt-4">
                    <label className="col-md-3 col-sm-9 control-label"></label>
                    <div className="col-md-9 col-sm-12">
                      <button type="submit" className="btn btn-orange">
                        Save
                      </button>
                      <button
                        className="btn ml-1 btn-orange"
                        onClick={() => this.onDelete(departmentId)}>
                        Delete
                      </button>
                      <Link
                        className="btn btn-secondary ml-1"
                        to={`/${endpoint.department}`}>
                        Cancel
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadDepartment: bindActionCreators(loadDepartment, dispatch),
  updateDepartment: bindActionCreators(updateDepartment, dispatch),
  deleteDepartment: bindActionCreators(deleteDepartment, dispatch),
});

export default connect(null, mapDispatchToProps)(EditDepartment);
