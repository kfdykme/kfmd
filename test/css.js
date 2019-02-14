const fs = require('fs')

var css = fs.readFileSync('./src/base.css') + ''


css = css.replace(/(\r\n)|(\r)|(\n)/g, '\\n')

var fileHeader = '\'use strict\'\n\n'
var base = 'module.exports.base = function () {\nreturn \'' + css + '\';\n}\n'
fs.writeFileSync('./lib/css.js', fileHeader + base)
