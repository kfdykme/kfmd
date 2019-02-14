const kfmd = require('../lib/kfmd')
const fs = require('fs')

console.info(fs.readFileSync)
var result = fs.readFileSync('./test/test.md') + ''
var html = kfmd.string2mdhtml(result)
html = html + '<style>\n' + kfmd.css.base() + '\n</style>'
console.info(fs.writeFileSync('./index.html', html))
