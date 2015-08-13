/**
 * forof 1.0.0
 * https://github.com/zloirock/forof
 * License: http://rock.mit-license.org
 * © 2015 Denis Pushkarev
 */
!function(undefined){
  'use strict';

  var global = typeof self != 'undefined' && self.Math == Math ? self : Function('return this')()
    , toString    = {}.toString
    , SHARED      = '__core-js_shared__'
    , FF_ITERATOR = '@@iterator';

  function getSymbolIterator(){
    var shared = global[SHARED]
      , wks    = shared && shared.wks;
    return global.Symbol && Symbol.iterator || wks && wks.iterator || FF_ITERATOR;
  }

  function getIterator(it){
    var shared  = global[SHARED];
    var getIter = it[getSymbolIterator()]
      || it[FF_ITERATOR]
      || shared && shared.iterators && shared.iterators[toString.call(it).slice(8, -1)];
    if(typeof getIter != 'function')throw TypeError(it + ' is not iterable!');
    return assertObject(getIter.call(it));
  }

  function assertObject(it){
    if(it != null && (typeof it == 'object' || typeof it == 'function'))return it;
    throw TypeError(it + ' is not an object!');
  }

  function ctx(fn, that, length){
    return that === undefined ? fn : function(a, b){
      return length == 1 ? fn.call(that, a) : fn.call(that, a, b);
    };
  }

  function close(iterator){
    var ret = iterator['return'];
    if(ret !== undefined)assertObject(ret.call(iterator));
  }

  function call(iterator, fn, value, entries){
    try {
      return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
    } catch(e){
      close(iterator);
      throw e;
    }
  }

  function forOf(iterable, entries, fn, that){
    var iterator = getIterator(iterable)
      , f        = ctx(fn, that, entries ? 2 : 1)
      , step;
    while(!(step = iterator.next()).done){
      if(call(iterator, f, step.value, entries) === false)return close(iterator);
    }
  }

  function $for(iterable, entries){
    if(!(this instanceof $for))return new $for(iterable, entries);
    this._iter    = getIterator(iterable);
    this._entries = !!entries;
  }
  var $forProto = $for.prototype;
  $forProto[getSymbolIterator()] = $forProto[FF_ITERATOR] = function(){
    return this._iter; // unwrap
  };
  $forProto.next = function(){
    return this._iter.next();
  };

  function createChainIterator(next){
    function Iterator(iter, fn, that){
      this._iter    = getIterator(iter);
      this._entries = iter._entries;
      this._fn      = ctx(fn, that, iter._entries ? 2 : 1);
    }
    function Empty(){}
    Empty.prototype = $forProto;
    var proto = Iterator.prototype = new Empty;
    proto[getSymbolIterator()] = proto[FF_ITERATOR] = function(){
      return this;
    };
    proto.next = next;
    return Iterator;
  }

  var MapIter = createChainIterator(function(){
    var step = this._iter.next();
    return step.done ? step
      : {done: false, value: call(this._iter, this._fn, step.value, this._entries)};
  });

  var FilterIter = createChainIterator(function(){
    for(;;){
      var step = this._iter.next();
      if(step.done || call(this._iter, this._fn, step.value, this._entries))return step;
    }
  });

  $forProto.of = function(fn, that){
    forOf(this, this._entries, fn, that);
  };
  $forProto.array = function(fn, that){
    var result = [];
    forOf(fn != undefined ? this.map(fn, that) : this, false, result.push, result);
    return result;
  };
  $forProto.filter = function(fn, that){
    return new FilterIter(this, fn, that);
  };
  $forProto.map = function(fn, that){
    return new MapIter(this, fn, that);
  };

  /* eslint-disable no-undef */
  // CommonJS export
  if(typeof module != 'undefined' && module.exports)module.exports = $for;
  // RequireJS export
  else if(typeof define == 'function' && define.amd)define(function(){ return $for; });
  // Export to global object
  else global.$for = $for;
}();