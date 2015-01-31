function grid (width, height) {
  
  var cols = [];
  var rows;
  
  while (cols.length < width) {
    rows = [];
    while (rows.length < height) {
      rows.push(0);
    }
    cols.push(rows);
    rows = null;
  }

  function get (x, y) {
    return cols[x][y];
  }

  function set (x, y, target) {
    cols[target.x][target.y] = 0;
    target.x = x;
    target.y = y;
    cols[x][y] = target;
  }

  function setRandom (target) {
    var x = Math.floor(Math.random() * width);
    var y = Math.floor(Math.random() * height);
    var current = get(x, y);
    if (current) return setRandom(target);
    set(x, y, target);
    return target;
  }

  return {
    'set': set,
    'get': get,
    'width': width,
    'height': height,
    'cols': cols,
    'setRandom': setRandom
  };
}

module.exports = grid;