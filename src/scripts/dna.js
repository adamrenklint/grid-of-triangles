var _ = require('lodash');

function dna () {

  var genes = {};
  var outputs = ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT'];

  function makeGene (input) {
    var options = outputs.slice();
    var index =  _.random(options.length - 1);
    var output = options[index];
    if (!isLegal(input, output)) return makeGene(input);
    return output;
  }

  function isLegal (input, output) { 
    if (output === 'FORWARD' && input[1] === '#') return false;
    return true;
  }

  return function (input, output) {
    if (!input) return genes;
    if (output) genes[input] = output;
    if (!genes[input]) genes[input] = makeGene(input);
    return genes[input];
  }
}

module.exports = dna;