const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const translate = require('translate')
const ISO6391 = require('iso-639-1');
const databaseManager = require('../../Modules/databaseManager')
const userData = new databaseManager()
require('dotenv').config()
translate.engine = "deepl";
translate.key = process.env.DEEPL_KEY;

module.exports = {

    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translates user input!')
        .addStringOption(option =>
            option
                .setName('input')
                .setDescription('The text you want to translate!')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('translate_to')
                .setDescription('The language you want your text to be translated! (in locales)')
                .setRequired(true)),

    async execute(interaction) {
        let locale;
        let currentDate = Math.floor(Date.now() / 1000)
        const translation = await userData.getTranslation(interaction.user.id, interaction.guild.id)
        let tokens = translation.tokens
        let input = interaction.options.getString('input')

        if (currentDate - translation.lastUpdated >= 86400) {
            tokens = 100
            await userData.setTranslationLastUpdated(interaction.user.id, interaction.guild.id, Math.floor(Date.now() / 1000))
        }

        try {
            locale = ISO6391.getCode(interaction.options.getString('translate_to'))
        } catch {
            return await interaction.reply({ content: 'Language was not found!', ephemeral: true })
        }

        if (input.length <= tokens) {
            const text = await translate(input, locale);
            const embed = new EmbedBuilder()
                .setColor(0x588eb8)
                .setTitle(`Translated message to ${interaction.options.getString('translate_to')} `)
                .setDescription(`Original message: ${input}\n Translation to ${interaction.options.getString('translate_to')}: ${text} `)
                .addFields({ name: `Your tokens will reset in ${Math.floor((86400 - (currentDate - translation.lastUpdated)) / 60)} min`, value: `You have ${tokens - input.length} tokens left!` })
                .setFooter({ text: 'Powered by deepl', iconURL: 'https://cdn.discordapp.com/attachments/1093242205407301633/1093246252403146814/deepl.png' });
            await userData.setTranslationWords(interaction.user.id, interaction.guild.id, tokens - input.length)
            await interaction.reply({ embeds: [embed] })

        } else {
            await interaction.reply({ content: `You do not have enough word token to translate this! Tokens left: ${tokens} \n You are asking for ${input.length} tokens.Wait until tomorrow to have your token reset!`, ephemeral: true })
        }
    }

}