function draw (map, element, clock, world) {

  var width = element[0].width = element.width();
  var height = element[0].height = element.height();
  var context = element[0].getContext('2d');
  var do_continue = true;
  var cellSize = element.width() / map.width;

  function drawObject (object) {
    context.fillStyle = object.fillStyle;
    var left = object.x * cellSize;
    var top = object.y * cellSize;
    if (object.type === 'TRIANGLE') {
      context.beginPath();
      if (object.direction === 'LEFT') {
        context.moveTo(left + cellSize, top);
        context.lineTo(left, top + (cellSize / 2));
        context.lineTo(left + cellSize, top + cellSize);
      }
      else if (object.direction === 'UP') {
        context.moveTo(left, top + cellSize);
        context.lineTo(left + (cellSize / 2), top);
        context.lineTo(left + cellSize, top + cellSize);
      }
      else if (object.direction === 'RIGHT') {
        context.moveTo(left, top);
        context.lineTo(left + cellSize, top + (cellSize / 2));
        context.lineTo(left, top + cellSize);
      }
      else if (object.direction === 'DOWN') {
        context.moveTo(left + cellSize, top);
        context.lineTo(left + (cellSize / 2), top + cellSize);
        context.lineTo(left, top);
      }
      context.fill();
    }
    else if (object.type === 'FOOD') {
      context.fillRect(left, top, cellSize, cellSize);
    }
    else if (object.type === 'DANGER') {
      context.fillRect(left, top, cellSize, cellSize);
    }
  }
  
  function next () {

    context.clearRect(0, 0, element.width(), element.height());

    map.cols.forEach(function (rows, x) {
      rows.forEach(function (value, y) {
        var evenCol = x % 2 === 0;
        var evenRow = y % 2 === 0;
        var lowOpacity = 0.2;
        var highOpacity = 0.3;
        var opacity = lowOpacity;
        if (evenCol && !evenRow || evenRow && !evenCol) {
          opacity = highOpacity;
        }
        context.fillStyle = 'rgba(0, 0, 0, ' + opacity.toString() + ')';
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      });
    });

    world.all().forEach(drawObject);

    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.font = '20px arial';
    var now = clock.now();
    var timestamp = 'year ' + now.year + ' day ' + now.day;
    // var timestamp = 'generation 1, tick 123'
    context.fillText(timestamp, 10, 25);

    var stats = world.stats();
    var generationText = 'gen ' + stats.minGeneration;
    if (stats.maxGeneration !== stats.minGeneration) {
      generationText += '-' + stats.maxGeneration;
    }
    context.fillText(generationText, 10, 50);

    context.fillText('pop ' + world.triangles().length, 10, 75);

    var foodText = 'food avg ' + stats.averageFoodEaten.toFixed(2) + ' max ' + stats.maxFoodEaten;
    context.fillText(foodText, 10, height - 40);

    var lifecycleText = 'alive avg ' + stats.averageDaysAlive + ' max ' + stats.maxDaysAlive;
    context.fillText(lifecycleText, 10, height - 15);

    if (do_continue) window.requestAnimationFrame(next);
  }

  next();

  return function stop () { do_continue = false; };
}

module.exports = draw;