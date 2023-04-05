const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const User = require('../../Modules/databaseManager')

module.exports = {

    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a user!')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('Member to warn')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for warning')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason')

        let userData = new User()
        await userData.checkData(target.id, interaction.guild.id)
        await userData.warn(target.id, interaction.guild.id, reason)

        let moderation = await userData.getModeration(target.id, interaction.guild.id)

        const embed = new EmbedBuilder()
            .setColor(0xd10000)
            .setTitle('Successfully wanrned user!')
            .setDescription(`Wanred ${target} with reason: "${reason}"`)
            .addFields(
                { name: `User already had: `, value: ` ${moderation.warns.numberOfWarns - 1} warns!` },
                { name: `Remember:`, value: `You wan always remove warns with [Command Comming Soon!]` },)
        await interaction.reply({ embeds: [embed] })
    }

}