var helper = require('../helper');
var gorilla = require('gorillascript');
var through = require('through');

function compile(file, src, callback) {
  var onFailure = function(err){
    if (err) {
      callback(new helper.ParseError(err, src, file));
    }
  };
  var onSuccess = function(data){
      callback(null, data.code);
  };

  gorilla.compile(src, {bare: true}).then(onSuccess,onFailure);
}

function gorillaify(file) {
  if (!helper.isGorilla(file)) { return through(); }

  var write = function(buf) {
    data += buf;
  };

  var end = function() {
    compile(file, data, function(error, result) {
      if (error) { stream.emit('error', error); }
      stream.queue(result);
      stream.queue(null);
    });
  };

  var data = '', stream = through(write, end);

  return stream;

}

gorillaify.compile = compile;
gorillaify.isGorilla = helper.isGorilla;

module.exports = gorillaify;
