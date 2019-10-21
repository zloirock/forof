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

QUnit.test('$for', function(assert){
  var set, iter;
  assert.ok(typeof $for === 'function', 'Is function');
  assert.ok(ITERATOR in $for.prototype || '@@iterator' in $for.prototype);
  set = new Set([1, 2, 3, 2, 1]);
  iter = $for(set);
  assert.ok(iter instanceof $for);
  assert.deepEqual([1, 2, 3], from(iter));
  assert.deepEqual([1, 2, 3], from($for([1, 2, 3])));
});
QUnit.test('$for#filter', function(assert){
  var set, iter, o;
  assert.ok(typeof $for.prototype.filter === 'function', 'Is function');
  set = new Set([1, 2, 3, 2, 1]);
  iter = $for(set).filter((function(it){
    return it % 2;
  }));
  assert.ok(iter instanceof $for);
  assert.deepEqual([1, 3], from(iter));
  assert.deepEqual([[1, 1], [3, 3]], from($for(new Set([1, 2, 3, 2, 1]).entries(), true).filter(function(k, v){
    return k % 2;
  })));
  $for([1]).filter(function(){
    return assert.ok(this === o);
  }, o = {});
});
QUnit.test('$for#map', function(assert){
  var set, iter, o;
  assert.ok(typeof $for.prototype.map === 'function', 'Is function');
  set = new Set([1, 2, 3, 2, 1]);
  iter = $for(set).map((function(it){
    return it * 2;
  }));
  assert.ok(iter instanceof $for);
  assert.deepEqual([2, 4, 6], from(iter));
  assert.deepEqual([[2, 1], [4, 4], [6, 9]], from($for(new Set([1, 2, 3, 2, 1]).entries(), true).map(function(k, v){
    return [k * 2, v * v];
  })));
  $for([1]).map(function(){
    return assert.ok(this === o);
  }, o = {});
});
QUnit.test('$for#array', function(assert){
  var set, o;
  assert.ok(typeof $for.prototype.array === 'function', 'Is function');
  set = new Set([1, 2, 3, 2, 1]);
  assert.deepEqual([[1, 1], [2, 2], [3, 3]], $for(set.entries()).array());
  assert.deepEqual([2, 4, 6], $for(set).array((function(it){
    return it * 2;
  })));
  assert.deepEqual([[2, 1], [4, 4], [6, 9]], $for(new Set([1, 2, 3, 2, 1]).entries(), true).array(function(k, v){
    return [k * 2, v * v];
  }));
  $for([1]).array(function(){
    return assert.ok(this === o);
  }, o = {});
});
QUnit.test('$for#of', function(assert){
  var set, counter1, string1, counter2, string2, o, done, iter;
  assert.ok(typeof $for.prototype.of === 'function', 'Is function');
  set = new Set(['1', '2', '3', '2', '1']);
  counter1 = 0;
  string1 = '';
  $for(set).of(function(it){
    counter1++;
    string1 += it;
  });
  assert.ok(counter1 === 3);
  assert.ok(string1 === '123');
  counter2 = 0;
  string2 = '';
  $for(set.entries()).of(function(it){
    counter2++;
    string2 += it[0] + it[1];
  });
  assert.ok(counter2 === 3);
  assert.ok(string2 === '112233');
  $for(new Set([1]).entries(), true).of(function(key, val){
    assert.ok(this === o);
    assert.ok(key === 1);
    return assert.ok(val === 1);
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
  assert.ok(done, '.return #default');
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
  assert.ok(done, '.return #break');
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
  assert.ok(done, '.return #throw');
});
QUnit.test('$for chaining', function(assert){
  assert.deepEqual([2, 10], $for([1, 2, 3]).map((function(it){
    return Math.pow(it, 2);
  })).filter((function(it){
    return it % 2;
  })).map((function(it){
    return it + 1;
  })).array());
  assert.deepEqual([[2, 1], [4, 9]], $for(new Set([1, 2, 3, 2, 1]).entries(), true).map(function(k, v){
    return [k, Math.pow(v, 2)];
  }).filter(function(k, v){
    return v % 2;
  }).map(function(k, v){
    return [k + 1, v];
  }).array());
});