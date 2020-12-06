import * as Types from './constants';
import callApi from './../../utils/APIcaller';

// Lấy tất cả permission.
export const actFetchPermissionsRequest = (headers) => (
  (dispatch) => (
    callApi('permissions', 'GET', headers)
      .then((res) => {
        if (res.data.status === 200) {
          dispatch(actFetchPermissions(res.data.data));
        }
      })
      .catch((err) => {
      })
  )
);

export const actFetchPermissions = (permissions) => ({
  type: Types.FETCH_PERMISSIONS,
  permissions,
});

// Lấy dữ liệu một permission.
export const actGetEditPermissionRequest = (headers, id) => (
  (dispatch) => (
    callApi(`permission?permission_id=${id}`, 'GET', headers)
      .then((res) => {
        dispatch(actGetEditPermission(res.data.data));
      })
      .catch((err) => {
      })
  )
);

export const actGetEditPermission = (permissions) => ({
  type: Types.FETCH_EDIT_PERMISSIONS,
  permissions,
});

// Action Add Permission Item
export const actAddPermissionRequest = (headers, permission) => (
  (dispatch) => (
    callApi('permission', 'POST', headers, permission)
      .then((res) => {
        dispatch(actAddPermission(res.data.data));
      })
      .catch((err) => {
      })
  )
);

export const actAddPermission = (permission) => ({
  type: Types.ADD_PERMISSIONS,
  permission,
});

// Action Delete Permission
export const actDeletePermissionRequest = (headers, id) => (
  (dispatch) => (
    callApi('permission', 'DELETE', headers, { permission_id: id })
      .then((res) => {
        dispatch(actDeletePermission(id));
      })
      .catch((err) => {
      })
  )
);

export const actDeletePermission = (id) => ({
  type: Types.DELETE_PERMISSIONS,
  id,
});

// Action Update Permission
export const actUpdatePermissionRequest = (headers, permission) => (
  (dispatch) => (
    callApi('permission', 'PATCH', headers, permission)
      .then((res) => {
        dispatch(actUpdatePermission(permission));
      })
      .catch((err) => {

      })
  )
);

export const actUpdatePermission = (permission) => ({
  type: Types.UPDATE_PERMISSIONS,
  permission,
});
