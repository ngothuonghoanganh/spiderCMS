// Import from node_module
import React from 'react';
import 'datatables.net-bs4';
import DatePicker from 'react-datepicker';
import { getListTypeCV } from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import APIcaller from '../../utils/APIcaller';
import { get, isEmpty } from 'lodash';
import { endpoint } from './../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import * as responses from '../../constants/response';

// Import From File

class Education extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listEducation: [],
    };
    this.dataTable = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handleChangeDateStart = this.handleChangeDateStart.bind(this);
    this.handleChangeDateEnd = this.handleChangeDateEnd.bind(this);
  }
  componentWillMount() {
    this.props.getListTypeCV((result, listTypeCV) => {
      if (result) {
        this.setState({
          listTypeCV,
        });
        listTypeCV.forEach((item) => {
          if (item.name === 'Education') {
            this.setState({
              typeObjectId: item.id,
            });
          }
        });
        const { id } = this.props;
        const { listEducation, typeObjectId } = this.state;
        APIcaller(`${endpoint.getOneCV}?profileId=${id}`, 'GET', {
          token: getItemLocalStore('token'),
          accountid: getItemLocalStore('accountid'),
        }).then((res) => {
          if (res.data.responseKey === responses.getListSuccess) {
            const CVData = get(res, 'data.data', '');
            CVData.forEach((item) => {
              if (item.typeObjectId === typeObjectId) {
                const data = {
                  content: item.content,
                  typeObjectId: item.typeObjectId,
                  from: item.from,
                  to: item.to,
                  id: item.id,
                };
                listEducation.push(data);
              }
            });
            this.setState({
              listEducation: [...listEducation],
            });
            this.props.saveEducation(listEducation);
          }
        });
      }
    });
  }
  onSubmit(e) {
    e.preventDefault();
    const data = {
      content: this.state.description,
      typeObjectId: this.state.typeObjectId,
      from: this.state.expStartDate,
      to: this.state.expEndDate,
    };
    const { listEducation } = this.state;
    listEducation.push(data);
    this.setState({
      listEducation: [...listEducation],
    });
    this.onClear();
    this.props.saveEducation(listEducation);
  }
  onClear() {
    this.setState({
      description: '',
      expStartDate: '',
      expEndDate: '',
    });
  }
  onChange(e) {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
  }
  onDelete(id, idEducation) {
    if (id) {
      APIcaller(
        `${endpoint.deleteOneCV}`,
        'DELETE',
        {
          token: getItemLocalStore('token'),
          accountid: getItemLocalStore('accountid'),
        },
        {
          cvId: id,
        }
      ).then((res) => {
        if (res.data.responseKey === responses.deleteSuccess) {
          const { listEducation } = this.state;
          listEducation.forEach((item, index) => {
            if (item.id === id) {
              listEducation.splice(index, 1);
            }
          });
          this.setState({
            listEducation,
          });
          this.props.saveEducation(listEducation);
        }
      });
    } else {
      const { listEducation } = this.state;
      listEducation.forEach((item, index) => {
        if (index + 1 === idEducation) {
          listEducation.splice(index, 1);
        }
      });
      this.setState({
        listEducation,
      });
      this.props.saveEducation(listEducation);
    }
  }
  showEducation(listEducation = []) {
    let result = [];
    if (listEducation.length > 0) {
      result = listEducation.map((element, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            {element.from ? moment(element.from).format('YYYY') : ''} -{' '}
            {element.to ? moment(element.to).format('YYYY') : ''}
          </td>
          <td>{element.content}</td>
          <td>
            <div className="btn-group">
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => this.onDelete(element.id)}
                className="btn btn-orange">
                Delete
              </div>
            </div>
          </td>
        </tr>
      ));
    }
    return result;
  }
  handleChangeDateStart(date) {
    this.setState({
      expStartDate: date,
    });
  }
  handleChangeDateEnd(date) {
    this.setState({
      expEndDate: date,
    });
  }
  render() {
    const { expEndDate, expStartDate, description, listEducation } = this.state;
    return (
      <div className="col-md-12 pb-3">
        <div className="row">
          <div className="col-md-12 bg-color pb-2">
            <div className="row">
              <div className="col-md-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="row">
                      <label className="col-md-4">From:</label>
                      <div className="col-md-8">
                        <DatePicker
                          className="form-control"
                          selected={expStartDate}
                          onChange={this.handleChangeDateStart}
                          dateFormat="YYYY"
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <label className="col-md-4">To:</label>
                      <div className="col-md-8">
                        <DatePicker
                          className="form-control"
                          selected={expEndDate}
                          onChange={this.handleChangeDateEnd}
                          dateFormat="YYYY"
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                        />
                      </div>
                    </div>Description
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-4">Description:</div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                      value={description}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-2 pr-0">
                <div className="float-right mr-1">
                  <button
                    type="button"
                    onClick={this.onSubmit}
                    className="btn btn-orange">
                    {' '}
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {!isEmpty(listEducation) ? (
          <div className="col-md-12">
            <table
              ref={this.dataTable}
              cellSpacing="0"
              className="table table-bordered table-striped table-hover bg-white mt-3">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Year</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{this.showEducation(listEducation)}</tbody>
            </table>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getListTypeCV: bindActionCreators(getListTypeCV, dispatch),
});
export default connect(null, mapDispatchToProps)(Education);
