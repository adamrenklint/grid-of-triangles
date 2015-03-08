var _ = require('lodash');
var triangle = require('./triangle');
var food = require('./food');
var danger = require('./danger');
var spawn = require('./spawn');

function world (grid, clock, populationSize) {

  var population = [];
  var foods = [];
  var dangers = [];
  var maxFood = populationSize * 2;
  var maxDangers = populationSize;
  var minGeneration, maxGeneration, averageFoodEaten, maxFoodEaten, averageDaysAlive, maxDaysAlive;

  while (population.length < populationSize) {
    population.push(grid.setRandom(triangle(grid)));
  }

  var _danger;
  
  var startCenter = (grid.width / 2) - 2;
  var endCenter = grid.width - startCenter;
  var centerX = startCenter;
  var centerY;

  while (centerX < endCenter) {
    centerY = startCenter;
    while (centerY < endCenter) {
      _danger = danger();
      _danger.kill = kill;
      dangers.push(_danger);
      grid.set(centerX, centerY, _danger);
      centerY++;
    }
    centerX++;
  }
  
  while (dangers.length < maxDangers) {
    _danger = grid.setRandom(danger());
    _danger.kill = kill;
    dangers.push(_danger);
  }

  function kill (triangle) {
    if (triangle.type === 'TRIANGLE') {
      var pool = population.slice();
      population = _.without(population, triangle);
      grid.unset(triangle.x, triangle.y);
      triangle.dead = true;
      // console.log('kill');
      // console.log(triangle.foodsEaten > averageFoodEaten, triangle.foodsEaten,  averageFoodEaten)
      if (triangle.foodsEaten > averageFoodEaten || population.length < populationSize) {
        spawn(pool, population, grid);
      }
    }
  }

  function eat (from, to) {
    to.health += from.energy;
    to.foodsEaten++;
    foods = _.without(foods, from);
    grid.set(from.x, from.y, to);
    // console.log('eat', to.id, to.foodsEaten, to.health)
  }

  function updateFood () {
    var _food;
    while (foods.length <= maxFood) {
      _food = grid.setRandom(food());
      _food.eat = eat.bind(null, _food);
      foods.push(_food);
    }
  }

  clock.listen(function (now) {
    maxFood = population.length * 3;
    updateFood();
    minGeneration = maxGeneration = 0;
    population.forEach(function (triangle) {
      if (!triangle.moved) {
        triangle.moving = true;
        triangle.move();
        triangle.moving = false;
        triangle.moved = true;
      }
    });
    population.forEach(function (triangle) {
      if (triangle.health < 1) {
        kill(triangle);
      }
      triangle.moved = false;
    });
    maxFoodEaten = 0;
    maxDaysAlive = 0;
    var totalFoodsEaten = 0;
    var totalDaysAlive = 0;
    population.forEach(function (triangle) {
      if (!minGeneration || triangle.generation < minGeneration) {
        minGeneration = triangle.generation;
      }
      if (!maxGeneration || triangle.generation > maxGeneration) {
        maxGeneration = triangle.generation;
      }
      if (triangle.foodsEaten > maxFoodEaten) {
        maxFoodEaten = triangle.foodsEaten;
      }
      totalFoodsEaten += triangle.foodsEaten;
      if (triangle.daysAlive > maxDaysAlive) {
        maxDaysAlive = triangle.daysAlive;
      }
      totalDaysAlive += triangle.daysAlive;
    });
    averageFoodEaten = totalFoodsEaten / population.length;
    averageDaysAlive = Math.round(totalDaysAlive / population.length);
  });

  function all () {
    return [].concat(population, foods, dangers);
  }

  function triangles () {
    return population;
  }

  function stats () {
    return {
      'minGeneration': minGeneration,
      'maxGeneration': maxGeneration,
      'maxFoodEaten': maxFoodEaten,
      'averageFoodEaten': averageFoodEaten,
      'maxDaysAlive': maxDaysAlive,
      'averageDaysAlive': averageDaysAlive
    }
  }

  return {
    'all': all,
    'stats': stats,
    'triangles': triangles
  };
}

module.exports = world;