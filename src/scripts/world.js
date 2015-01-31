var _ = require('lodash');
var triangle = require('./triangle');
var food = require('./food');
var danger = require('./danger');
var spawn = require('./spawn');

function world (grid, clock, populationSize) {

  var population = [];
  var foods = [];
  var dangers = [];
  var maxFood = Math.floor(populationSize);
  var maxDangers = Math.floor(populationSize / 3);

  while (population.length < populationSize) {
    population.push(grid.setRandom(triangle(grid)));
  }

  var _danger;
  while (dangers.length < maxDangers) {
    _danger = grid.setRandom(danger());
    _danger.kill = kill;
    dangers.push(_danger);
  }

  function kill (triangle) {
    if (triangle.type === 'TRIANGLE') {
      var pool = population.slice();
      population = _.without(population, triangle);
      triangle.dead = true;
      // console.log('kill');
      if (population.length < populationSize) spawn(pool, population, grid);
    }
  }

  function eat (from, to) {
    to.health += from.energy;
    to.foodsEaten++;
    foods = _.without(foods, from);
    grid.set(from.x, from.y, to);
    console.log('eat', to.id, to.foodsEaten, to.health)
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
    updateFood();
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
  });

  function all () {
    return [].concat(population, foods, dangers);
  }

  return {
    'all': all
  };
}

module.exports = world;