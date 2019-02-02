'use strict'

const md = require('./md')

/**
 * @method string2mdhtml
 * @params {string} str 输入的文本
 * @return {string} html格式的文本
 * @desc 把string 转化为 html
 */
module.exports.string2mdhtml = function (str) {

  str = md.transMultLine(str)
  str = md.transSingleLine(str)
  str = md.transInLine(str)
  // 2. change -
  // 3. change a
  // 4. change image

  return str
}
