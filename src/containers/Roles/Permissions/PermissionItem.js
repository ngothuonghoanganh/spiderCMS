// Import from node_module
import React from 'react';
// Import From File

class PermissionItem extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  onChange({ target }) {
    this.props.onCheck(target.id);
  }
  render() {
    const { index, permission, isActive } = this.props;
    return (
      <tr>
        <td>{index + 1}</td>
        <td>{permission.label}</td>
        <td className="text-left">{permission.description}</td>
        <td>
          <label className="switch" >
            <input type="checkbox" checked={isActive} id={permission.id} name={`permission-${permission.id}`} onChange={this.onChange} />
            <span className="slider round"></span>
          </label>
        </td>
      </tr>
    );
  }
}

export default PermissionItem;

