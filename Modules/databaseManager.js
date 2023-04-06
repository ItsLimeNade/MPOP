const { QuickDB } = require('quick.db')
console.log("\nLoading User Database🔄")
let db = new QuickDB({ filePath: 'Database/UserDB.sqlite' })
console.log("User Database Loaded!✅\n")

class User {

    async checkData(userID, guildID) {
        if (!userID) console.error(new Error('UserID arg was not provided.'))
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))

        if (!await db.get(`${userID}userID-${guildID}guildID`)) {
            const userData = {
                userID: userID,
                guildID: guildID,
                slashCommandsExecuted: 0,
                translation: {
                    tokens: 100,
                    lastUpdated: Math.floor(Date.now() / 1000)
                },
                moderation: {
                    flags: { numberOfFlags: 0, reasons: { reasons: [], time: [] } },
                    warns: { numberOfWarns: 0, reasons: { reasons: [], time: [] } },
                    kicks: { numberOfKicks: 0, reasons: { reasons: [], time: [] } },
                    bans: { numberOfBans: 0, reasons: { reasons: [], time: [] } },
                    toxicityLevel: 0,
                },
                leveling: {
                    messagesSent: 0,
                    xp: 0,
                    totalxp: 0,
                    level: 0,
                    neededxp: 0,
                    levelingRate: 0,
                    leaderboardPosition: 0,
                    levelingEnabled: false
                },
            }
            await db.set(`${userID}userID-${guildID}guildID`, userData)
            return true
        } else {
            return false
        }

    }

    async enableLeveling(userID, guildID) {
        if (!userID) console.error(new Error('UserID arg was not provided.'))
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        await db.set(`${userID}userID-${guildID}guildID.leveling.levelingEnabled`, true)
        return true
    }
    async disableLeveling(userID, guildID) {
        if (!userID) console.error(new Error('UserID arg was not provided.'))
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        await db.set(`${userID}userID-${guildID}guildID.leveling.levelingEnabled`, false)
        return true
    }

    async warn(userID, guildID, reason) {
        if (!userID) console.error(new Error('UserID arg was not provided.'))
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        await db.add(`${userID}userID-${guildID}guildID.moderation.warns.numberOfWarns`, 1)
        await db.push(`${userID}userID-${guildID}guildID.moderation.warns.reasons.reasons`, `[+] ${reason}`)
        await db.push(`${userID}userID-${guildID}guildID.moderation.warns.reasons.time`, Math.floor(Date.now() / 1000))
        return true
    }

    async removeWarn(userID, guildID, numberOfWarns, reason) {
        if (!userID) console.error(new Error('UserID arg was not provided.'))
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        if (!numberOfWarns) console.error(new Error('numberOfWarns arg was not provided.'))
        await db.sub(`${userID}userID-${guildID}guildID.moderation.warns.numberOfWarns`, numberOfWarns)
        await db.push(`${userID}userID-${guildID}guildID.moderation.warns.reasons.reasons`, `[-] ${reason}`)
        await db.push(`${userID}userID-${guildID}guildID.moderation.warns.reasons.time`, Math.floor(Date.now() / 1000))
        return true
    }

    async setTranslationWords(userID, guildID, translationWords) {
        if (!userID) console.error(new Error('UserID arg was not provided.'))
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        if (!translationWords) console.error(new Error('translationWords arg was not provided.'))
        return await db.set(`${userID}userID-${guildID}guildID.translation.tokens`, translationWords)
    }

    async setTranslationLastUpdated(userID, guildID, newTimeStamp) {
        if (!userID) console.error(new Error('UserID arg was not provided.'))
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        if (!newTimeStamp) console.error(new Error('newTimeStamp arg was not provided.'))
        return await db.set(`${userID}userID-${guildID}guildID.translation.lastUpdated`, newTimeStamp)
    }

    async initLeveling(userID, guildID) {
        if (!userID) console.error(new Error('UserID arg was not provided.'))
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))

        await db.set(`${userID}userID-${guildID}guildID.leveling.level`, 1)
        await db.set(`${userID}userID-${guildID}guildID.leveling.levelingEnabled`, true)
        await db.set(`${userID}userID-${guildID}guildID.leveling.neededxp`, 100)
        await db.set(`${userID}userID-${guildID}guildID.leveling.levelingRate`, 1.2)

        return true
    }
    async addXp(userID, guildID) {
        if (!userID) console.error(new Error('UserID arg was not provided.'))
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        await db.add(`${userID}userID-${guildID}guildID.leveling.xp`, 1)
        await db.add(`${userID}userID-${guildID}guildID.leveling.messagesSent`, 1)
        await db.add(`${userID}userID-${guildID}guildID.leveling.totalxp`, 1)

        const levelingRate = await db.get(`${userID}userID-${guildID}guildID.leveling.levelingRate`)
        let currentXP = await db.get(`${userID}userID-${guildID}guildID.leveling.xp`)
        let currentNeededxp = await db.get(`${userID}userID-${guildID}guildID.leveling.neededxp`)

        if (currentXP >= currentNeededxp) {
            await db.add(`${userID}userID-${guildID}guildID.leveling.neededxp`, currentNeededxp * levelingRate)
            await db.add(`${userID}userID-${guildID}guildID.leveling.level`, 1)
            await db.sub(`${userID}userID-${guildID}guildID.leveling.xp`, currentXP)
        }
        return true
    }

    // async getLeaderboard() { //async getLeaderboard(numberOfUsers) {
    //     // if (typeof numberOfUsers != "number") return console.error(new Error('Error: Number of users must be a number'))
    //     // let lDta = numberOfUsers ? numberOfUsers : 10
    //     let leaderboardData = await db.all()
    //     function sorting(a, b) {
    //         console.table(a.value.leveling)
    //         console.table(b.value.leveling)
    //         return (a.value.leveling.totalxp) - (b.value.leveling.totalxp)
    //     }
    //     leaderboardData.sort(sorting).reverse()
    //     const slicedArray = leaderboardData.slice(0, 5);
    //     let returedArray = []
    //     slicedArray.forEach(element => returedArray.push({ userID: element.value.userID, level: element.value.leveling.level, xp: element.value.leveling.xp, neededxp: element.value.leveling.neededxp }))
    //     console.table(returedArray)
    //     return returedArray.reverse()
    // }
    async getLeveling(userID, guildID) {
        if (!userID) console.error(new Error('UserID arg was not provided.'))
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        return await db.get(`${userID}userID-${guildID}guildID.leveling`)
    }

    async getModeration(userID, guildID) {
        if (!userID) console.error(new Error('UserID arg was not provided.'))
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        return await db.get(`${userID}userID-${guildID}guildID.moderation`)
    }

    async getTranslation(userID, guildID) {
        if (!userID) console.error(new Error('UserID arg was not provided.'))
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        return await db.get(`${userID}userID-${guildID}guildID.translation`)
    }

    async getUserData(userID, guildID) {
        if (!userID) console.error(new Error('UserID arg was not provided.'))
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        return await db.get(`${userID}userID-${guildID}guildID`)
    }
}

module.exports = User