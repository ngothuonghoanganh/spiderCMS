
// Import from node_module
import React from 'react';
import 'datatables.net-bs4';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getListTypeCV } from './actions';
import APIcaller from '../../utils/APIcaller';
import { get, isEmpty } from 'lodash';
import { endpoint } from './../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import * as responses from '../../constants/response';

// Import From File

class Hobbies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listHobbies: [],
      hobbies: '',
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
          if (item.name === 'Hobbies') {
            this.setState({
              typeObjectId: item.id,
            });
          }
        });
        const { id } = this.props;
        const { listHobbies, typeObjectId } = this.state;
        APIcaller(`${endpoint.getOneCV}?profileId=${id}`, 'GET', {
          token: getItemLocalStore('token'),
          accountid: getItemLocalStore('accountid'),
        }).then((res) => {
          if (res.data.responseKey === responses.getListSuccess) {
            const CVData = get(res, 'data.data', '');
            CVData.forEach((item) => {
              if (item.typeObjectId === typeObjectId) {
                const data = {
                  name: item.name,
                  typeObjectId: item.typeObjectId,
                  id: item.id,
                };
                listHobbies.push(data);
              }
            });
            this.setState({
              listHobbies: [...listHobbies],
            });
            this.props.saveHobbies(listHobbies);
          }
        });
      }
    });
  }
  onSubmit(e) {
    e.preventDefault();
    const data = {
      name: this.state.hobbies,
      typeObjectId: this.state.typeObjectId,
    };
    const { listHobbies } = this.state;
    listHobbies.push(data);
    this.setState({
      listHobbies: [...listHobbies],
    });
    this.onClear();
    this.props.saveHobbies(listHobbies);
  }
  onClear() {
    this.setState({
      hobbies: '',
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
      APIcaller(`${endpoint.deleteOneCV}`, 'DELETE', {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      }, {
        cvId: id,
      }).then((res) => {
        if (res.data.responseKey === responses.deleteSuccess) {
          const { listHobbies } = this.state;
          listHobbies.forEach((item, index) => {
            if (item.id === id) {
              listHobbies.splice(index, 1);
            }
          });
          this.setState({
            listHobbies,
          });
          this.props.saveHobbies(listHobbies);
        }
      });
    } else {
      const { listHobbies } = this.state;
      listHobbies.forEach((item, index) => {
        if ((index + 1) === idHobbies) {
          listHobbies.splice(index, 1);
        }
      });
      this.setState({
        listHobbies,
      });
      this.props.saveSkill(listHobbies);
    }
  }
  showHobbies(listHobbies = []) {
    let result = [];
    if (listHobbies.length > 0) {
      result = listHobbies.map((element, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
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
  render() {
    const { hobbies, listHobbies } = this.state;
    return (
      <div className="col-md-12 pb-3">
        <div className="row">
          <div className="col-md-12 bg-color pb-3">
            <div className="row">
              <div className="col-md-10">
                <input type="text" className="form-control input-large" name="hobbies" value={hobbies} onChange={this.onChange} />
              </div>
              <div className="col-md-2 pr-0">
                <div className="float-right mr-1">
                  <button type="button" onClick={this.onSubmit} className="btn btn-orange"> Add</button>
                </div>
              </div>
            </div>
          </div>
          {!isEmpty(listHobbies) ?
            <div className="col-md-12">
              <table cellSpacing="0" className="table table-bordered table-striped table-hover bg-white mt-3">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Hobbies Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.showHobbies(listHobbies)}
                </tbody>
              </table>
            </div> : ''
          }
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => (
  {
    getListTypeCV: bindActionCreators(getListTypeCV, dispatch),
  }
);

export default connect(null, mapDispatchToProps)(Hobbies);

