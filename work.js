import { Client } from 'discord.js-selfbot-v13';  // Use import for discord.js-selfbot-v13
import dotenv from 'dotenv';  // Use import for dotenv

dotenv.config();  // Load environment variables

async function sleep(min, max) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;  // Generate a random delay between min and max
  return new Promise(resolve => setTimeout(resolve, delay * 1000));  // Convert to milliseconds and wait
}

async function sendSlashCommand(channel, commandId, commandName, args) {
  try {
    await channel.sendSlash(commandId, commandName, args);
    // console.log(`Slash command "${commandName}" sent with args: ${args}`);
  } catch (error) {
    console.error(`Error sending slash command: ${error.message}`);
  }
}

async function sendMessage(channel, messageContent) {
  try {
    await channel.send(messageContent); // Send a normal message
    console.log(`Message sent: ${messageContent}`);
  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
  }
}

async function startClient(token, accountName) {
  const client = new Client({ checkUpdate: false });

  try {
    client.on('ready', async () => {
      console.log(`[${accountName}] Logged in as ${client.user.tag}!`);

      const channelId = '1317534046624022638'; // The channel ID where the commands/messages will be sent
      const channel = await client.channels.fetch(channelId);

      // Command variables
      const botid = '356950275044671499';  // The bot ID

      // Repeat commands with a delay
      async function loop() {
        // Example: Sending slash commands
        await sendSlashCommand(channel, botid, 'work');
        await sleep(1, 5);
        await sendSlashCommand(channel, botid, 'deposit', ['all']);
        await sleep(30, 35);

        // Example: Sending normal messages
        // await sendMessage(channel, '!with all');
        // await sleep(1, 5);
        // await sendMessage(channel, '!pay _kid_4 all');

        loop();  // Repeat the loop
      }

      loop();  // Start the loop
    });

    await client.login(token);
  } catch (error) {
    console.error(`[${accountName}] An error occurred: ${error.message}`);
    await startClient(token, accountName); // Recursive call to restart the client
  }
}

// Add tokens and account names to this array
const accounts = [
  // { token: process.env.KID, name: 'KID' },
  { token: process.env.TEEN, name: 'Itz_CXYP' },
  { token: process.env.CRYING, name: 'CRYING' }, 
  { token: process.env.MARK, name: 'MARK' },
  { token: process.env.DARK_MATTER, name: 'DARK_MATTER' },
  { token: process.env.HAPPEN, name: 'HAPPEN' },
  // { token: process.env.HPN, name: '1289985158304501884' },
  // { token: process.env.MEGADON, name: '1289985158304501884' },
  // { token: process.env.SANDICTION, name: '1289985158304501884' },
  // { token: process.env.PARROT, name: '1289985158304501884' },
];

// Start each client concurrently
accounts.forEach(({ token, name }) => {
  startClient(token, name);
});
