// Import from node_module
import React from 'react';
import 'datatables.net-bs4';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getListTypeCV } from './actions';
import APIcaller from '../../utils/APIcaller';
import { get, isEmpty } from 'lodash';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import * as responses from '../../constants/response';
import './index.css';

// Import From File

class Summary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listSummary: [],
    };
    this.dataTable = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }
  componentWillMount() {
    this.props.getListTypeCV((result, listTypeCV) => {
      if (result) {
        this.setState({
          listTypeCV,
        });
        listTypeCV.forEach((item) => {
          if (item.name === 'Summary') {
            this.setState({
              typeObjectId: item.id,
            });
          }
        });
        const { id } = this.props;
        const { listSummary, typeObjectId } = this.state;
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
                  id: item.id,
                };
                listSummary.push(data);
              }
            });
            this.setState({
              listSummary: [...listSummary],
            });
            this.props.saveSummary(listSummary);
          }
        });
      }
    });
  }
  onSubmit(e) {
    e.preventDefault();
    const data = {
      content: this.state.summary,
      typeObjectId: this.state.typeObjectId,
    };
    const { listSummary } = this.state;
    listSummary.push(data);
    this.setState({
      listSummary: [...listSummary],
    });
    this.onClear();
    this.props.saveSummary(listSummary);
  }
  onClear() {
    this.setState({
      summary: '',
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
  onDelete(id, idHobbies) {
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
          const { listSummary } = this.state;
          listSummary.forEach((item, index) => {
            if (item.id === id) {
              listSummary.splice(index, 1);
            }
          });
          this.setState({
            listSummary,
          });
          this.props.saveSummary(listSummary);
        }
      });
    } else {
      const { listSummary } = this.state;
      listSummary.forEach((item, index) => {
        if (index + 1 === idHobbies) {
          listSummary.splice(index, 1);
        }
      });
      this.setState({
        listSummary,
      });
      this.props.saveSummary(listSummary);
    }
  }
  showSummary(listSummary = []) {
    let result = [];
    if (listSummary.length > 0) {
      result = listSummary.map((element, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{element.content}</td>
          <td>
            <div className="btn-group">
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => this.onDelete(element.id, index + 1)}
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
  render() {
    const { summary, listSummary } = this.state;
    return (
      <div className="col-md-12 pb-3">
        <div className="row">
          <div className="col-md-12 bg-color pb-3">
            <div className="row">
              <div className="col-md-8 form-group">
                <textarea
                  type="text"
                  className="form-control input-large"
                  rows="5"
                  name="summary"
                  value={summary}
                  onChange={this.onChange}
                />
              </div>
              <div className="col-md-2 pr-0 mt-3">
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
          {!isEmpty(listSummary) ? (
            <div className="col-md-12">
              <table
                cellSpacing="0"
                className="table table-bordered table-striped table-hover bg-white mt-3">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Summary</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{this.showSummary(listSummary)}</tbody>
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

export default connect(null, mapDispatchToProps)(Summary);
