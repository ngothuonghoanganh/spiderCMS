export const CHANGE_THEME = 'CHANGE_THEME';
export const DELETE_TEMP = 'deleteAvatarsTemp';
export const SHOW_BIRTHDAY_NOTI = 'showBirthdayNotification';
export const LOAD_CRON_SUCCESS = 'LOAD_CRON_SUCCESS';
export const SET_CRON_SUCCESS = 'SET_CRON_SUCCESS';
export const SET_NOTI_SUCCESS = 'SET_NOTI_SUCCESS';

export const PERIOD = [
  { value: 'hour', label: 'hour' },
  { value: 'day', label: 'day' },
  { value: 'week', label: 'week' },
  { value: 'month', label: 'month' },
  { value: 'year', label: 'year' },
];

let arrTime = [];
for (let i = 0; i < 60; i += 1) {
  arrTime = [
    ...arrTime,
    { value: i, label: `0${i}`.slice(-2) },
  ];
}
export const TIME = arrTime;

let arrHours = [];
for (let i = 0; i < 24; i += 1) {
  arrHours = [
    ...arrHours,
    { value: i, label: `0${i}`.slice(-2) },
  ];
}
export const HOURS = arrHours;

export const DAYS = [
  { value: '0', label: 'Sun' },
  { value: '1', label: 'Mon' },
  { value: '2', label: 'Tue' },
  { value: '3', label: 'Wed' },
  { value: '4', label: 'Thur' },
  { value: '5', label: 'Fri' },
  { value: '6', label: 'Sat' },
];

let arrDate = [];
for (let i = 1; i <= 31; i += 1) {
  arrDate = [
    ...arrDate,
    { value: i, label: `0${i}`.slice(-2) },
  ];
}
export const DATE = arrDate;
