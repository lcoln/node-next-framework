const fs = require('fs')

class Fs {
  cat (file) {
    return fs.readFileSync(file)
  }
  isDir (file) {
    return fs.isDirectory(file)
  }
  write (str, file, append, encode) {
    try {
      if (append) {

      } else {
        fs.writeFileSync(file, str)
      }
    }
  }
}

module.exports = new Fs()