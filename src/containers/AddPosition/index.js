import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { createPosition } from './actions';
import './index.css';
import { endpoint } from '../../constants/config';
import { alertPopup } from '../../utils/alertPopup';

class AddPosition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
    };
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
    const { match, history } = this.props;
    const departmentId = get(match, 'params.id');
    this.props.createPosition(
      departmentId,
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
  render() {
    const { name, description, level, key } = this.state;
    return (
      <div className="container-fluid">
        <div className="form-add card-border-orange bg-white position">
          <div className="card-header card-header-divider">
            <h3>Add Position</h3>
          </div>
          <div className="container mt-3">
            <div className="row">
              <div className="col-md-12 personal-info">
                <form
                  className="form-horizontal text-center"
                  onSubmit={this.onSave}>
                  <div className="row form-group mt-3">
                    <label
                      htmlFor="name"
                      className="offset-md-1 col-md-2 col-sm-3 col-form-label">
                      Name
                    </label>
                    <div className="col-md-9 col-sm-9">
                      <input
                        id="name"
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="row form-group mt-3">
                    <label
                      htmlFor="key"
                      className="offset-md-1 col-md-2 col-form-label">
                      Key
                    </label>
                    <div className="col-md-9">
                      <input
                        id="key"
                        type="text"
                        className="form-control"
                        placeholder="Key"
                        name="key"
                        value={key}
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="row form-group mt-3">
                    <label
                      htmlFor="level"
                      className="offset-md-1 col-md-2 col-sm-3 col-form-label">
                      Level
                    </label>
                    <div className="col-md-9 col-sm-9">
                      <input
                        id="level"
                        type="number"
                        className="form-control"
                        placeholder="Level"
                        name="level"
                        value={level}
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="row form-group mt-3">
                    <label
                      htmlFor="description"
                      className="offset-md-1 col-md-2 col-sm-3 col-form-label">
                      Decription
                    </label>
                    <div className="col-md-9 col-sm-9">
                      <input
                        id="description"
                        type="text"
                        className="form-department"
                        placeholder="Description"
                        name="description"
                        value={description}
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="row form-group mt-4">
                    <label className="col-md-3 control-label"></label>
                    <div className="col-md-9">
                      <button type="submit" className="btn btn-orange">
                        {' '}
                        Save
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
  createPosition: bindActionCreators(createPosition, dispatch),
});
export default connect(null, mapDispatchToProps)(AddPosition);
