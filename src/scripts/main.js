var $ = require('jquery');
var grid = require('./grid');
var draw = require('./draw');
var clock = require('./clock');
var world = require('./world');
var graphs = require('./graphs');

$(function () {

  var $grid = $('#grid');
  var $graphs = $('#graphs');

  var _grid = grid(50, 50);
  var _clock = clock(1);
  var _world = world(_grid, _clock, 50);
  window.grid = _grid;
  
  _clock.start();
  draw(_grid, $grid, _clock, _world);
  graphs(world, $graphs)
});