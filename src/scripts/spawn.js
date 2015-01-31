var _ = require('lodash');
var triangle = require('./triangle');

function fitness (individual) {
  // return individual.foodsEaten;
  return individual.foodsEaten * (individual.moves || 1);
}

function select (pool) {
  var total = _.reduce(pool, function (total, individual) {
    total = total || 0;
    var score = individual.fitness = fitness(individual);
    return total + score;
  }, 0);
  var average = total / pool.length;
  var all = [];
  var sorted = _.sortBy(pool, 'fitness').reverse();
  var topTier = sorted.slice(0, Math.floor(sorted.length / 10));
  var first = _.random(topTier.length - 1);
  var second = _.random(topTier.length - 1);

  first = topTier[first];
  second = topTier[second];

  if (first.id === second.id) return select(pool);
  return [first, second];
}

function crossover (parents, grid) {
  var first = triangle(grid);
  var second = triangle(grid);

  var alphaDna = parents[0].dna();
  var alphaGenes = Object.keys(alphaDna).map(function (input) {
    return {
      'input': input,
      'output': alphaDna[input]
    };
  });
  var betaDna = parents[1].dna();
  var betaGenes = Object.keys(betaDna).map(function (input) {
    return {
      'input': input,
      'output': betaDna[input]
    };
  });
  var cutoff = _.random(alphaGenes.length);

  alphaGenes.forEach(function (gene, index) {
    var target = index < cutoff ? first : second;
    target.dna(gene.input, gene.output);
  });
  betaGenes.forEach(function (gene, index) {
    var target = index < cutoff ? second : first;
    target.dna(gene.input, gene.output);
  });

  var parentGeneration = parents[0].generation > parents[1].generation ? parents[0].generation : parents[1].generation;
  first.generation = second.generation = (parentGeneration + 1);

  return [first, second];
}

function mutate (individual) {
  var outputs = ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT'];
  _.forEach(individual.dna(), function (output, input) {
    if (_.random(100) < 4) {
      var newOutput =  _.random(outputs.length - 1);
      individual.dna(input, newOutput);
    }
  });
}


function spawn (pool, population, grid) {
  var parents = select(pool);
  var offsprings = crossover(parents, grid);
  offsprings.forEach(function (individual) {
    mutate(individual);
    population.push(individual);
    grid.setRandom(individual);
  });
}

module.exports = spawn;