var test      =  require('tap').test;
var fs        =  require('fs');
var path      =  require('path');
var through   =  require('through');
var convert   =  require('convert-source-map');
var transform =  require('../no-debug');

test('transform does not add sourcemap comment', function (t) {
    t.plan(1);
    var data = '';

    var file = path.join(__dirname, '../example/foo.gs');

    var write = function(buf) { data += buf; };
    var end = function() {
        t.notOk(convert.fromSource(data), 'no-debug transform should not add sourcemap');

    };

    fs.createReadStream(file)
        .pipe(transform(file))
        .pipe(through(write, end));

});
