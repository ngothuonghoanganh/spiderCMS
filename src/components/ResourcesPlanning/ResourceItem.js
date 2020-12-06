import React from 'react';
import $ from 'jquery';
import { confirmPopup } from '../../utils/alertPopup';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { constant } from '../../constants/constant';
const { updateResources, deleteResources } = constant.permissions;
const ResourceItem = (props) => {
  const {
    item: { id, firstName, lastName, planning },
    onUpdateForm,
    onDelete,
    index,
  } = props;

  // handle render project each month
  let planningMonths = [];
  for (let i = 0; i < 12; i++) {
    planningMonths[i] = [];
  }
  if (planning.length) {
    planning.forEach(({ month, name, projectId }) => {
      planningMonths[month - 1].push({ projectName: name, id: projectId });
    });
  }
  const planningMonthRender = planningMonths.map((ele, index) => (
    <td key={index}>
      {ele.length ? ele.map((ele) => ele.projectName).join(' , ') : ''}
    </td>
  ));

  const listPermission = getItemLocalStore('listPermissions');

  const fullName = `${firstName ? firstName : ''} ${lastName ? lastName : ''}`;
  return (
    <tr>
      <td>{index}</td>
      <td>{fullName}</td>
      {planningMonthRender}
      {listPermission.includes(updateResources) &&
      listPermission.includes(deleteResources) ? (
        <td>
          <div className="btn-group">
            <button
              className="btn btn-orange dropdown-toggle"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
              Action
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <button
                className="dropdown-item"
                type="button"
                data-toggle="modal"
                onClick={(e) => {
                  onUpdateForm(id, { id, fullName }, planningMonths, true);
                  $('#modelFormId').modal('show');
                }}>
                Edit
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => {
                  confirmPopup(
                    'Delete Project',
                    `Do you want delete plannings of ${
                      firstName ? firstName : ''
                    } ${lastName ? lastName : ''}`,
                    () => {
                      onDelete(id);
                    }
                  );
                }}>
                Delete
              </button>
            </div>
          </div>
        </td>
      ) : (
        ''
      )}
    </tr>
  );
};

export default ResourceItem;
