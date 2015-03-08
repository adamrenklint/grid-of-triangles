var _ = require('lodash');
var dna = require('./dna');
var _id = 0;

function triangle (grid) {

  var directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

  function randomDirection () {
    var index =  _.random(directions.length - 1);
    return directions[index];
  }

  var self = {
    'id': ++_id,
    'generation': 1,
    'type': 'TRIANGLE',
    'direction': randomDirection(),
    'dna': dna(),
    'fillStyle': '#00f',
    'x': 0,
    'y': 0,
    'health': 100,
    'foodsEaten': 0,
    'daysAlive': 0,
    'moves': 0
  };

  function relative (direction) {
    return '*';
    // if (self.direction === 'UP')
  }

  function sense (watcher, relation, x, y) {
    if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) return '#';
    var current = grid.get(x, y);
    // TODO: the direction needs to be relative to self/triangle!
    if (current && current.type) {
      if (current.direction) {

        var code = watcher.direction + ':' + relation + ':' + current.direction;
        return code;
        // var view;
        
        // switch (code) {
        //   case 'DOWN:LEFT:LEFT':
        //     view = '>';
        //     break;
        //   case 'LEFT:LEFT:LEFT':
        //     view = '<';
        //     break;
        //   case 'UP:FRONT:DOWN':
        //     view = 'v';
        //     break;
        //   case 'x':
        //     view = '^';
        //     break;
        // }

        // if (!view && current.x < 10 && current.y < 10) {
        //   console.log(code, watcher.x, watcher.y, current.x, current.y);
        //   debugger;
        // }
        // return view;
      }
      else {
        return current.type;
      }
    }
    return current;
  }

  function sensors () {
    var input = [null, null, null];
    var left = self.x - 1;
    var right = self.x + 1;
    var up = self.y - 1;
    var down = self.y + 1;
    if (self.direction === 'UP') {
      input[0] = sense(self, 'LEFT', left, self.y);
      input[1] = sense(self, 'FRONT', self.x, up);
      input[2] = sense(self, 'RIGHT', right, self.y);
    }
    else if (self.direction === 'RIGHT') {
      input[0] = sense(self, 'LEFT', self.x, up);
      input[1] = sense(self, 'FRONT', right, self.y);
      input[2] = sense(self, 'RIGHT', self.x, down);
    }
    else if (self.direction === 'DOWN') {
      input[0] = sense(self, 'LEFT', right, self.y);
      input[1] = sense(self, 'FRONT', self.x, down);
      input[2] = sense(self, 'RIGHT', left, self.y);
    }
    else if (self.direction === 'LEFT') {
      input[0] = sense(self, 'LEFT', self.x, down);
      input[1] = sense(self, 'FRONT', left, self.y);
      input[2] = sense(self, 'RIGHT', self.x, up);
    }
    return input;
  }

  self.move = function move () {
    var direction = self.direction;
    var input = sensors();
    var next = self.dna(input);
    // console.log('SEE:', self.id, input, next);
    var next_x = self.x;
    var next_y = self.y;
    ++self.daysAlive;
    self.health += -1;
    if (next === 'FORWARD' && direction === 'UP' || next === 'BACK' && direction === 'DOWN') {
      next_y += -1;
      // console.log('moving up')
    }
    else if (next === 'FORWARD' && direction === 'DOWN' || next === 'BACK' && direction === 'UP') {
      next_y += 1;
    }
    else if (next === 'FORWARD' && direction === 'LEFT' || next === 'BACK' && direction === 'RIGHT') {
      next_x += -1;
    }
    else if (next === 'BACK' && direction === 'LEFT' || next === 'FORWARD' && direction === 'RIGHT') {
      next_x += 1;
    }
    else if (next === 'TURN_LEFT' && direction === 'UP' || next === 'TURN_RIGHT' && direction === 'DOWN') {
      self.direction = 'LEFT';
      // self.health += -1;
    }
    else if (next === 'TURN_RIGHT' && direction === 'UP' || next === 'TURN_LEFT' && direction === 'DOWN') {
      self.direction = 'RIGHT';
      // self.health += -1;
    }
    else if (next === 'TURN_RIGHT' && direction === 'LEFT' || next === 'TURN_LEFT' && direction === 'RIGHT') {
      self.direction = 'UP';
      // self.health += -1;
    }
    else if (next === 'TURN_LEFT' && direction === 'LEFT' || next === 'TURN_RIGHT' && direction === 'RIGHT') {
      self.direction = 'DOWN';
      // self.health += -1;
    }

    if (next_x < 0) next_x = 0;
    if (next_x >= grid.width) next_x = 49;
    if (next_y < 0) next_y = 0;
    if (next_y >= grid.height) next_y = 49;

    if (next_x !== self.x || next_y !== self.y) {

      var current = grid.get(next_x, next_y);
      if (current && current.type === 'TRIANGLE' && !current.moved && !current.moving) {
        // console.log('current', current)
      
        current.moving = true;
        current.move();
      }
      current = grid.get(next_x, next_y);
      if (!current || current.id === self.id) {
        grid.unset(self.x, self.y);
        grid.set(next_x, next_y, self);
        self.moves++;
      }
      else if (current.type === 'FOOD') {
        self.moves++;
        current.eat(self);
        //TODO: if moving backwards, not possible to eat!
      }
      else if (current.type === 'DANGER') {
        self.moves++;
        current.kill(self);
      }
      else if (window.debug === self.id) {
        // console.warn('move not possible', self.id, current.id, current.type);
        debugger;
      }
      // else {
      //   self.health += -5;
      // }
      // if another triangle is in the spot, did they move: if not, make them
      // is next_x or next_y a legal move? if not, stay
    }
    
    self.moving = false;
    self.moved = true;
  }

  return self;
}

module.exports = triangle;