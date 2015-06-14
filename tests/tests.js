var date = new Date(1, 2, 3, 4, 5, 6, 7);
function isFunction(it){
  return {}.toString.call(it).slice(8, -1) === 'Function';
}

var toString$ = {}.toString
  , shared    = window['__core-js_shared__']
  , wks       = shared && shared.wks
  , ITERATOR  = window.Symbol && Symbol.iterator || (wks && wks.iterator) || '@@iterator' 

function from(it){
  var array = [], entry;
  while(!(entry = it.next()).done)array.push(entry.value);
  return array;
}

test('$for', function(){
  var set, iter;
  ok(typeof $for === 'function', 'Is function');
  ok(ITERATOR in $for.prototype || '@@iterator' in $for.prototype);
  set = new Set([1, 2, 3, 2, 1]);
  iter = $for(set);
  ok(iter instanceof $for);
  deepEqual([1, 2, 3], from(iter));
  deepEqual([1, 2, 3], from($for([1, 2, 3])));
});
test('$for#filter', function(){
  var set, iter, o;
  ok(typeof $for.prototype.filter === 'function', 'Is function');
  set = new Set([1, 2, 3, 2, 1]);
  iter = $for(set).filter((function(it){
    return it % 2;
  }));
  ok(iter instanceof $for);
  deepEqual([1, 3], from(iter));
  deepEqual([[1, 1], [3, 3]], from($for(new Set([1, 2, 3, 2, 1]).entries(), true).filter(function(k, v){
    return k % 2;
  })));
  $for([1]).filter(function(){
    return ok(this === o);
  }, o = {});
});
test('$for#map', function(){
  var set, iter, o;
  ok(typeof $for.prototype.map === 'function', 'Is function');
  set = new Set([1, 2, 3, 2, 1]);
  iter = $for(set).map((function(it){
    return it * 2;
  }));
  ok(iter instanceof $for);
  deepEqual([2, 4, 6], from(iter));
  deepEqual([[2, 1], [4, 4], [6, 9]], from($for(new Set([1, 2, 3, 2, 1]).entries(), true).map(function(k, v){
    return [k * 2, v * v];
  })));
  $for([1]).map(function(){
    return ok(this === o);
  }, o = {});
});
test('$for#array', function(){
  var set, o;
  ok(typeof $for.prototype.array === 'function', 'Is function');
  set = new Set([1, 2, 3, 2, 1]);
  deepEqual([[1, 1], [2, 2], [3, 3]], $for(set.entries()).array());
  deepEqual([2, 4, 6], $for(set).array((function(it){
    return it * 2;
  })));
  deepEqual([[2, 1], [4, 4], [6, 9]], $for(new Set([1, 2, 3, 2, 1]).entries(), true).array(function(k, v){
    return [k * 2, v * v];
  }));
  $for([1]).array(function(){
    return ok(this === o);
  }, o = {});
});
test('$for#of', function(){
  var set, counter1, string1, counter2, string2, o, done, iter;
  ok(typeof $for.prototype.of === 'function', 'Is function');
  set = new Set(['1', '2', '3', '2', '1']);
  counter1 = 0;
  string1 = '';
  $for(set).of(function(it){
    counter1++;
    string1 += it;
  });
  ok(counter1 === 3);
  ok(string1 === '123');
  counter2 = 0;
  string2 = '';
  $for(set.entries()).of(function(it){
    counter2++;
    string2 += it[0] + it[1];
  });
  ok(counter2 === 3);
  ok(string2 === '112233');
  $for(new Set([1]).entries(), true).of(function(key, val){
    ok(this === o);
    ok(key === 1);
    return ok(val === 1);
  }, o = {});
  done = true;
  iter = new Set([1, 2, 3, 2, 1]).values();
  iter['return'] = function(){
    done = false;
    return {
      done: true
    };
  };
  $for(iter).of(function(){});
  ok(done, '.return #default');
  done = false;
  iter = new Set([1, 2, 3, 2, 1]).values();
  iter['return'] = function(){
    done = true;
    return {
      done: true
    };
  };
  $for(iter).of(function(){
    return false;
  });
  ok(done, '.return #break');
  done = false;
  iter = new Set([1, 2, 3, 2, 1]).values();
  iter['return'] = function(){
    done = true;
    return {
      done: true
    };
  };
  try {
    $for(iter).of(function(){
      throw 42;
    });
  } catch (e$) {}
  ok(done, '.return #throw');
});
test('$for chaining', function(){
  deepEqual([2, 10], $for([1, 2, 3]).map((function(it){
    return Math.pow(it, 2);
  })).filter((function(it){
    return it % 2;
  })).map((function(it){
    return it + 1;
  })).array());
  deepEqual([[2, 1], [4, 9]], $for(new Set([1, 2, 3, 2, 1]).entries(), true).map(function(k, v){
    return [k, Math.pow(v, 2)];
  }).filter(function(k, v){
    return v % 2;
  }).map(function(k, v){
    return [k + 1, v];
  }).array());
});