import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { endpoint } from '../../constants/config';
class ListItemPosition extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  onDelete(positionId) {
  if(confirm('Do you want to delete? ')){//eslint-disable-line
      this.props.onDelete(positionId);
    }
  }
  render() {
    const { list } = this.props;
    return (
      <tr>
        <td>{list.name}</td>
        <td>
          <div className="btn-group">
            <button className="btn btn-orange dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Action
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <Link className="dropdown-item edit" to={`${endpoint.editPosition}/${list.id}`}>Edit</Link>
              <li
                className="dropdown-item"
                style={{ cursor: 'pointer' }}
                onClick={() => this.onDelete(list.id)}
              >
              Delete
              </li>
            </div>
          </div>
        </td>
      </tr>
    );
  }
}

export default ListItemPosition;
