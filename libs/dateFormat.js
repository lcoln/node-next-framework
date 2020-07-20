'use strict';

function getFullWeek(now) {
  const thisYear = now.getFullYear();
  const that = new Date(thisYear, 0, 1);
  const firstDay = that.getDay();
  const numsOfToday = (now - that) / 24 / 360 / 1000;
  return Math.ceil((numsOfToday + firstDay) / 7);
}

function getWeek(now) {
  const today = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  return Math.ceil((today + firstDay) / 7);
}

function dateFormat(time = Date.now(), str = 'Y-m-d H:i:s') {
  // console.log({time, str})
  if (isNaN(time - 0) && /[^\d]/.test(time)) {
    if (isNaN(new Date(time).getTime())) {
      str = time;
      time = Date.now();
    } else {
      time = new Date(time).getTime();
    }
  }

  const now = new Date(time);

  const week = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

  const dt = {
    fullyear: now.getFullYear(),
    year: now.getYear(),
    fullweek: getFullWeek(now),
    month: now.getMonth() + 1,
    week: week[getWeek(now)],
    date: now.getDate(),
    day: now.getDay(),
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    getMilliseconds: now.getMilliseconds(),
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
    S: dt.getMilliseconds < 10 ? `00${dt.getMilliseconds}` : dt.getMilliseconds < 100 ? `0${dt.getMilliseconds}` : dt.getMilliseconds,
    W: dt.fullweek,
    w: dt.week,
    D: dt.day,
  };
  for (const i in reg) {
    str = str.replace(new RegExp(i, 'g'), reg[i]);
  }
  return str;
}
dateFormat.timeTransform = function (time, mode, format = 'i') {
  if (isNaN(time - 0)) {
    time = new Date(time);
  }
  // 将`${h}:${m}:${s}`格式的数据还原为时间戳
  if (mode === 'restore') {
    time += '';
    if (time.match(/:/g).length !== 2) { return time; }
    time = time.split(':').map((v) => v -= 0);
    return time[0] * 60 + time[1] + time[2] / 60;
  }
  // 按时间戳换算为`${h}:${m}:${s}`格式的数据
  if (format === 'i') {
    let h = Math.floor(time / 60 / 60 / 1000);
    const i = (time - h * 60 * 60 * 1000) / 1000 / 60;
    h = h >= 1 ? (h < 10 ? `0${h}` : `${h}`) : '00';
    let m = Math.floor(i);
    m = m < 10 ? `0${m}` : `${m}`;
    let s = (i - m).toFixed();
    s = s < 10 ? `0${s}` : `${s}`;
    return `${h}:${m}:${s}`;
  }
  return time;
};

dateFormat.timeRankBy = function (time) {
  const currTime = dateFormat(time, 'Y/m/d');
  return [new Date(`${currTime} 0:0:0`).getTime(), new Date(`${currTime} 23:59:59`).getTime()];
};

dateFormat.getWeekType = function (v) {
  // console.log(dateFormat(v))
  const day = new Date(dateFormat(v)).getDay();
  return day == '0' ? '周日' : day == '6' ? '周六' : '';
};

module.exports = dateFormat;
