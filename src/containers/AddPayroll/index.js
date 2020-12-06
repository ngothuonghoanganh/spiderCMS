import React from 'react';
import * as responses from '../../constants/response';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import { get } from 'lodash';
import { Link, Redirect } from 'react-router-dom';
import APIcaller from '../../utils/APIcaller';
import { alertPopup } from '../../utils/alertPopup';
import './index.css';
import { endpoint } from '../../constants/config';
import errorHandler from '../../utils/handlerError';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { constant } from '../../constants/constant';
const { createPayRoll } = constant.permissions;
const d = new Date();
const m = d.getMonth() + 1;
const y = d.getFullYear();

class AddPayroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listProfileId: [],
      basicSalary: '',
      bonus: '',
      mealAllowance: '',
      conveyanceAllowance: '',
      month: m,
      year: y,
      advancePayment: '',
    };
  }

  componentDidMount() {
    APIcaller(`${endpoint.profiles}`, 'GET', {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    }).then((res) => {
      const message = get(res, 'data.responseKey');
      const listProfile = res.data.data;
      const listProfileId = listProfile.map(({ id, firstName, lastName }) => ({
        id,
        name: `${firstName ? firstName : ''} ${lastName ? lastName : ''}`,
      }));
      console.log(listProfileId);
      if (message === responses.getListSuccess) {
        this.setState({
          listProfileId,
        });
      } else {
        alertPopup('FAILD!!!!', errorHandler(message));
      }
    });
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value }, () => {
      console.log(this.state.selectedProfileId);
    });
  };

  onChange = (e) => {
    const { name, type, value } = e.target;
    if (type !== 'checkbox') {
      this.setState({
        [name]: value,
      });
    }
  };

  onSave = (e) => {
    e.preventDefault();
    const {
      basicSalary,
      bonus,
      mealAllowance,
      conveyanceAllowance,
      advancePayment,
    } = this.state;
    const { history } = this.props;
    const month = history.location.state.month;
    const year = history.location.state.year;
    const workDayPerMonth = history.location.state.workDayPerMonth;
    const profileId = this.state.selectedProfileId;
    APIcaller(
      `${endpoint.payrolls}?profileId=${profileId}`,
      'POST',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      },
      {
        basicSalary,
        bonus,
        mealAllowance,
        conveyanceAllowance,
        workDayPerMonth,
        month,
        year,
        advancePayment,
      }
    ).then((res) => {
      const message = get(res, 'data.responseKey');
      if (message === responses.insertSuccess) {
        history.push(`/${endpoint.payroll}`, { month: month, year: year });
      } else {
        alertPopup('FAILED!!!!', errorHandler(message));
      }
    });
  };

  render() {
    const {
      listProfileId,
      selectedProfileId,
      basicSalary,
      bonus,
      mealAllowance,
      conveyanceAllowance,
      advancePayment,
    } = this.state;
    const { history } = this.props;

    const month = history.location.state.month;
    const year = history.location.state.year;
    const listPermission = getItemLocalStore('listPermissions');
    return (
      <div className="container-fluid">
        {listPermission.includes(createPayRoll) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Payroll Information</h3>
              <span className="card-subtitle">
                Please fill out the form below completely
              </span>
            </div>
            <div className="wrap-form pt-3 pb-5">
              <form className="form-horizontal" onSubmit={this.onSave}>
                <div className="row form-group">
                  <label
                    htmlFor="salary"
                    className="col-4 col-md-2 col-form-label payroll-form-label">
                    Employee Name:<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <VirtualizedSelect
                      required
                      options={listProfileId}
                      simpleValue
                      onChange={(value) => {
                        this.handleChange('selectedProfileId', value);
                      }}
                      value={selectedProfileId}
                      labelKey="name"
                      valueKey="id"
                      placeholder="Employee Name"
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="basicSalary"
                    className="col-4 col-md-2 col-form-label payroll-form-label">
                    Basic Salary:<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <input
                      type="number"
                      min="0"
                      max="99999999"
                      placeholder="Basic Salary"
                      className="form-control"
                      id="basicSalary"
                      name="basicSalary"
                      value={basicSalary}
                      onChange={this.onChange}
                      required
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="bonus"
                    className="col-4 col-md-2 col-form-label payroll-form-label"
                    placeholder="Bonus">
                    Bonus:
                  </label>
                  <div className="col-md-8">
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      id="bonus"
                      placeholder="Bonus"
                      name="bonus"
                      value={bonus}
                      onChange={this.onChange}
                    />
                  </div>
                </div>

                <div className="row form-group">
                  <label
                    htmlFor="mealAllowance"
                    className="col-4 col-md-2 col-form-label payroll-form-label">
                    Meal Allowance:
                  </label>
                  <div className="col-md-8">
                    <input
                      id="mealAllowance"
                      type="number"
                      min="0"
                      placeholder="Meal Allowance"
                      className="form-control"
                      name="mealAllowance"
                      value={mealAllowance}
                      onChange={this.onChange}
                      title="8 characters minimum"
                      pattern=".{8,}"
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="conveyanceAllowance"
                    className="col-4 col-md-2 col-form-label payroll-form-label">
                    Conveyance Allowance:
                  </label>
                  <div className="col-md-8">
                    <input
                      id="conveyanceAllowance"
                      type="number"
                      min="0"
                      placeholder="Conveyance Allowance"
                      className="form-control"
                      name="conveyanceAllowance"
                      value={conveyanceAllowance}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="workDayPerMonth"
                    className="col-4 col-md-2 col-form-label payroll-form-label">
                    Work Days per Month:
                  </label>
                  <div className="col-md-8">
                    <input
                      type="number"
                      disabled
                      className="form-control"
                      id="workDayPerMonth"
                      name="workDayPerMonth"
                      value={history.location.state.workDayPerMonth}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="advancePayment"
                    className="col-4 col-md-2 col-form-label payroll-form-label">
                    Advance Payment:
                  </label>
                  <div className="col-md-8">
                    <input
                      type="number"
                      min="0"
                      placeholder="Advance Payment"
                      className="form-control"
                      id="advancePayment"
                      name="advancePayment"
                      value={advancePayment}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-4 col-md-2 col-fake-label"></div>
                  <div className="col-md-8">
                    <button
                      type="submit"
                      className="btn btn-orange"
                      // onClick={this.onSave}
                      // to={{
                      //   pathname: `/${endpoint.payroll}`,
                      //   state: { month: month, year: year },
                      // }}
                    >
                      Save
                    </button>
                    <Link
                      className="btn btn-secondary ml-3"
                      to={{
                        pathname: `/${endpoint.payroll}`,
                        state: { month: month, year: year },
                      }}>
                      Cancel
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

export default AddPayroll;
