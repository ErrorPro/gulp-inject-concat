var through = require('through2');
var concatFile = require('./concat');
var tags = require('./tags');

module.exports = function(file, opt){
  if (!file) {
    throw new Error('Missing file option for gulp-inject-concat');
  }
  opt = opt || {};

  function bufferContents (chunk, enc, callback){
    var html = chunk.contents.toString(enc);

    concatFile(html, file, opt.sourcemaps)

    chunk.contents =  new Buffer(html.replace(tags.replace, "<!--$&-->")
        .replace(/(.+?)<!-- endconcat -->/gi,
          '$1<script src="'+file+'"><\/script>\n$&'), enc);

    this.push(chunk)
    callback()
  }

  return through.obj(bufferContents);
}
