import React from 'react';
import Dropzone from 'react-dropzone';
import DatePicker from 'react-datepicker';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addProfile, uploadImage } from './helpers';
import { loadPosition, loadDepartment } from '../Department/helpers';
import { alertPopup } from '../../utils/alertPopup';
import './index.css';
import { endpoint } from '../../constants/config';
import Loading from '../../components/Loading';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

class AddEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listDepartment: [],
      fileUpload: null,
      avatar: '',
      loading: false,
      firstName: '',
      lastName: '',
      email: '',
      skype: '',
      phone: '',
      birthday: null,
      startDate: null,
      listPosition: [],
      selectValueDepartment: null,
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

  checkAge = (date) => {
    const currentYear = new Date().getFullYear();
    return currentYear - moment(date).year() > 18;
  };

  onImageDrop = (files) => {
    this.setState({
      fileUpload: files[0],
      loading: true,
    });
    this.props.uploadImage(files[0], (result, url) => {
      if (result) {
        this.setState({
          avatar: url,
          loading: false,
        });
      }
    });
  };

  onSubmitForm = (e) => {
    e.preventDefault();
    const { birthday, startDate } = this.state;
    if (
      this.checkAge(birthday) &&
      moment(startDate).year() - moment(birthday).year() > 18
    ) {
      this.setState({
        loading: true,
      });
      const { history, addProfile } = this.props;
      addProfile(this.state, (result, data) => {
        if (result) {
          history.push(`/${endpoint.employees}/${endpoint.view}/${data.id}`);
        } else {
          alertPopup('FAILED!!!!', data);
        }
      });
      this.setState({ loading: false });
    }
  };

  onReset = (e) => {
    e.preventDefault();
    this.setState({
      firstName: '',
      lastName: '',
      email: '',
      skype: '',
      phone: '',
      gender: '',
      startDate: '',
      birthday: '',
      avatar: '',
    });
  };

  handleChangeDate = (date, name) => {
    this.setState({
      [name]: date,
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
      startDate,
      birthday,
      avatar,
      loading,
    } = this.state;
    const current = new Date();
    const listPermission = getItemLocalStore('listPermissions');
    if (listPermission.includes('createEmployee')) {
      return (
        <div className="container-fluid">
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Employee Information</h3>
              <span className="card-subtitle">
                Please fill out the form below completely
              </span>
            </div>
            <div className="wrap-form mt-4">
              <div className="row">
                <div className="col-lg-4">
                  <Dropzone
                    className="dropzone-user"
                    onDrop={this.onImageDrop}
                    accept="image/jpeg,image/jpg,image/tiff,image/gif">
                    <span className="clickUp">Click to upload.</span>
                    {loading && <Loading />}
                    <img
                      alt=""
                      src={`${
                        avatar === '' || avatar === null ? '#' : endpoint.url
                      }/${endpoint.imageTemp}/${avatar}`}
                      className={avatar === '' ? 'hidden' : 'showimg'}
                    />
                  </Dropzone>
                </div>
                <div className="col-lg-8 personal-info">
                  <form
                    className="form-horizontal"
                    onSubmit={this.onSubmitForm}>
                    <div className="row form-group">
                      <label
                        htmlFor="firstname"
                        className="col-md-4 col-form-label">
                        First Name<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          id="firstname"
                          required
                          type="text"
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
                        htmlFor="lastname"
                        className="col-md-4 col-form-label ">
                        Last Name<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          id="lastname"
                          required
                          type="text"
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
                        htmlFor="inputemail"
                        className="col-md-4 col-form-label ">
                        Email <strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          required
                          className="form-control"
                          id="inputemail"
                          name="email"
                          placeholder="test@spider.vn"
                          value={email}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <label
                        htmlFor="inputSkypeID"
                        className="col-md-4 col-form-label ">
                        Skype <strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          required
                          type="text"
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
                      <label className="col-md-4 col-form-label ">
                        Gender<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8 pt-2">
                        <div className="form-check form-check-inline">
                          <label className="form-check-label form-check-label ">
                            <input
                              required
                              type="radio"
                              id="inline-radio1"
                              value="male"
                              onChange={this.onChange}
                              name="gender"
                              className="form-check-input form-check-input"
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
                              value="female"
                              onChange={this.onChange}
                              name="gender"
                              className="form-check-input form-check-input"
                            />
                            Female
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-md-4 col-form-label">
                        Marital status
                      </label>
                      <div className="col-md-8 pt-2">
                        <div className="button-group">
                          <VirtualizedSelect
                            options={[{ name: 'Married' }, { name: 'Single' }]}
                            simpleValue
                            name="select-city"
                            placeholder="Marital status"
                            value={this.state.selectValue}
                            onChange={this.updateValue}
                            searchable
                            labelKey="name"
                            valueKey="name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-md-4 col-form-label ">
                        Birthday<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-3">
                        <DatePicker
                          required
                          className="form-control"
                          placeholderText="Birthday"
                          selected={birthday}
                          onChange={(date) =>
                            this.handleChangeDate(date, 'birthday')
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
                      <label
                        htmlFor="inputPhone"
                        className="col-md-2 col-form-label ">
                        Phone<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-3">
                        <input
                          required
                          type="number"
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
                      <div className="col-md-8 mb-3 mb-sm-0">
                        <DatePicker
                          required
                          maxDate={moment(current)}
                          className="form-control"
                          placeholderText="Joining Date"
                          selected={startDate}
                          onChange={(date) =>
                            this.handleChangeDate(date, 'startDate')
                          }
                          dateFormat="DD/MM/YYYY"
                          showYearDropdown
                          dateFormatCalendar="MMMM"
                          scrollableYearDropdown
                          yearDropdownItemNumber={35}
                        />
                      </div>
                    </div>
                    <div className="row form-group mt-4">
                      <label className="col-md-4 control-label"></label>
                      <div className="col-md-8">
                        <button type="submit" className="btn btn-orange mr-3">
                          Save
                        </button>
                        <button
                          type="reset"
                          onClick={this.onReset}
                          className="btn btn-secondary">
                          Cancel
                        </button>
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
AddEmployee.defaultProps = {
  loadPosition: null,
};
const mapStateToProps = (state) => ({
  listPosition: state.positionData.positions,
});
const mapDispatchToProps = (dispatch) => ({
  addProfile: bindActionCreators(addProfile, dispatch),
  uploadImage: bindActionCreators(uploadImage, dispatch),
  loadDepartment: bindActionCreators(loadDepartment, dispatch),
  loadPosition: bindActionCreators(loadPosition, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddEmployee);
