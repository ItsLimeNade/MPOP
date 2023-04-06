const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const Server = require('../../Modules/serverSettings')
const serverSettings = new Server()
module.exports = {

    data: new SlashCommandBuilder()
        .setName('setlogschannel')
        .setDescription('Sets the logs channel!')
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('New logs channel')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        await serverSettings.initServerData(interaction.guild.id)
        const serverData = await serverSettings.getServerData(interaction.guild.id)
        const channel = interaction.options.getChannel('channel')
        await serverSettings.setLogsChannelID(interaction.guild.id, channel.id)
        await interaction.reply({ content: `Succesfully changed the logs channel to ${channel}`, ephemeral: true })
    }

}