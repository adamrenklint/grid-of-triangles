function graphs (world, element) {

  var width = element[0].width = element.width();
  var height = element[0].height = element.height();
  var context = element[0].getContext('2d');

  var do_continue = true;

  function draw () {

    if (do_continue) window.requestAnimationFrame(draw);
  }

  draw();

  return function stop () { do_continue = false; };
}

module.exports = graphs;