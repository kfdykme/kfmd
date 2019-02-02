const kfmd = require('../lib/kfmd')
const fs = require('fs')

console.info(fs.readFileSync)
var result = fs.readFileSync('./test/maxiang.md') + ''
var html = kfmd.string2mdhtml(result)

console.info(fs.writeFileSync('./index.html', html))
