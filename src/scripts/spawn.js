var _ = require('lodash');
var triangle = require('./triangle');

function fitness (individual) {
  return individual.foodsEaten;
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
  var midTier = sorted.slice(0, Math.floor(sorted.length / 2));
  // console.log(_.pluck(sorted, 'fitness'));
  // console.log(_.pluck(topTier, 'fitness'));
  // console.log(_.pluck(midTier, 'fitness'));
  var all = [];
  _.times(5, function () {
    all = all.concat(topTier)
  });
  _.times(1, function () {
    all = all.concat(midTier)
  });
  all = _.shuffle(all);
  // console.log(all);
  // var qualified = _.filter(pool, function (individual) {
  //   return individual.fitness >= average;
  // });
  // var all = pool.slice();
  // var ratio = 10;
  // for (var i = 0; i < ratio; i++) {
  //   all = all.concat(qualified);
  // }
  
  var first = _.random(all.length - 1);
  var second = _.random(all.length - 1);

  first = all[first];
  second = all[second];

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
  // console.log(alphaGenes, betaGenes)
  // don't make it so fucking complicated!!!

  // var firstKeys = alphaKeys.slice(0, cutoff).concat(betaKeys.slice(cutoff, betaKeys.length));
  // var secondKeys = betaKeys.slice(0, cutoff).concat(alphaKeys.slice(cutoff, alphaKeys.length));

  // firstKeys.forEach(function (key) {
  //   console.log(key, alpha[key]);
  // });

  
  // console.log(cutoff, Object.keys(parents[0].dna()).length)
  // _.forEach(, function (value, key) {
  //   console.log(value, key);
  // })
  // console.log(parents)
  return [first, second];
}

function mutate () {

}


function spawn (pool, population, grid) {
  var parents = select(pool);
  var offsprings = crossover(parents, grid);
  offsprings.forEach(function (individual) {
    mutate(individual);
    population.push(individual);
    grid.setRandom(individual);
    // console.log('added', individual);
  });
  // debugger;
}

module.exports = spawn;