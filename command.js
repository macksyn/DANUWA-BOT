// command.js (clean loader version)
const fs = require('fs');
const path = require('path');

global.commands = new Map();

const pluginPath = path.join(__dirname, './plugins');

fs.readdirSync(pluginPath).forEach(file => {
  if (file.endsWith('.js')) {
    try {
      const plugin = require(`${pluginPath}/${file}`);
      if (plugin.name && typeof plugin.run === 'function') {
        global.commands.set(plugin.name, plugin);
        console.log(`[✅ Plugin Loaded]: ${plugin.name}`);
      }
    } catch (err) {
      console.error(`[❌ Plugin Error]: ${file} -`, err.message);
    }
  }
});
