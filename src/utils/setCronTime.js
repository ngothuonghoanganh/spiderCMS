import { isUndefined } from 'lodash';
/*
  * format time send to server
  * input: data (d, m, h, min, sec ...) and the old obj contain time,
  * output: new time formatted
*/
export default function setCronTime(data, settings, keyword) {

  let parseObj = {};

  if (keyword === 'deleteAvatarsTemp') {
    const { fullDate } = data;
    let { month, hours, minute, day, date } = data;

    if (fullDate) {
      month = fullDate.get('month') + 1;
      date = fullDate.get('date');
    }
    if (fullDate === '') {
      month = '*';
      if (isUndefined(date)) {
        date = '*';
      }
    }
    if (day === '') {
      day = '*';
    }
    if (date === '') {
      date = '*';
    }
    if (hours === '') {
      hours = '*';
    }
    if (minute === '') {
      minute = '*';
    }
    const time = `* ${minute} ${hours} ${date} ${month} ${day}`;
    const sendObj = {
      ...settings,
      time,
    };
    parseObj = JSON.stringify(sendObj);
  } else {
    const { fullDateNoti } = data;
    let { monthNoti, hoursNoti, minuteNoti, dayNoti, dateNoti } = data;

    if (fullDateNoti) {
      monthNoti = fullDateNoti.get('monthNoti') + 1;
      dateNoti = fullDateNoti.get('dateNoti');
    }
    if (fullDateNoti === '') {
      monthNoti = '*';
      if (isUndefined(dateNoti)) {
        dateNoti = '*';
      }
    }
    if (dayNoti === '') {
      dayNoti = '*';
    }
    if (dateNoti === '') {
      dateNoti = '*';
    }
    if (hoursNoti === '') {
      hoursNoti = '*';
    }
    if (minuteNoti === '') {
      minuteNoti = '*';
    }
    const time = `* ${minuteNoti} ${hoursNoti} ${dateNoti} ${monthNoti} ${dayNoti}`;
    const sendObj = {
      ...settings,
      time,
    };
    parseObj = JSON.stringify(sendObj);
  }

  return parseObj;
}
