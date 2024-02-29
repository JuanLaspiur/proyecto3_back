const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [{
    data: new SlashCommandBuilder().setName('kick').setDescription('kicks a member from the server')
        .addUserOption(option => option.setName('member')
            .setDescription('the member to kick')
            .setRequired(true))

        .addStringOption(option => option.setName('reason')
            .setDescription('the reason for kicking the member')
            .setRequired(true))

        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    /**
     * @param {ChatInputCommandInteraction} interaction
    */

    async execute(interaction) {
        try {
            const member = interaction.options.getMember('member');
            const reason = interaction.options.getString('reason');

            const embed = new EmbedBuilder()
                .setTitle('Kick')
                .setDescription(`You have been kicked from ${interaction.guild.name} for ${reason}`)
                .setColor(0xff0000)
                .setTimestamp();

            if (interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
                if (member.permissions.has(PermissionFlagsBits.KickMembers)) {
                    interaction.reply({
                        content: 'You cannot kick this member',
                        ephemeral: true
                    });
                } else {
                    await member.kick(reason);
                    interaction.reply({
                        content: `${member.user.tag} has been kicked`,
                        ephemeral: true
                    });
                    await member.user.send({
                        embeds: [embed]
                    });
                }
            } else {
                interaction.reply({
                    content: 'You do not have permission to kick members',
                    ephemeral: true
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
}];