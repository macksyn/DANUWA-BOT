const axios = require('axios')
const { getGroq } = require('../lib/groq-db')

module.exports = {
  on: 'text',
  fromMe: false,
  async handler(message) {
    const isActive = await getGroq(message.jid, message.sender)
    if (!isActive) return

    try {
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are Groq, a witty, intelligent AI who speaks with Gen Z Nigerian vibes and smooth comebacks.'
            },
            { role: 'user', content: message.text }
          ],
          temperature: 0.8,
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            'Content-Type': 'application/json',
          }
        }
      )

      const reply = res.data.choices[0].message.content.trim()
      await message.send(reply)
    } catch (err) {
      await message.send('_Groq is confused o 🤯. Try again later._')
      console.error('Groq Error:', err.message)
    }
  }
}
