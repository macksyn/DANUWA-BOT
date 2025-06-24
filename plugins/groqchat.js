const axios = require("axios");
const config = require("../config");

let groq_mode = true;

module.exports.cmd = {
  name: "groqchat",
  category: "AI",
  react: "🤖",
  desc: "Talk to Groq AI",
  type: "all",

  async run(m, conn, { text, prefix }) {
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    // Toggle ON/OFF
    if (m.body === `${prefix}groq-on`) {
      groq_mode = true;
      return conn.sendMessage(m.chat, { text: "🤖 Groq AI mode is ON" }, { quoted: m });
    }
    if (m.body === `${prefix}groq-off`) {
      groq_mode = false;
      return conn.sendMessage(m.chat, { text: "🛑 Groq AI mode is OFF" }, { quoted: m });
    }

    if (!groq_mode) return;

    const isGroup = m.key.remoteJid.endsWith("@g.us");
    const isMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(botNumber);
    const isRepliedToBot = m.message?.extendedTextMessage?.contextInfo?.participant === botNumber;

    if (!isGroup || isMentioned || isRepliedToBot) {
      const prompt = m.body || text;
      if (!prompt) return;

      try {
        const response = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "mixtral-8x7b-32768",
            messages: [
              { role: "system", content: "You are Groq, a witty and helpful WhatsApp assistant." },
              { role: "user", content: prompt }
            ]
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${config.GROQ_API_KEY}`
            }
          }
        );

        const reply = response.data.choices[0].message.content;
        await conn.sendMessage(m.chat, { text: reply }, { quoted: m });

      } catch (err) {
        console.error("[Groq Error]", err?.response?.data || err.message);
        await conn.sendMessage(m.chat, { text: "❌ Groq no dey gree talk. Try later." }, { quoted: m });
      }
    }
  }
};
