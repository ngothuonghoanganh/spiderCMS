import React from 'react';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import Dropzone from 'react-dropzone';
import { Link, Redirect } from 'react-router-dom';
import { get, upperFirst } from 'lodash';
import { bindActionCreators } from 'redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { connect } from 'react-redux';
import { loadData, updateEProfile } from './actions';
import { loadPosition } from '../Department/helpers';
import { uploadImage } from '../../containers/AddEmployee/helpers';
import './index.css';
import { endpoint } from './../../constants/config';
import Loading from '../../components/Loading';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { alertPopup } from '../../utils/alertPopup';
class EditEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUpload: null,
      avatar: '',
      loading: false,
      roleAdmin: false,
      roleUser: false,
      roles: [],
      firstName: '',
      lastName: '',
      email: '',
      skype: '',
      phone: '',
      birthday: null,
      startDate: null,
      endDate: null,
    };

    this.dataTableTimesheet = React.createRef();
  }
  componentDidMount() {
    const { match } = this.props;
    const id = get(match, 'params.id');
    this.props.loadData(id, (result, title = '', message = '') => {
      if (!result) {
        alertPopup(title, message);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const data = get(nextProps, 'loadProfileData', '');
    if (data) {
      this.setState({
        ...data,
        selectValue: upperFirst(data.maritalStatus),
        birthday: get(data, 'birthday') ? moment(data.birthday) : null,
        startDate: get(data, 'startDate') ? moment(data.startDate) : null,
        endDate: get(data, 'endDate') ? moment(data.endDate) : null,
        urlImageTemp: `avatar/${data.avatar}`,
      });
    }
  }
  onChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
  };
  onImageDrop = (files) => {
    this.setState({
      fileUpload: files[0],
      loading: true,
    });
    this.handleImageUpload(files[0]);
  };
  onSave = (e) => {
    e.preventDefault();
    const { birthday, startDate, endDate } = this.state;
    const checkCondition =
      this.checkAge(birthday) &&
      !(endDate <= startDate && endDate) &&
      moment(startDate).year() - moment(birthday).year() > 18;
    if (checkCondition) {
      const { match } = this.props;
      const profileId = get(match, 'params.id');
      this.props.updateEProfile(
        profileId,
        this.state,
        (result, title = '', message = '') => {
          const { history } = this.props;
          if (result) {
            history.push(
              `/${endpoint.employees}/${endpoint.view}/${match.params.id}`
            );
          } else {
            alertPopup(title, message);
          }
        }
      );
    }
  };
  handleImageUpload = (files) => {
    const { uploadImage } = this.props;
    uploadImage(files, (result, url) => {
      if (result) {
        const temp = `temp/${url}`;
        this.setState({
          avatar: url,
          loading: false,
          urlImageTemp: temp,
        });
      }
    });
  };
  checkAge = (date) => {
    const currentYear = new Date().getFullYear();
    return currentYear - moment(date).year() > 18;
  };
  handleChangeSpecialInput = (name, value) => {
    this.setState({
      [name]: value,
    });
  };
  updateValue = (newValue) => {
    this.setState({
      selectValue: newValue,
      maritalStatus: newValue,
    });
  };
  render() {
    const {
      firstName,
      lastName,
      email,
      skype,
      phone,
      gender,
      startDate,
      endDate,
      birthday,
      avatar,
      urlImageTemp,
      loading,
    } = this.state;
    const listPermission = getItemLocalStore('listPermissions');
    const current = new Date();
    if (
      // listPermission.includes('updateUser') ||
      listPermission.includes('updateEmployee')
    ) {
      return (
        <div className="container-fluid">
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Edit Information</h3>
              <span className="card-subtitle">
                Please fill out the form below completely
              </span>
            </div>
            <div className="wrap-form">
              <div className="row">
                <div className="col-lg-4">
                  <Dropzone
                    className="dropzone-user"
                    onDrop={this.onImageDrop}
                    accept="image/*">
                    <span className="clickUp">Click to upload.</span>
                    {loading && <Loading />}
                    <img
                      alt=""
                      src={`${!avatar ? '#' : endpoint.url}/${
                        endpoint.image
                      }/${urlImageTemp}`}
                      className={!avatar ? 'hidden' : 'showimg'}
                    />
                  </Dropzone>
                </div>
                <div className="col-lg-8 personal-info">
                  <form className="form-horizontal" onSubmit={this.onSave}>
                    <div className="row form-group mt-3">
                      <label
                        htmlFor="firstName"
                        className="col-md-4 col-form-label">
                        First Name<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          id="firstName"
                          type="text"
                          required
                          className="form-control"
                          placeholder="Fist Name"
                          name="firstName"
                          value={firstName}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row form-group mt-3">
                      <label
                        htmlFor="lastName"
                        className="col-md-4 col-form-label">
                        Last Name<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          id="lastName"
                          type="text"
                          required
                          className="form-control"
                          placeholder="Last Name"
                          name="lastName"
                          value={lastName}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <label
                        htmlFor="email"
                        className="col-md-4 col-form-label">
                        Email<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          id="email"
                          type="email"
                          required
                          className="form-control"
                          name="email"
                          value={email}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <label
                        htmlFor="inputSkypeID"
                        className="col-md-4 col-form-label">
                        Skype<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          type="text"
                          required
                          className="form-control"
                          id="inputSkypeID"
                          placeholder="name.spider"
                          name="skype"
                          value={skype}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-md-4 col-form-label">
                        Gender<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8 pt-2">
                        <div className="form-check form-check-inline">
                          <label className="form-check-label form-check-label ">
                            <input
                              required
                              type="radio"
                              id="inline-radio1"
                              checked={gender === 'male' ? 'checked' : ''}
                              onChange={this.onChange}
                              name="gender"
                              className="form-check-input form-check-input"
                              value="male"
                            />
                            Male
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <label className="form-check-label form-check-label ">
                            <input
                              required
                              type="radio"
                              id="inline-radio2"
                              checked={gender === 'female' ? 'checked' : ''}
                              onChange={this.onChange}
                              name="gender"
                              className="form-check-input form-check-input"
                              value="female"
                            />
                            Female
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-md-4 col-form-label">
                        {' '}
                        Marital status
                      </label>
                      <div className="col-md-8 pt-2">
                        <div className="button-group">
                          <VirtualizedSelect
                            options={[{ name: 'Married' }, { name: 'Single' }]}
                            name="select-marital"
                            value={this.state.selectValue}
                            onChange={this.updateValue}
                            labelKey="name"
                            valueKey="name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-md-4 col-form-label">
                        Birthday<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-3">
                        <DatePicker
                          required
                          className="form-control"
                          selected={birthday}
                          onChange={(date) =>
                            this.handleChangeSpecialInput('birthday', date)
                          }
                          dateFormat="DD/MM/YYYY"
                          showYearDropdown
                          dateFormatCalendar="MMMM"
                          scrollableYearDropdown
                          yearDropdownItemNumber={35}
                        />
                        {!this.checkAge(birthday) && birthday ? (
                          <small className="text-danger">
                            age should be greater than 18
                          </small>
                        ) : (
                          ''
                        )}
                      </div>
                      <label className="col-md-2 col-form-label">
                        Phone<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-3">
                        <input
                          type="number"
                          required
                          className="form-control"
                          id="inputPhone"
                          placeholder="Phone"
                          name="phone"
                          value={phone}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-md-4 col-form-label form-control-label ">
                        Joining Date<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-3">
                        <DatePicker
                          className="form-control"
                          required
                          maxDate={moment(current)}
                          selected={startDate}
                          onChange={(date) =>
                            this.handleChangeSpecialInput('startDate', date)
                          }
                          dateFormat="DD/MM/YYYY"
                          showYearDropdown
                          dateFormatCalendar="MMMM"
                          scrollableYearDropdown
                          yearDropdownItemNumber={35}
                        />
                      </div>
                      <label className="col-md-2 col-form-label form-control-label ">
                        Left Date{' '}
                      </label>
                      <div className="col-md-3">
                        <DatePicker
                          className="form-control"
                          format={null}
                          selected={endDate}
                          onChange={(date) =>
                            this.handleChangeSpecialInput('endDate', date)
                          }
                          dateFormat="DD/MM/YYYY"
                          showYearDropdown
                          dateFormatCalendar="MMMM"
                          scrollableYearDropdown
                          yearDropdownItemNumber={35}
                        />
                        {endDate <= startDate && endDate && startDate ? (
                          <small className="text-danger">
                            left date should be greater than joining date
                          </small>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="row form-group mt-4">
                      <label className="col-md-4 control-label"></label>
                      <div className="col-md-8">
                        <button type="submit" className="btn btn-orange">
                          Save
                        </button>
                        <Link
                          className="btn btn-secondary ml-3"
                          to={`/${endpoint.employees}`}>
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
    return <Redirect to="/" />;
  }
}
EditEmployee.defaultProps = {
  loadData: null,
  promoteEmployee: null,
};
const mapStateToProps = (state) => ({
  loadProfileData: state.profileResult.data,
  listPosition: state.positionData.positions,
});
const mapDispatchToProps = (dispatch) => ({
  loadData: bindActionCreators(loadData, dispatch),
  uploadImage: bindActionCreators(uploadImage, dispatch),
  loadPosition: bindActionCreators(loadPosition, dispatch),
  updateEProfile: bindActionCreators(updateEProfile, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(EditEmployee);
