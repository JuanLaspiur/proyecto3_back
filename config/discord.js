const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const {Guilds, GuildMembers, GuildMessages} = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials
require('dotenv').config();
const path = require('path');
const { loadEvents } = require(path.join(__dirname, '..', 'discord', 'discord.events.js'));

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember],
});

client.login(process.env.DISCORD_TOKEN);
client.events = new Collection();
client.commands = new Collection();

loadEvents(client);
module.exports = client