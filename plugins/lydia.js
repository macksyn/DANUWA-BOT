// plugins/lydia.js
const { setLydia } = require('../lib/your-lydia-storage-file')
module.exports = {
  pattern: 'lydia ?(.*)',
  desc: 'enable/disable Lydia bot for a user',
  type: 'misc',
  async handler(message, match) {
    // your logic here...
  }
}
