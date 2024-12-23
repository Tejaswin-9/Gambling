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
    console.log(`Message sent: ${messageContent}`);
  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
  }
}

// Test function for initial debugging
async function test(client) {
  const channelId = '1317534046624022638'; // Example channel ID
  try {
    const channel = await client.channels.fetch(channelId);
    console.log(`Test successful for channel: ${channel.name}`);
  } catch (error) {
    console.error(`Test failed: ${error.message}`);
  }
}

// Core function to start the bot for each account
async function startClient(token, accountName) {
  const client = new Discord.Client({ checkUpdate: false });

  client.on('ready', async () => {
    console.log(`[${accountName}] Logged in as ${client.user.tag}!`);

    const channelId = '1317534046624022638'; // Channel ID where commands will be sent
    const botid = '356950275044671499'; // Example bot ID

    try {
      const channel = await client.channels.fetch(channelId);

      // Initial test to validate channel
      // await test(client);

      async function loop() {
        // console.log(`[${accountName}] Running loop sequence.`);
        await sendSlashCommand(channel, botid, 'work');
        await sleep(1, 5);
        await sendSlashCommand(channel, botid, 'deposit', ['all']);
        await sleep(30, 35);
        await loop()
      }

      // Start the workflow
      await loop();

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
