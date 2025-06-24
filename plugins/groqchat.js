// plugins/groqchat.js

let groq_mode = true; // Toggle ON/OFF

const axios = require("axios");

module.exports = {
  name: 'groqchat',
  description: 'Groq AI auto-reply (Mixtral/LLaMA3)',
  category: 'AI',
  type: 'all',

  async run(m, { conn, text, prefix }) {
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    // Toggle commands
    if (m.body === `${prefix}groq-on`) {
      groq_mode = true;
      return conn.sendMessage(m.chat, { text: "🤖 Groq AI mode is *ON*" }, { quoted: m });
    }

    if (m.body === `${prefix}groq-off`) {
      groq_mode = false;
      return conn.sendMessage(m.chat, { text: "🛑 Groq AI mode is *OFF*" }, { quoted: m });
    }

    if (!groq_mode) return;

    const isGroup = m.key.remoteJid.endsWith('@g.us');
    const isMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(botNumber);
    const isRepliedToBot = m.message?.extendedTextMessage?.contextInfo?.participant === botNumber;

    if (!isGroup || isMentioned || isRepliedToBot) {
      const prompt = m.body || text;
      if (!prompt) return;

      try {
        const response = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "mixtral-8x7b-32768", // You can change this to llama3-70b-8192, gemma-7b-it, etc.
            messages: [
              { role: "system", content: "You are Groq, a helpful and witty WhatsApp assistant. Keep it short, smart, and Nigerian-friendly." },
              { role: "user", content: prompt }
            ]
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer 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"
            }
          }
        );

        const reply = response.data.choices[0].message.content;
        await conn.sendMessage(m.chat, { text: reply }, { quoted: m });

      } catch (error) {
        console.error("⚠️ Groq Error:", error?.response?.data || error.message);
        await conn.sendMessage(m.chat, { text: "❌ Groq no gree talk now. Try again later." }, { quoted: m });
      }
    }
  }
};
