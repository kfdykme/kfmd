const fs = require('fs')

var css = fs.readFileSync('./src/base.css') + ''


css = css.replace(/(\r\n)|(\r)|(\n)/g, '\\n')
fs.writeFileSync('./lib/css.js', '\'use strict\'\n\nmodule.exports.css = function () {\nreturn \'' + css + '\';\n}')
