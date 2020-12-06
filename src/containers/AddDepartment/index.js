import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { createDepartment } from './actions';
import './index.css';
import { endpoint } from '../../constants/config';

class AddDepartment extends React.Component {
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
    const { history } = this.props;
    this.props.createDepartment(this.state, (result) => {
      if (result) {
        history.push(`/${endpoint.department}`);
      }
    });
  };
  render() {
    const { name, description } = this.state;
    return (
      <div className="container-fluid">
        <div className="form-add card-border-orange bg-white position">
          <div className="card-header card-header-divider">Add Department</div>
          <div className="container mt-3">
            <div className="row">
              <div className="col-lg-12 personal-info">
                <form className="form-horizontal" onSubmit={this.onSave}>
                  <div className="row form-group mt-3">
                    <label
                      htmlFor="name"
                      className=" offset-md-1 col-md-2 col-form-label">
                      Name
                    </label>
                    <div className="col-md-8">
                      <input
                        id="name"
                        type="text"
                        className="form-control"
                        name="name"
                        value={name}
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="row form-group mt-3">
                    <label
                      htmlFor="description"
                      className="offset-md-1 col-md-2 col-form-label">
                      Decription
                    </label>
                    <div className="col-md-8">
                      <input
                        id="description"
                        type="text"
                        className="form-department"
                        name="description"
                        value={description}
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="row form-group mt-4">
                    <label className="offset-md-1 col-md-2 control-label"></label>
                    <div className="col-md-8">
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
  createDepartment: bindActionCreators(createDepartment, dispatch),
});
export default connect(null, mapDispatchToProps)(AddDepartment);
