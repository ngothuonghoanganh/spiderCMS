// Import from node_module
import React from 'react';
import 'datatables.net-bs4';
import * as responses from '../../../constants/response';
import APIcaller from '../../../utils/APIcaller';
import { endpoint } from '../../../constants/config';
import { getItemLocalStore } from '../../../utils/handleLocalStore';
import { alertPopup } from '../../../utils/alertPopup';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { showTreePosition } from '../actions';
// Import From File

class ChildPosition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.dataTable = React.createRef();
    this.SetParent = this.SetParent.bind(this);
  }
  SetParent(elementID) {
    const { ParentId, DepartmentId } = this.props;
    APIcaller(
      `${endpoint.setParent}`,
      'POST',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      },
      {
        departmentId: DepartmentId,
        profilePositionIdParent: elementID,
        profilePositionIdChild: ParentId,
      },
    ).then((res) => {
      if (res.data.responseKey === responses.updateSuccess) {
        this.props.RemoveChild(ParentId);
      } else {
        alertPopup('FAILD!!!!', res.data.responseKey);
      }
    });
  }
  ShowListChild(ListChild) {
    const { level } = this.props;
    let result = <span>No data available</span>;
    if (ListChild.length > 0) {
      result = ListChild.map((item, index) => {
        if (item.level < level) {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td className="text-center">{item.level}</td>
              <td>
                <div
                  className="btn btn-orange mt-2"
                  onClick={() => this.SetParent(item.profilePositionId)}
                >
									Add
                </div>
              </td>
            </tr>
          );
        }
      });
    }
    return result;
  }
  render() {
    const { ListChild } = this.props;
    return (
      <table
        ref={this.dataTable}
        cellSpacing="0"
        className="table table-bordered table-striped table-hover bg-white"
      >
        <thead>
          <tr>
            <th>No.</th>
            <th>Position Name</th>
            <th>Level</th>
            <th>Active/Deactive</th>
          </tr>
        </thead>
        <tbody>{this.ShowListChild(ListChild)}</tbody>
      </table>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  showTreePosition: bindActionCreators(showTreePosition, dispatch),
});
export default connect(null, mapDispatchToProps)(ChildPosition);
