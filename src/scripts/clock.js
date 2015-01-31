function clock (speed) {

  var running = false;
  var startTime = null;
  var listeners = [];

  var day = 0;
  var year = 1;
  var daysInYear = 365;

  function next () {
    if (running) {
      day++;
      if (day > daysInYear) {
        day = 1;
        year++;
      }
      listeners.forEach(function (listener) {
        listener(now());
      });
      setTimeout(next, speed);
    }
  }

  function listen (callback) {
    listeners.push(callback);
  }

  function start () {
    if (!running) {
      running = true;
      next();
    }
  }
  function stop () {
    running = false;
    startTime = null;
  }

  function setSpeed (newSpeed) {
    speed = newSpeed;
  }

  function now () {
    return { 'year': year, 'day': day };
  }

  return {
    'start': start,
    'stop': stop,
    'speed': setSpeed,
    'now': now,
    'listen': listen
  }
}

module.exports = clock;