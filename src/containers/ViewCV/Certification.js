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

class Certification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listCertification: [],
      description: '',
    };
    this.dataTable = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
  }
  componentWillMount() {
    this.props.getListTypeCV((result, listTypeCV) => {
      if (result) {
        this.setState({
          listTypeCV,
        });
        listTypeCV.forEach((item) => {
          if (item.name === 'Certification') {
            this.setState({
              typeObjectId: item.id,
            });
          }
        });
        const { id } = this.props;
        const { listCertification, typeObjectId } = this.state;
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
                  content: item.content,
                  typeObjectId: item.typeObjectId,
                  id: item.id,
                };
                listCertification.push(data);
              }
            });
            this.setState({
              listCertification: [...listCertification],
            });
            this.props.saveCertification(listCertification);
          }
        });
      }
    });
  }
  onSubmit(e) {
    e.preventDefault();
    const data = {
      from: this.state.dateInfo,
      content: this.state.description,
      typeObjectId: this.state.typeObjectId,
    };
    const { listCertification } = this.state;
    listCertification.push(data);
    this.setState({
      listCertification: [...listCertification],
    });
    this.onClear();
    this.props.saveCertification(listCertification);
  }
  onClear() {
    this.setState({
      description: '',
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
  onDelete(id, idCertification) {
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
          const { listCertification } = this.state;
          listCertification.forEach((item, index) => {
            if (item.id === id) {
              listCertification.splice(index, 1);
            }
          });
          this.setState({
            listCertification,
          });
          this.props.saveCertification(listCertification);
        }
      });
    } else {
      const { listCertification } = this.state;
      listCertification.forEach((item, index) => {
        if (index + 1 === idCertification) {
          listCertification.splice(index, 1);
        }
      });
      this.setState({
        listCertification,
      });
      this.props.saveCertification(listCertification);
    }
  }
  showCertification(listCertification = []) {
    let result = [];
    if (listCertification.length > 0) {
      result = listCertification.map((element, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            {element.from ? moment(element.from).format('DD/MM/YYYY') : ''}
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
  handleChangeDate(date) {
    this.setState({
      dateInfo: date,
    });
  }
  render() {
    const { dateInfo, description, listCertification } = this.state;
    return (
      <div className="col-md-12 pb-3">
        <div className="row">
          <div className="col-md-12 bg-color pb-2">
            <div className="row">
              <div className="col-md-4">
                <div className="row">
                  <div className="col-md-4">Year:</div>
                  <div className="col-md-8">
                    <DatePicker
                      className="form-control"
                      selected={dateInfo}
                      onChange={this.handleChangeDate}
                      dateFormat="DD/MM/YYYY"
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
          {!isEmpty(listCertification) ? (
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
                <tbody>{this.showCertification(listCertification)}</tbody>
              </table>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  getListTypeCV: bindActionCreators(getListTypeCV, dispatch),
});
export default connect(null, mapDispatchToProps)(Certification);
