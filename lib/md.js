'use strict'

module.exports.transMultLine = function (str) {
  str = this.transList(str)
  str = this.transCode(str)
  return str
}

module.exports.transSingleLine = function (str) {
  let res = []

  str.match(/.*?(\r\n)/g).map(s => {
    s = this.transTitle(s)
    s = this.transHr(s)
    s = this.transBlockquote(s)

    if (s.match(/^[^<].+/) != null) {
      s = '<p>\r\n' + s + '</p>\r\n'
    }
    res.push(s)
  })

  return res.join('')
}

module.exports.transInLine = function (str) {
  let res = []
  str.match(/.*?(\r\n)/g).map(s => {
    s = this.transStrong(s)
    s = this.transEm(s)
    s = this.transA(s)
    s = this.transInlineCode(s)
    res.push(s)
  })

  return res.join('')
}

/**
 * @method transList
 * @params {string} str a hold text
 * @return {string} html
 */
module.exports.transList = function (str) {
  let listStack = []
  let res = []

  str = str.match(/.*?(\r\n)/g)
  str.map(s => {
    if (s.match(/^(  )*- .*/) !== null) {
      // console.info(s)
      let grade = s.match(/- /).index
      let content = s.match(/- (.*)/)[1]
      let last = listStack.length !== 0 ? listStack[listStack.length-1] : null
      if (last === null) {
        s = '<ul>\r\n<li>' + content + '</li>\r\n'
      } else if (last === grade) {
        s = '<li>' + content + '</li>\r\n'
      } else if (last < grade) {
        s = '<ul>\r\n<li>' + content + '</li>\r\n'
      } else if (last > grade) {
        s = '</ul>\r\n<li>' + content + '</li>\r\n'
      }
      listStack.push(grade)
    } else {
      if (listStack.length !== 0) {
        listStack = []
        s = '</ul>\r\n' + s
      }
    }

    res.push(s)
  })

  return res.join('')
}

/**
 * @method transCode
 * @params {string} str a hold text
 * @return {string} html
 */
module.exports.transCode = function (str) {
  let code = false
  let res = []

  str = str.match(/.*?(\r\n)/g)
  str.map(s => {
    if (s.match(/^```/) !== null) {
      code = !code
      if (code) {
        res.push('<code>')
      } else {
        res.push('</code>')
      }
    } else {
      if (code) {
        res.push('<div>' + s + '</div>')
      } else {
        res.push(s)
      }
    }
  })

  return res.join('')
}

/**
* @method transTitle
* @params {string} line
* @return {string} html
*/
module.exports.transTitle = function (line) {
  if (line.match(/^#+ /) !== null) {
    let grade = line.match(/#/g).length
    let content = line.match(/(^#* )(.*)/)[2]
    line = '<h' + grade + '>' + content + '</h' + grade +'>\r\n'
  }

  return line
}

/**
 * @method transHr
 * @params {string} line a line
 */
module.exports.transHr = function (line) {
  if (line.match(/^-----*(\r\n)/g) != null) {
    line = '<hr>'
  }

  return line
}

/**
 * @method transBlockquote
 * @params {string} line a line
 */
module.exports.transBlockquote = function (line) {
  if (line.match(/^>(.*)/g) != null) {
    let content = line.match(/^>(.*)/)[1]
    line = '<blockquote><p>' + content + '</p></blockquote>'
  }

  return line
}

/**
 * @method transStrong
 * @params {string} line
 */
module.exports.transStrong = function (line) {
  let res = line
  if (line.match(/\*\*(.*?)\*\*/g) != null) {
    line.match(/\*\*(.*?)\*\*/g).map(s => {
      let content = s.match(/\*\*(.*?)\*\*/)[1]
      res = res.replace(s, '<strong>' + content + '</strong>')
    })
  }
  return res
}

module.exports.transEm = function (line) {
  let res = line
  if (line.match(/\*(.*?)\*/g) != null) {
    line.match(/\*(.*?)\*/g).map(s => {
      let content = s.match(/\*(.*?)\*/)[1]
      res = res.replace(s, '<em>' + content + '</em>')
    })
  }
  return res
}

module.exports.transA = function (line) {
  let res = line
  if (line.match(/\[(.*?)\]\((.*?)\)/g) !== null) {
    line.match(/\[(.*?)\]\((.*?)\)/g).map(s => {
      let description = s.match(/\[(.*?)\]\((.*?)\)/)
      let href = description[2]
      description = description[1]

      res = res.replace(s, '<a href=\"' + href + '\" >' + description + '</a>')
    })
  }
  return res
}

module.exports.transInlineCode = function (line) {
  let res = line
  if (line.match(/`(.*?)`/g) != null) {
    line.match(/`(.*?)`/g).map(s => {
      let content = s.match(/`(.*?)`/)[1]
      res = res.replace(s, '<code>' + content + '</code>')
    })
  }
  return res
}
