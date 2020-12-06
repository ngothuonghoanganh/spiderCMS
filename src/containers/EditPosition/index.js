import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { loadPositionData, updatePosition } from './actions';
import './index.css';
import { endpoint } from '../../constants/config';
import { alertPopup } from '../../utils/alertPopup';

class EditPosition extends React.Component {
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
    this.props.loadPositionData(id, (result, positionData) => {
      this.setState({
        name: positionData.name,
        key: positionData.key,
        description: positionData.description,
        level: positionData.level,
      });
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
    const { match, history } = this.props;
    const id = get(match, 'params.id');
    this.props.updatePosition(
      id,
      this.state,
      (result, title = '', message = '') => {
        if (result) {
          history.push(`/${endpoint.positions}`);
        } else {
          alertPopup(title, message);
        }
      }
    );
  };
  render() {
    const { name, description, key, level } = this.state;
    return (
      <div className="container-fluid">
        <div className="form-add card-border-orange bg-white position">
          <div className="card-header card-header-divider">
            <h3>Edit Position</h3>
            <span className="card-subtitle">
              Please fill out the form below completely
            </span>
          </div>
          <div className="container mt-3">
            <div className="row">
              <div className="col-lg-8"></div>
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
                    <div className="col-md-8">
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
                      className="offset-md-1 col-md-2 col-form-label">
                      Level
                    </label>
                    <div className="col-md-8">
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
                      className="offset-md-1 col-md-2 col-form-label">
                      Decription
                    </label>
                    <div className="col-md-8">
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
                    <div className="col-md-8">
                      <button type="submit" className="btn btn-orange">
                        Save
                      </button>
                      <Link
                        className="btn btn-secondary ml-1"
                        to={`/${endpoint.positions}`}>
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
  loadPositionData: bindActionCreators(loadPositionData, dispatch),
  updatePosition: bindActionCreators(updatePosition, dispatch),
});
export default connect(null, mapDispatchToProps)(EditPosition);
