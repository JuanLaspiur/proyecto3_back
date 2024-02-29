const path = require('path');
const loadCommands = require(path.join(__dirname, '..', 'discord.commands.js'));
const { ChatInputCommandInteraction } = require('discord.js');
const usersId = ["354400663851106306", "754134285153206353", "953780584755396668", "446129010922225684", "240643742514544640", "808447594455498793", "561550833251123239"];

module.exports = [{
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity('with the API');
        loadCommands(client);
    }
}, {
    name: "interactionCreate",
    /**
        *
        * @param {ChatInputCommandInteraction} interaction
    */
    execute(client, interaction) {
        try {
            if (!interaction.isChatInputCommand()) return;

            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.reply({
                content: "No se ha encontrado el comando!",
                ephemeral: true
            });

            if (!command.developer && !usersId.includes(interaction.user.id)) return interaction.reply({
                content: "Comando sólo para desarrolladores! 💻",
                ephemeral: true
            });

            command.execute(interaction, client);
        } catch (error) {
            console.error(error);
        }
    }
}]