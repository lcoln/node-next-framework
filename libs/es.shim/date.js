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
  Object.defineProperty(Date.prototype, 'format', {
    value(str = 'Y-m-d H:i:s', time = this) {
      if (/^\d+$/.test(str)) {
        time = str;
        str = 'Y-m-d H:i:s';
      }
      const now = new Date(time);

      const week = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

      const dt = {
        fullyear: now.getFullYear(),
        year: now.getYear(),
        fullweek: now.getFullWeek(),
        month: now.getMonth() + 1,
        week: week[now.getWeek()],
        date: now.getDate(),
        day: now.getDay(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      };
      let reg = null;

      dt.g = dt.hours > 12 ? dt.hours - 12 : dt.hours;

      reg = {
        Y: dt.fullyear,
        y: dt.year,
        m: dt.month < 10 ? `0${dt.month}` : dt.month,
        n: dt.month,
        d: dt.date < 10 ? `0${dt.date}` : dt.date,
        j: dt.date,
        H: dt.hours < 10 ? `0${dt.hours}` : dt.hours,
        h: dt.g < 10 ? `0${dt.g}` : dt.g,
        G: dt.hours,
        g: dt.g,
        i: dt.minutes < 10 ? `0${dt.minutes}` : dt.minutes,
        s: dt.seconds < 10 ? `0${dt.seconds}` : dt.seconds,
        W: dt.fullweek,
        w: dt.week,
        D: dt.day,
      };
      let i;
      for (i in reg) {
        str = str.replace(new RegExp(i, 'g'), reg[i]);
      }
      return str;
    },
    enumerable: false,
  });
}
