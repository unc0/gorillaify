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

exports.isGorilla = isGorilla;
exports.ParseError = ParseError;
