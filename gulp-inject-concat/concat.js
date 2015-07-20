var fs = require('mz/fs');
var co = require('co');
var tags = require('./tags')
var Concat = require('concat-with-sourcemaps');

module.exports = co.wrap(function* (text, file, sourcemaps){
  var res;
  var concat = new Concat(sourcemaps, file, '\n');
  var regexp = tags.searchScripts;
  text = text.match(tags.findSection);

  while(res = regexp.exec(text)){
    var filename = res[1].replace(/^\//, '');
    concat.add(filename, yield fs.readFile(filename))
  }

  yield fs.writeFileSync(file, concat.content)
})
