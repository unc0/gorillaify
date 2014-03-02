var gorilla = require('gorillascript');
var through = require('through');
var tmp = require('tmp');
tmp.setGracefulCleanup();
var convert = require('convert-source-map');
var fs = require('fs');
var path = require('path');

function isGorilla (file) {
  return (/\.gs$/).test(file);
}

function ParseError(error, src, file) {
  /* Creates a ParseError from a Gorilascript SyntaxError
   modeled after substack's syntax-error module */
  SyntaxError.call(this);

  this.message = error.message;

  this.line = error.line;
  this.column = error.column;

  this.annotated = [
    file + ':' + this.line,
    src.split('\n')[this.line - 1],
    new Array(this.column).join(' ') + '^',
    'ParseError: ' + this.message
  ].join('\n');
}

ParseError.prototype = Object.create(SyntaxError.prototype);

ParseError.prototype.toString = function () {
  return this.annotated;
};

ParseError.prototype.inspect = function () {
  return this.annotated;
};

function compile(file, src, callback) {
  var onFailure = function(err){
    if (err) {
      callback(new ParseError(err, src, file));
    }
  };
  // gorillascript cannot produce source map in stream way
  tmp.dir({mode: 0750, prefix: 'gorillaify-pain-in-the-ass_'}, function(err, tmpdir){
    var opt = {
      sourceMap: path.join(tmpdir, 'pita.map'),
      output: path.join(tmpdir, 'pita.js'),
      input: file
      // bare: true // XXX if you uncomment this, gorillascript's prelude code
                    //     will mix together, then browserify will crash...
    };
    var onSuccess = function(){
      fs.readFile(opt.output, 'utf8', function(err, data){
        if (err) { throw err; }
        var map = convert.fromMapFileSource(data, tmpdir);
        map.setProperty('sources', [file]);
        map.setProperty('file', file);
        map.setProperty('sourceRoot', "");
        map.setProperty('sourcesContent', [src]);

        callback(null, convert.removeComments(data) + '\n' + map.toComment());
        fs.unlink(opt.sourceMap);
        fs.unlink(opt.output);
      });
    };
    gorilla.compileFile(opt).then(onSuccess,onFailure);
  });
}

function gorillaify(file) {
  if (!isGorilla(file)) { return through(); }

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
gorillaify.isGorilla = isGorilla;

module.exports = gorillaify;
