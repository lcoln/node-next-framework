/* eslint-disable guard-for-in */
/**
 * []
 * @authors linteng (875482941@qq.com)
 * @date    2018-09-17 18:17:45
 */
/* eslint no-extend-native: ["error", { "exceptions": ["Date"] }] */
'use strict';

if (!Date.prototype.getFullWeek) {
  Object.defineProperty(Date.prototype, 'getFullWeek', {
    value() {
      const thisYear = this.getFullYear();
      const that = new Date(thisYear, 0, 1);
      const firstDay = that.getDay();
      const numsOfToday = (this - that) / 24 / 360 / 1000;
      return Math.ceil((numsOfToday + firstDay) / 7);
    },
    enumerable: false,
  });
}

if (!Date.prototype.getWeek) {
  Object.defineProperty(Date.prototype, 'getWeek', {
    value() {
      const today = this.getDate();
      const year = this.getFullYear();
      const month = this.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      return Math.ceil((today + firstDay) / 7);
    },
    enumerable: false,
  });
}

if (!Date.prototype.format) {
  const WEEK = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

  const REG = {
    Y: (dt) => dt.getFullYear(),
    y: (dt) => dt.getYear(),
    m: (dt) => {
      const month = dt.getMonth() + 1;
      return month < 10 ? `0${month}` : month;
    },
    n: (dt) => dt.getMonth() + 1,
    d: (dt) => {
      const date = dt.getDate();
      return date < 10 ? `0${date}` : date;
    },
    j: (dt) => dt.getDate(),
    H: (dt) => {
      const hours = dt.getHours();
      return hours < 10 ? `0${hours}` : hours;
    },
    h: (dt) => {
      const hours = dt.getHours();
      const g = hours > 12 ? hours - 12 : hours;
      return g < 10 ? `0${g}` : g;
    },
    G: (dt) => dt.getHours(),
    g: (dt) => {
      const hours = dt.getHours();
      return hours > 12 ? hours - 12 : hours;
    },
    i: (dt) => {
      const minutes = dt.getMinutes();
      return minutes < 10 ? `0${minutes}` : minutes;
    },
    s: (dt) => {
      const seconds = dt.getSeconds();
      return seconds < 10 ? `0${seconds}` : seconds;
    },
    W: (dt) => dt.getFullWeek(),
    w: (dt) => WEEK[dt.getWeek()],
    D: (dt) => dt.getDay(),
  };

  Object.defineProperty(Date.prototype, 'format', {
    // eslint-disable-next-line no-unused-vars
    value(str = 'Y-m-d H:i:s', time = this) {
      if (/^\d+$/.test(str)) {
        time = new Date(str);
        str = 'Y-m-d H:i:s';
      }
      let i;
      for (i in REG) {
        str = str.replace(new RegExp(i, 'g'), REG[i](time));
      }
      return str;
    },
    enumerable: false,
  });
}
