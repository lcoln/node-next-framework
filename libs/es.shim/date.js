/**
 * []
 * @authors linteng (875482941@qq.com)
 * @date    2018-09-17 18:17:45
 */
/* eslint no-extend-native: ["error", { "exceptions": ["Date"] }] */
'use strict'

if (!Date.prototype.getFullWeek) {
  Object.defineProperty(Date.prototype, 'getFullWeek', {
    value: function () {
      let thisYear = this.getFullYear()
      let that = new Date(thisYear, 0, 1)
      let firstDay = that.getDay()
      let numsOfToday = (this - that) / 24 / 360 / 1000
      return Math.ceil((numsOfToday + firstDay) / 7)
    },
    enumerable: false
  })
}

if (!Date.prototype.getWeek) {
  Object.defineProperty(Date.prototype, 'getWeek', {
    value: function () {
      let today = this.getDate()
      let year = this.getFullYear()
      let month = this.getMonth()
      let firstDay = new Date(year, month, 1).getDay()
      return Math.ceil((today + firstDay) / 7)
    },
    enumerable: false
  })
}

if (!Date.prototype.format) {
  Object.defineProperty(Date.prototype, 'format', {
    value: function (str = 'Y-m-d H:i:s', time = this) {
      if (/^\d+$/.test(str)) {
        time = str
        str = 'Y-m-d H:i:s'
      }
      let now = new Date(time)

      let week = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']

      let dt = {
        fullyear: now.getFullYear(),
        year: now.getYear(),
        fullweek: now.getFullWeek(),
        month: now.getMonth() + 1,
        week: week[now.getWeek()],
        date: now.getDate(),
        day: now.getDay(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
      }
      let reg = null

      dt.g = dt.hours > 12 ? dt.hours - 12 : dt.hours

      reg = {
        Y: dt.fullyear,
        y: dt.year,
        m: dt.month < 10 ? '0' + dt.month : dt.month,
        n: dt.month,
        d: dt.date < 10 ? '0' + dt.date : dt.date,
        j: dt.date,
        H: dt.hours < 10 ? '0' + dt.hours : dt.hours,
        h: dt.g < 10 ? '0' + dt.g : dt.g,
        G: dt.hours,
        g: dt.g,
        i: dt.minutes < 10 ? '0' + dt.minutes : dt.minutes,
        s: dt.seconds < 10 ? '0' + dt.seconds : dt.seconds,
        W: dt.fullweek,
        w: dt.week,
        D: dt.day
      }
      for (let i in reg) {
        str = str.replace(new RegExp(i, 'g'), reg[i])
      }
      return str
    },
    enumerable: false
  })
}
