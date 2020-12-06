// Import from node_module
import React from 'react';
import 'datatables.net-bs4';
import { getListTypeCV } from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import APIcaller from '../../utils/APIcaller';
import { get, isEmpty } from 'lodash';
import { endpoint } from './../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import * as responses from '../../constants/response';
import './index.css';

// Import From File

class Language extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listLanguage: [],
      description: '',
      name: '',
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
          if (item.name === 'Languages') {
            this.setState({
              typeObjectId: item.id,
            });
          }
        });
        const { id } = this.props;
        const { listLanguage, typeObjectId } = this.state;
        APIcaller(`${endpoint.getOneCV}?profileId=${id}`, 'GET', {
          token: getItemLocalStore('token'),
          accountid: getItemLocalStore('accountid'),
        }).then((res) => {
          if (res.data.responseKey === responses.getListSuccess) {
            const CVData = get(res, 'data.data', '');
            CVData.forEach((item) => {
              if (item.typeObjectId === typeObjectId) {
                listLanguage.push(item);
              }
            });
            this.setState({
              listLanguage: [...listLanguage],
            });
            this.props.saveLanguages(listLanguage);
          }
        });
      }
    });
  }
  onSubmit(e) {
    e.preventDefault();
    const data = {
      name: this.state.name,
      content: this.state.description,
      typeObjectId: this.state.typeObjectId,
    };
    const { listLanguage } = this.state;
    listLanguage.push(data);
    this.setState({
      listLanguage: [...listLanguage],
    });
    this.onClear();
    this.props.saveLanguages(listLanguage);
  }
  onClear() {
    this.setState({
      name: '',
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
  onDelete(id, idLanguage) {
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
          const { listLanguage } = this.state;
          listLanguage.forEach((item, index) => {
            if (item.id === id) {
              listLanguage.splice(index, 1);
            }
          });
          this.setState({
            listLanguage,
          });
          this.props.saveLanguages(listLanguage);
        }
      });
    } else {
      const { listLanguage } = this.state;
      listLanguage.forEach((item, index) => {
        if (index + 1 === idLanguage) {
          listLanguage.splice(index, 1);
        }
      });
      this.setState({
        listLanguage,
      });
      this.props.saveLanguages(listLanguage);
    }
  }
  showLanguage(listLanguage = []) {
    let result = [];
    if (listLanguage.length > 0) {
      result = listLanguage.map((element, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{element.name}</td>
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
  render() {
    const { name, description, listLanguage } = this.state;
    return (
      <div className="col-md-12 pb-3">
        <div className="row">
          <div className="col-md-12 bg-color pb-2">
            <div className="row">
              <div className="col-md-4">
                <div className="row">
                  <div className="col-md-4">Name:</div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={name}
                      onChange={this.onChange}
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
          {!isEmpty(listLanguage) ? (
            <div className="col-md-12">
              <table
                ref={this.dataTable}
                cellSpacing="0"
                className="table table-bordered table-striped table-hover bg-white mt-3">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Language Name</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{this.showLanguage(listLanguage)}</tbody>
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
export default connect(null, mapDispatchToProps)(Language);
