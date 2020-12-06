import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { endpoint } from '../../constants/config';
import './index.css';
// import Loading from '../../components/Loading';
import { actGetPayrollRequest, actUpdatePayrollRequest } from './actions';
import { constant } from '../../constants/constant';
import { getItemLocalStore } from '../../utils/handleLocalStore';
const { updatePayRoll } = constant.permissions;
class EditPayroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      basicSalary: '',
      bonus: '',
      mealAllowance: '',
      conveyanceAllowance: '',
      workDayPerMonth: '',
      month: '',
      year: '',
      advancePayment: '',
    };
  }

  componentDidMount = () => {
    const { match, onGetPayroll } = this.props;
    const id = match.params.id;

    if (id) {
      console.log('a');
      onGetPayroll(id);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.payrollUpdating) {
      const { payrollUpdating } = nextProps;
      const payRoll = payrollUpdating.payRoll;
      this.setState({
        fullName: payrollUpdating.firstName + ' ' + payrollUpdating.lastName,
        basicSalary: payRoll.salary.basicSalary,
        bonus: payRoll.benefit.bonus,
        mealAllowance: payRoll.benefit.mealAllowance,
        conveyanceAllowance: payRoll.benefit.conveyanceAllowance,
        workDayPerMonth: payrollUpdating.workDayPerMonth,
        month: payrollUpdating.month,
        year: payrollUpdating.year,
        advancePayment: payRoll.advancePayment,
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

  onSave = (e) => {
    e.preventDefault();

    const {
      basicSalary,
      bonus,
      mealAllowance,
      conveyanceAllowance,
      month,
      year,
      advancePayment,
    } = this.state;
    const workDayPerMonth = this.getWeekdaysInMonth(month, year);
    const id = this.props.payrollUpdating.profileId;
    const { history, onUpdatePayroll } = this.props;
    const payroll = {
      basicSalary,
      bonus,
      mealAllowance,
      conveyanceAllowance,
      workDayPerMonth,
      advancePayment,
    };
    onUpdatePayroll(id, month, year, payroll, () => {
      history.push(`/${endpoint.payroll}`, { month: month, year: year });
    });
  };

  daysInMonth = () => {
    const { month, year } = this.state;
    return new Date(year, month, 0).getDate();
  };

  isWeekday = (year, month, day) => {
    var date = new Date(`${month} ${day}, ${year}`).getDay();
    return date !== 0 && date !== 6;
  };

  getWeekdaysInMonth = (month, year) => {
    var days = this.daysInMonth();
    var weekdays = 0;
    for (var i = 0; i < days; i++) {
      if (this.isWeekday(year, month, i + 1)) weekdays++;
    }
    return weekdays;
  };

  render() {
    const {
      fullName,
      basicSalary,
      bonus,
      mealAllowance,
      conveyanceAllowance,
      month,
      year,
      advancePayment,
    } = this.state;

    const workDayPerMonth = this.getWeekdaysInMonth(month, year);

    const listPermission = getItemLocalStore('listPermissions');
    return (
      <div className="container-fluid">
        {listPermission.includes(updatePayRoll) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Edit Information</h3>
              <span className="card-subtitle">
                Please fill out the form below completely
              </span>
            </div>
            <div className="wrap-form pt-3 pb-5">
              <form className="form-horizontal" onSubmit={this.onSave}>
                <div className="row form-group">
                  <label
                    htmlFor="basicSalary"
                    className="col-4 col-md-2 col-form-label payroll-form-label">
                    Employee Name:<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={fullName}
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="basicSalary"
                    className="col-4 col-md-2 col-form-label payroll-form-label ">
                    Basic Salary:<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <input
                      type="number"
                      min="0"
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
                    htmlFor="mealAllowance"
                    className="col-4 col-md-2 col-form-label payroll-form-label ">
                    Meal Allowance:
                  </label>
                  <div className="col-md-8">
                    <input
                      id="mealAllowance"
                      required
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
                    className="col-4 col-md-2 col-form-label payroll-form-label ">
                    Conveyance Allowance:
                  </label>
                  <div className="col-md-8">
                    <input
                      required
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
                    className="col-4 col-md-2 col-form-label payroll-form-label ">
                    Work Day per Month:
                  </label>
                  <div className="col-md-8">
                    <input
                      type="number"
                      disabled
                      className="form-control"
                      id="workDayPerMonth"
                      name="workDayPerMonth"
                      value={workDayPerMonth}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="bonus"
                    className="col-4 col-md-2 col-form-label payroll-form-label "
                    placeholder="bonus">
                    Bonus:
                  </label>
                  <div className="col-md-8">
                    <input
                      type="number"
                      min="0"
                      required
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
                    htmlFor="advancePayment"
                    className="col-4 col-md-2 col-form-label payroll-form-label ">
                    Advance Payment:
                  </label>
                  <div className="col-md-8">
                    <input
                      type="text"
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

const mapStateToProps = (state) => {
  return {
    payrollUpdating: state.payrollUpdating,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    onGetPayroll: (id) => {
      dispatch(actGetPayrollRequest(id));
    },
    onUpdatePayroll: (id, month, year, payroll, callback) => {
      dispatch(actUpdatePayrollRequest(id, month, year, payroll, callback));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPayroll);
