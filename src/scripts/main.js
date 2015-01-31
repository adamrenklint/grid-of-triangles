var $ = require('jquery');
var grid = require('./grid');
var draw = require('./draw');
var clock = require('./clock');
var world = require('./world');

$(function () {

  var $grid = $('#grid');
  var $fitnessGraph = $('#fitness-graph');

  var _grid = grid(50, 50);
  var _clock = clock(25);
  var _world = world(_grid, _clock, 50);
  
  _clock.start();
  draw(_grid, $grid, _clock, _world);
});