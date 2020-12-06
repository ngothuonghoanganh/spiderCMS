import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

class Permission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  // Click show dropdown button
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  render() {
    const { id, name, description } = this.props.permission;
    return (
      <tr>
        <td>{this.props.index}</td>
        <td>{name}</td>
        <td>{description}</td>
        <td className="col-actions text-center">
          <Link to={`permissions/${id}`} className="color-1"><FontAwesomeIcon icon="edit" /></Link>
          &nbsp;&nbsp;&nbsp;
          <FontAwesomeIcon icon="trash-alt" className="color-1 btn-delete" onClick={() => this.props.onDeleteItem(id)} />
        </td>
      </tr>
    );
  }
}
/** Props validation */
Permission.propTypes = {
  onDeleteItem: PropTypes.func.isRequired,
  permission: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default Permission;
