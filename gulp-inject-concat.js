var fs = require('fs');
var through = require('through2');
var Concat = require('concat-with-sourcemaps');

module.exports = function(file, opt){
  if (!file) {
    throw new Error('Missing file option for gulp-inject-concat');
  }
  opt = opt || {};

  function bufferContents(chunk, enc, callback){
    var res;
    var html = chunk.contents.toString(enc);
    var regexp = /<script[\s\S]+?src="([\S]+)".+/gi;
    var concat = new Concat(opt.sourcemaps, file, '\n');

    while(res = regexp.exec(html)){
      var filename = res[1].replace(/^\//, '');
      concat.add(filename, fs.readFileSync(filename))
    }
    fs.writeFileSync(file, concat.content)

    var splitted = html.replace(/<script .+?>.*?<\/script>/gi, "<!--$&-->").split('\n');

    splitted
      .splice(splitted.indexOf('</body>'), 0, '<script src="'+file+'"><\/script>');

    chunk.contents =  new Buffer(splitted.join('\n'), enc);

    this.push(chunk)
    callback()
  }

  return through.obj(bufferContents);
}
