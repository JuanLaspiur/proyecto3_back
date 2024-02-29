const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = [{
    data: new SlashCommandBuilder().setName('ping').setDescription('replies with Pong!'),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */

    execute(interaction) {
        interaction.reply({
            content: 'Pong!'
        });
    }
}, {
    data: new SlashCommandBuilder().setName('brb').setDescription('be right back!'),

    /**
     * @param {ChatInputCommandInteraction} interaction
        */

    execute(interaction) {
        interaction.reply({
            content: 'Me voy a comer ya vengo B)'
        });
    }
}]
