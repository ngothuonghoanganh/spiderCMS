
// Import from node_module
import React from 'react';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import 'datatables.net-bs4';
import DatePicker from 'react-datepicker';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import APIcaller from '../../utils/APIcaller';
import { getListTypeCV } from './actions';
import { endpoint } from './../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import * as responses from '../../constants/response';


// Import From File

class Experience extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listExperience: [],
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
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
          if (item.name === 'Experience') {
            this.setState({
              typeObjectId: item.id,
            });
          }
        });
        const { id } = this.props;
        const { listExperience, typeObjectId } = this.state;
        APIcaller(`${endpoint.getOneCV}?profileId=${id}`, 'GET', {
          token: getItemLocalStore('token'),
          accountid: getItemLocalStore('accountid'),
        }).then((res) => {
          if (res.data.responseKey === responses.getListSuccess) {
            const CVData = get(res, 'data.data', '');
            CVData.forEach((item) => {
              if (item.typeObjectId === typeObjectId) {
                const data = {
                  from: item.from,
                  to: item.to,
                  name: item.name,
                  content: item.content,
                  company: item.company,
                  typeObjectId: item.typeObjectId,
                  id: item.id,
                };
                listExperience.push(data);
              }
            });
            this.setState({
              listExperience: [...listExperience],
            });
            this.props.saveExperience(listExperience);
          }
        });
      }
    });
  }
  onSubmit(e) {
    e.preventDefault();
    const data = {
      from: this.state.expStartDate,
      to: this.state.expEndDate,
      name: this.state.title,
      content: this.state.description,
      company: this.state.company,
      typeObjectId: this.state.typeObjectId,
    };
    const { listExperience } = this.state;
    listExperience.push(data);
    this.setState({
      listExperience: [...listExperience],
    });
    this.onClear();
    this.props.saveExperience(listExperience);
  }
  onClear() {
    this.setState({
      title: '',
      description: '',
      company: '',
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
  onDelete(id, idExperience) {
    if (id) {
      APIcaller(`${endpoint.deleteOneCV}`, 'DELETE', {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      }, {
        cvId: id,
      }).then((res) => {
        if (res.data.responseKey === responses.deleteSuccess) {
          const { listExperience } = this.state;
          listExperience.forEach((item, index) => {
            if (item.id === id) {
              listExperience.splice(index, 1);
            }
          });
          this.setState({
            listExperience,
          });
          this.props.saveExperience(listExperience);
        }
      });
    } else {
      const { listExperience } = this.state;
      listExperience.forEach((item, index) => {
        if ((index + 1) === idExperience) {
          listExperience.splice(index, 1);
        }
      });
      this.setState({
        listExperience,
      });
      this.props.saveExperience(listExperience);
    }
  }

  showExperience(listExperience = []) {
    let result = [];
    if (listExperience.length > 0) {
      result = listExperience.map((element, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{element.company}</td>
          <td>{element.from ? moment(element.from).format('DD/MM/YYYY') : ''} - {element.to ? moment(element.to).format('DD/MM/YYYY') : ''}</td>
          <td>{element.name}</td>
          <td>
            <div className="btn-group">
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => this.onDelete(element.id, index + 1)}
                className="btn btn-orange"
              >
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
    const { title, company, description, expStartDate, expEndDate, listExperience } = this.state;
    return (
      <div className="col-md-12 pb-3">
        <div className="row">
          <div className="col-md-12 bg-color">
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <label className="col-md-4">Company:</label>
                  <div className="col-md-8">
                    <input type="text" className="form-control" name="company" value={company} onChange={this.onChange} />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-6">
                    <div className="row">
                      <label className="col-md-4">From:</label>
                      <div className="col-md-8">
                        <DatePicker
                          className="form-control"
                          selected={expStartDate}
                          onChange={this.handleChangeDateStart}
                          dateFormat="MM/YYYY"
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
                          dateFormat="MM/YYYY"
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mt-3 borderline">
                <div className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <label className="col-md-2">Title:</label>
                      <div className="col-md-10">
                        <input type="text" className="form-control" name="title" value={title} onChange={this.onChange} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 mt-3 pb-3">
                    <div className="row">
                      <label className="col-md-2">Description:</label>
                      <div className="col-md-10">
                        <textarea type="text" className="form-control form-text" name="description" value={description} onChange={this.onChange} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 mt-3 pb-3 pr-0">
                    <div className="float-right mr-1">
                      <button type="button" onClick={this.onSubmit} className="btn btn-orange"> Add</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!isEmpty(listExperience) ?
            <div className="col-md-12">
              <table ref={this.dataTable} cellSpacing="0" className="table table-bordered table-striped table-hover bg-white mt-3">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Company</th>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.showExperience(listExperience)}
                </tbody>
              </table>
            </div> : ''
          }
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) =>
  ({
    getListTypeCV: bindActionCreators(getListTypeCV, dispatch),
  });
export default connect(null, mapDispatchToProps)(Experience);

