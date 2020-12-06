/** Import from node_modules */
import { get } from 'lodash';
/** Import from file */
import APIcaller from './../../utils/APIcaller';
import * as Types from './constants';
import * as status from './../../constants/response';
import errorHandler from './../../utils/handlerError';
import { getItemLocalStore } from '../../utils/handleLocalStore';

/** Act Fetch All Role from API */
export const fetchRoles = (callback) => (dispatch) =>
  APIcaller('roles', 'GET', {
    token: getItemLocalStore('token'),
    accountid: getItemLocalStore('accountid'),
  }).then((res) => {
    const responseKey = get(res, `data.${Types.RESPONSE_KEY}`);
    const message = get(res, 'data.message');
    // console.log(res.data);

    switch (responseKey) {
      case status.getListSuccess:
      case status.notFound: {
        const data = get(res, 'data.data', []);
        dispatch(actFetchRoles(data));
        return callback(true);
      }
      default: {
        return callback(false, Types.MESSAGE_FAILED, errorHandler(message));
      }
    }
  });

/** Act Fetch All Role to Store Redux */
export const actFetchRoles = (roles) => ({
  type: Types.FETCH_ROLES,
  roles,
});

/** Act fetch One Role By Name */
export const fetchOneRoleByName = (roleName, callback) => () =>
  APIcaller(`role-name?roleName=${roleName}`, 'GET', {}, null).then((res) => {
    switch (get(res, `data.${Types.RESPONSE_KEY}`)) {
      case status.getOneSuccess: {
        const data = get(res, 'data.data');
        return callback(true, data);
      }
      default: {
        return callback(false);
      }
    }
  });

/** Act Add Role */
export const addRole = (role, callback) => (dispatch) =>
  APIcaller('role', 'POST', {}, role).then((res) => {
    const responseKey = get(res, `data.${Types.RESPONSE_KEY}`);
    const message = get(res, 'data.message');
    switch (responseKey) {
      case status.insertSuccess: {
        const data = get(res, 'data.data', {});
        dispatch(actAddRole(data));
        return callback(true);
      }
      default: {
        return callback(false, Types.MESSAGE_FAILED, errorHandler(message));
      }
    }
  });

/** Act Add Role to Store Redux */
export const actAddRole = (role) => ({
  type: Types.ADD_ROLE,
  role,
});

/** Act Delete Role from API */
export const deleteRole = (role, callback) => (dispatch) =>
  APIcaller('role', 'DELETE', {}, { roleId: get(role, 'id') }).then((res) => {
    const responseKey = get(res, `data.${Types.RESPONSE_KEY}`);
    const message = get(res, 'data.message');
    switch (responseKey) {
      case status.deleteSuccess: {
        dispatch(actDeleteRole(role));
        return callback(Types.MESSAGE_SUCCESS, 'This role is deleted !!!!');
      }
      default: {
        return callback(Types.MESSAGE_FAILED, errorHandler(message));
      }
    }
  });

/** Act Delete Role to Store Redux */
export const actDeleteRole = (role) => ({
  type: Types.DELETE_ROLE,
  role,
});

/** Act Update Role from API */
export const updateRole = (role, callback) => (dispatch) =>
  APIcaller('role', 'PATCH', {}, role).then((res) => {
    const responseKey = get(res, `data.${Types.RESPONSE_KEY}`);
    const message = get(res, 'data.message');
    switch (responseKey) {
      case status.updateSuccess: {
        const data = get(res, 'data.data', {});
        dispatch(actUpdateRole(data));
        return callback(true);
      }
      default: {
        return callback(false, Types.MESSAGE_FAILED, errorHandler(message));
      }
    }
  });

/** Act Delete Role to Store Redux */
export const actUpdateRole = (role) => ({
  type: Types.UPDATE_ROLE,
  role,
});
