const { setGroq } = require('../lib/groq-db')
const jidToNum = (jid) => jid.split('@')[0]

module.exports = {
  pattern: 'groq ?(.*)',
  desc: 'Turn Groq AI on or off for a user',
  type: 'misc',
  async handler(message, match) {
    if (!match) {
      return await message.send('*Usage:* groq on | off\n_Reply or mention someone to apply_')
    }

    const user = message.mention[0] || message.reply_message?.jid
    if (!user) return await message.send('Tag or reply to a person to use this.')

    const action = match.toLowerCase().includes('on')
    await setGroq(message.jid, action, user)

    await message.send(`_Groq ${action ? 'Activated ✅' : 'Deactivated ❌'} for @${jidToNum(user)}_`, {
      mentions: [user]
    })
  }
}
