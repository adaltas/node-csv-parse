const parse = require('..');
const assert = require('assert')

parse(
`1	2	3
a	b	c`, {
  delimiter: '\t'
}, function(err, data){
  if(err) throw err;
  assert.deepStrictEqual(data, [ [ '1', '2', '3' ], [ 'a', 'b', 'c' ] ]);
});

parse(
`"1"	"2"	"3"
"a"	"b"	"c"`, {
  delimiter: '\t',
  quote: "\"",
  columns: true
}, function(err, data){
  if(err) throw err;
  assert.deepStrictEqual(data, [ { 1: "a", 2: "b", 3: "c" } ]);
});
