const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const User = require('../../Modules/databaseManager')
let userData = new User()

module.exports = {

    data: new SlashCommandBuilder()
        .setName('warns')
        .setDescription('Shows how many warns someone has!')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member you want to check')
                .setRequired(true)),

    async execute(interaction) {
        const usrDta = await userData.getModeration(interaction.user.id, interaction.guild.id)
        const moderation = usrDta
        const target = interaction.options.getUser('target')
        let message = []
        for (i = 0; i < moderation.warns.reasons.length; i++) {
            message.push(`-"${moderation.warns.reasons[i]}"`)
        }
        const embed = new EmbedBuilder()
            .setColor(0xd10000)
            .setTitle(`Warnings of ${target}!`)
            .setDescription(`${target} has ${moderation.warns.numberOfWarns} wanrs!`)
            .addFields(
                {
                    name: `Warn reasons:`, value: ` ${message.join('\n')}`
                })
        await interaction.reply({ embeds: [embed] })
    }

}