
var fs = require('fs');
var parse = require('csv-parse');

var parser = parse({delimiter: ';'}, function(err, data){
  console.log(data);
});

fs.createReadStream(__dirname+'/fs_read.csv').pipe(parser);
