const Discord = require("discord.js-selfbot-v13");
require('dotenv').config();
require('./keep_alive.js');

// Sleep function to create random delays
async function sleep(min, max) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay * 1000));
}

// Send a slash command to a specific channel
async function sendSlashCommand(channel, commandId, commandName, args) {
  try {
    await channel.sendSlash(commandId, commandName, args);
  } catch (error) {
    console.error(`Error sending slash command: ${error.message}`);
  }
}

// Send a normal text message to a channel
async function sendMessage(channel, messageContent) {
  try {
    await channel.send(messageContent);
    // console.log(`Message sent: ${messageContent}`);
  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
  }
}

// Core function to start the bot for each account
async function startClient(token, accountName) {
  const client = new Discord.Client({ checkUpdate: false });

  // Control flag for loop
  let isRunning = false;

  client.on('ready', async () => {
    console.log(`[${accountName}] Logged in as ${client.user.tag}!`);

    const automationChannelId = '1317534046624022638'; // Channel ID where automation commands will be sent
    const controlChannelId = '943030564821286952'; // Channel ID for control messages
    const botid = '356950275044671499'; // Example bot ID
    const userId = '745874898525880427'; // ID of the user controlling the bot

    try {
      const automationChannel = await client.channels.fetch(automationChannelId);
      const controlChannel = await client.channels.fetch(controlChannelId);

      async function loop() {
        if (!isRunning) return; // Stop loop if flag is false

        await sendSlashCommand(automationChannel, botid, 'work');
        await sleep(1, 5);
        await sendSlashCommand(automationChannel, botid, 'deposit', ['all']);
        await sleep(30, 35);

        await loop(); // Continue loop if not stopped
      }

      // Listen for messages to start, stop, or use the .say command
      client.on('messageCreate', async (message) => {
        if (message.author.id !== userId) return; // Ignore messages from other users

        const content = message.content.trim();

        if (content === '.start') {
          if (!isRunning) {
            isRunning = true;
            sendMessage(controlChannel, "Automation started! 🚀");
            loop();
          } else {
            sendMessage(controlChannel, "Automation is already running!");
          }
        } else if (content === '.stop') {
          if (isRunning) {
            isRunning = false;
            sendMessage(controlChannel, "Automation paused. 🛑");
          } else {
            sendMessage(controlChannel, "Automation is not running.");
          }
        } else if (content.startsWith('.say ')) {
          const text = content.slice(5); // Extract the text after ".say "
          sendMessage(automationChannel, text); // Send the text to the automation channel
        }
      });

    } catch (error) {
      console.error(`[${accountName}] Error in automation: ${error.message}`);
    }
  });

  // Handle client login and errors
  client.login(token).catch(error => {
    console.error(`[${accountName}] Login failed: ${error.message}`);
  });
}

// Account management
const accounts = [
  { token: process.env.TEEN, name: 'Itz_CXYP' },
  { token: process.env.CRYING, name: 'CRYING' },
  { token: process.env.MARK, name: 'MARK' },
  { token: process.env.DARK_MATTER, name: 'DARK_MATTER' },
  { token: process.env.HAPPEN, name: 'HAPPEN' },
];

// Start each client concurrently
accounts.forEach(({ token, name }) => startClient(token, name));
