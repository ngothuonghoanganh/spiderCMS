// Import from node_module
import React from 'react';
import 'datatables.net-bs4';
// Import From File
import PermissionItem from './PermissionItem';

class PermissionGroup extends React.Component {
  constructor(props) {
    super(props);
    this.dataTable = React.createRef();
    this.showPerItem = this.showPerItem.bind(this);
  }

  // Show Permission Items
  showPerItem(permissions) {
    let result = null;
    const { onCheck } = this.props;
    if (permissions.length > 0) {
      result = permissions.map((item, index) => (
        <PermissionItem
          key={`perItem-${item.id}`}
          index={index}
          permission={item}
          isActive={item.isActive}
          onCheck={onCheck}
        />
      ));
    }
    return result;
  }

  render() {
    const { name, permissions } = this.props;
    return (
      <div className="permission-group">
        <div className="card">
          <div className="card-header">
            {name.toUpperCase()}
          </div>
          <div className="card-body">
            <div className="card-text">
              <table ref={this.dataTable} cellSpacing="0" className="table table-bordered table-striped table-hover bg-white">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Permission Name</th>
                    <th>Description</th>
                    <th>Active/Deactive</th>
                  </tr>
                </thead>
                <tbody>
                  {this.showPerItem(permissions)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PermissionGroup;

