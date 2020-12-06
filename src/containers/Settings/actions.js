import { get } from 'lodash';
import * as constant from './constants';
import { endpoint } from '../../constants/config';
import APICaller from '../../utils/APIcaller';
import * as responses from '../../constants/response';
import handleLocalStore, { getItemLocalStore, getLocalStore } from '../../utils/handleLocalStore';
import setCronTime from '../../utils/setCronTime';
import handlerError from '../../utils/handlerError';

export const changeTheme = (theme) => ({
  type: constant.CHANGE_THEME,
  theme,
});

export function loadCron(callback) {
  const request = APICaller(endpoint.loadCron, 'post', { }, { key: constant.DELETE_TEMP });

  return () => {
    request.then((response) => {
      const responseData = get(response, 'data', {});
      const { responseKey } = responseData;

      if (responseKey === responses.getOneSuccess) {
        const settings = responseData.data.data;
        const payload = responseData.data.data;
        let localStore = getLocalStore();
        localStore = { ...localStore, settings };
        handleLocalStore(localStore);
        return callback(true, payload);
      }
      handlerError(responseKey);
      return callback(false);
    });
  };
}

export function loadBirthdayNotification(callback) {
  const request = APICaller(endpoint.loadCron, 'post', { }, { key: constant.SHOW_BIRTHDAY_NOTI });
  return () => {
    request.then((response) => {
      const responseData = get(response, 'data', {});
      const { responseKey } = responseData;

      if (responseKey === responses.getOneSuccess) {
        const settingNoti = responseData.data.data;
        const data = responseData.data.data;
        let localStoreNoti = getLocalStore();
        localStoreNoti = { ...localStoreNoti, settingNoti };
        handleLocalStore(localStoreNoti);
        return callback(true, data);
      }
      handlerError(responseKey);
      return callback(false);
    });
  };
}

export function setCron(data, keyword) {
  if (keyword === 'deleteAvatarsTemp') {
    const settings = JSON.parse(getItemLocalStore('settings'));
    const parseObj = setCronTime(data, settings, keyword);
    const request = APICaller(endpoint.setCron, 'post', { }, {
      key: keyword,
      data: parseObj,
    });
    return (dispatch) => {
      request.then((response) => {
        const responseData = get(response, 'data', {});
        const { responseKey } = responseData;
        if (responseKey === responses.updateSuccess) {
          window.location.href = '/settings';
          dispatch({
            type: constant.SET_CRON_SUCCESS,
          });
        }
      }).then(() => {
        APICaller(`${endpoint.restartJob}?key=${constant.DELETE_TEMP}`, 'get');
      });
    };
  }
  const settingNoti = JSON.parse(getItemLocalStore('settingNoti'));
  const parseObjNoti = setCronTime(data, settingNoti, keyword);
  const request = APICaller(endpoint.setCron, 'post', { }, {
    key: keyword,
    data: parseObjNoti,
  });
  return (dispatch) => {
    request.then((response) => {
      const responseData = get(response, 'data', {});
      const { responseKey } = responseData;
      if (responseKey === responses.updateSuccess) {
        window.location.href = '/settings';
        dispatch({
          type: constant.SET_NOTI_SUCCESS,
        });
      }
    }).then(() => {
      APICaller(`${endpoint.restartJob}?key=${constant.DELETE_TEMP}`, 'get');
    });
  };
}

