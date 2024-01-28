var guid = 0;

var checking = {};
var types = {
  nano: 1,
  micro: 1000,
  milli: 1000 * 1000 // actually, sod off and use setInterval for real
};

function clearIntervalMs(id) {
  if (checking[id]) {
    delete checking[id]; // next tick won't get set
  }
}

function setIntervalMs(fn, type, delay) {
  var id = ++guid;
  var start = process.hrtime();
  delay *= types[type];

  checking[id] = true;

  var check = function () {
    if (checking[id]) {
      var diff = process.hrtime(start);
      if (diff[1] > delay) {
        fn();
        start[0] = start[0] + diff[0];
        start[1] = start[1] + diff[1];
      } 
      process.nextTick(check);      
    }
  };

  process.nextTick(check);
  return id;
}

module.exports = {setIntervalMs, clearIntervalMs };

/*
var start = process.hrtime();
setIntervalMs(function () {
  var end = process.hrtime(start);
  console.log('after 400 miscroseconds', end[1]/1000%400);
}, 'micro', 400);
*/