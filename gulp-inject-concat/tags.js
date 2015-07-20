module.exports = {
  findSection: /<!-- concat -->([\s\S]*)<!-- endconcat -->/gi,
  searchScripts: /<script[\s\S]+?src="([\S]+)".+/gi,
  replace: /<script .+?>.*?<\/script>/gi
}
