gorillaify
==========

browserify v2 plugin for gorillascript

mix and match `.gs`[gorillascript](http://ckknight.github.io/gorillascript) and `.js` files in the same project

*This is a mod from [coffeeify](https://github.com/jnordberg/coffeeify)*

[![Build Status](https://travis-ci.org/unc0/gorillaify.png?branch=master)](https://travis-ci.org/unc0/gorillaify)

# example

given some files written in a mix of `js` and `gorilla`:

foo.gs

``` gorillascript
console.log require './bar.js'
```

bar.js:

``` js
module.exports = require('./baz.gs')(5)
```

baz.gs:

``` gorillascript
module.exports := #(n)-> n * 111
```

install gorillaify into your app:

```
$ npm install gorillaify --save-dev
```

when you compile your app, just pass `-t gorillaify` to browserify:

```
$ browserify -t gorillaify foo.gs > bundle.js
$ node bundle.js
555
```

you can omit the `.gs` extension from your requires if you add the extension to browserify's module extensions:

``` js
module.exports = require('./baz')(5)
```

```
$ browserify -t gorillaify --extension=".gs" foo.gs > bundle.js
$ node bundle.js
555
```

# install

With [npm](https://npmjs.org) do:

```
npm install gorillaify
```

# license

MIT
