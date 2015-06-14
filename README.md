# forof
Work with iterators from ES5 / ES3 syntax. Equals of `for-of` loop and array / generator comprehensions. Extracted from [core-js](https://github.com/zloirock/core-js). Does not contains polyfills of collections and standard iterators, if you need it - use `core-js`.

[development version](https://raw.githack.com/zloirock/forof/master/index.js), [production version](https://raw.githack.com/zloirock/forof/master/forof.min.js)

[![NPM](https://nodei.co/npm/forof.png?downloads=true)](https://www.npmjs.org/package/forof/) [![Build Status](https://travis-ci.org/zloirock/forof.png)](https://travis-ci.org/zloirock/forof)

```javascript
$for(iterable, entries) -> iterator ($for)
  #of(fn(value, key?), that) -> void
  #array(mapFn(value, key?)?, that) -> array
  #filter(fn(value, key?), that) -> iterator ($for)
  #map(fn(value, key?), that) -> iterator ($for)
```
[Examples](http://goo.gl/Jtz0oG):
```javascript
var $for = require('forof'); // with a modular system, otherwise use global `$for`

$for(new Set([1, 2, 3, 2, 1])).of(function(it){
  log(it); // => 1, 2, 3
});

$for([1, 2, 3].entries(), true).of(function(key, value){
  log(key);   // => 0, 1, 2
  log(value); // => 1, 2, 3
});

$for('abc').of(console.log, console); // => 'a', 'b', 'c'

$for([1, 2, 3, 4, 5]).of(function(it){
  log(it); // => 1, 2, 3
  if(it == 3)return false;
});

var ar1 = $for([1, 2, 3]).array(function(v){
  return v * v;
}); // => [1, 4, 9]

var set = new Set([1, 2, 3, 2, 1]);
var ar1 = $for(set).filter(function(v){
  return v % 2;
}).array(function(v){
  return v * v;
}); // => [1, 9]

var iter = $for(set).filter(function(v){
  return v % 2;
}).map(function(v){
  return v * v;
});
iter.next(); // => {value: 1, done: false}
iter.next(); // => {value: 9, done: false}
iter.next(); // => {value: undefined, done: true}

var map1 = new Map([['a', 1], ['b', 2], ['c', 3]]);
var map2 = new Map($for(map1, true).filter(function(k, v){
  return v % 2;
}).map(function(k, v){
  return [k + k, v * v];
})); // => Map {aa: 1, cc: 9}
```
## Changelog
##### 1.0.0 - 2015.06.14
  * publish