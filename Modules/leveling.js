const { QuickDB } = require('quick.db')
let db

class Leveling {

    constructor(startingXP, neededXP, gainedXP, xpRate, startingLevel, levelingRate) {
        if (typeof startingXP != "number") return console.error(new Error('MinusJs/Leveling Error: Starting XP must be a number'))
        if (typeof neededXP != "number") return console.error(new Error('MinusJs/Leveling Error: Needed XP must be a number'))
        if (typeof gainedXP != "number") return console.error(new Error('MinusJs/Leveling Error: Gained XP must be a number'))
        if (typeof xpRate != "number") return console.error(new Error('MinusJs/Leveling Error: XP Rate must be a number'))
        if (typeof levelingRate != "number") return console.error(new Error('MinusJs/Leveling Error: Leveling Rate must be a number'))
        if (typeof startingLevel != "number") return console.error(new Error('MinusJs/Leveling Error: Starting Level must be a number'))

        this.startingXP = startingXP
        this.neededXP = neededXP
        this.gainedXP = gainedXP
        this.xpRate = xpRate
        this.levelingRate = levelingRate
        this.startingLevel = startingLevel

    }
    init(dbPath) {
        if (!dbPath) console.error(new Error('MinusJs/Warnings Error: dbPath was not provided.'))
        db = new QuickDB({ filePath: dbPath })
        return true
    }

    async checkData(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs/Leveling Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Leveling Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`

        if (!await db.has(dbKey)) {
            await db.set(dbKey, {
                currentXP: this.startingXP,
                neededXP: this.neededXP,
                gainedXP: this.gainedXP,
                xpRate: this.xpRate,
                levelingRate: this.levelingRate,
                currentLevel: this.startingLevel,
                userID: userID,
                guildID: guildID
            })
        }

        let userData = await db.get(dbKey)
        userData.currentXP += userData.gainedXP * userData.xpRate
        await db.set(dbKey, userData)

        if (userData.currentXP >= userData.neededXP) {
            userData.currentXP = userData.currentXP - userData.neededXP
            userData.currentLevel += 1
            userData.neededXP = userData.neededXP * userData.levelingRate
            await db.set(dbKey, userData)
        }

        await db.get(dbKey)
        return true

    }
    async setXpRate(userID, guildID, newXpRate) {
        if (!userID) return console.error(new Error('MinusJs/Leveling Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Leveling Error: Guild ID was not povided.'))
        if (!newXpRate) return console.error(new Error('MinusJs/Leveling Error: XP Rate was not povided.'))
        if (typeof newXpRate != "number") return console.error(new Error('MinusJs Error: XP Rate must be a number'))


        const dbKey = `${userID}-${guildID}-minusJsLeveling`

        if (!await db.has(dbKey)) {
            await db.set(dbKey, {
                currentXP: this.startingXP,
                neededXP: this.neededXP,
                gainedXP: this.gainedXP,
                xpRate: this.xpRate,
                levelingRate: this.levelingRate,
                currentLevel: this.startingLevel,
                userID: userID,
                guildID: guildID
            })
        }


        let userData = await db.get(dbKey)
        userData.xpRate = newXpRate
        await db.set(dbKey, userData)
        return true

    }
    async deleteUserData(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs/Leveling Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Leveling Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`

        if (!await db.has(dbKey)) {
            return console.error(new Error('MinusJs/Leveling Error: Wrong database entry given, cannot delete an unexisting entry.'))
        }
        await db.delete(dbKey)
        return true
    }

    async clearDatabase() {
        await db.deleteAll() //Dangerous method lol
        return true
    }

    async getUserLevel(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs/Leveling Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Leveling Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`
        let userData = await db.get(dbKey)
        return userData.currentLevel
    }

    async getUserXp(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs/Leveling Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Leveling Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`
        let userData = await db.get(dbKey)
        return userData.currentXP
    }

    async getUserNeededXp(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs/Leveling Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Leveling Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`
        let userData = await db.get(dbKey)
        return userData.neededXP
    }

    async getUserXpRate(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs/Leveling Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Leveling Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`
        let userData = await db.get(dbKey)
        return userData.xpRate
    }

    async getUserLevelingRate(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs/Leveling Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Leveling Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`
        let userData = await db.get(dbKey)
        return userData.levelingRate
    }

    async getUserData(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs/Leveling Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Leveling Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`
        let userData = await db.get(dbKey)
        return userData
    }

    async getAllData() {
        return await db.all()
    }

    async getLeaderboard(numberOfUsers) {
        if (typeof numberOfUsers != "number") return console.error(new Error('MinusJs/Leveling Error: Number of users must be a number'))
        let lDta = numberOfUsers ? numberOfUsers : 10
        let leaderboardData = await db.all()
        function sorting(a, b) {
            return (a.value.currentLevel + a.value.currentXP) - (b.value.currentLevel + b.value.currentXP)
        }
        leaderboardData.sort(sorting).reverse()
        const slicedArray = leaderboardData.slice(0, lDta);
        let returedArray = []
        slicedArray.forEach(element => returedArray.push({ userID: element.value.userID, level: element.value.currentLevel, xp: element.value.currentXP }))
        return returedArray
    }
    async setXP(userID, guildID, xp) {
        if (!userID) return console.error(new Error('MinusJs/Leveling Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Leveling Error: Guild ID was not povided.'))
        if (!xp) return console.error(new Error('MinusJs/Leveling Error: XP was not povided.'))

        const dbKey = `${userID}-${guildID}-minusJsLeveling`
        userData = await db.get(dbKey)
        userData.currentXP = xp
        await db.set(dbKey, userData)
        return true
    }

    async setLevel(userID, guildID, level) {
        if (!userID) return console.error(new Error('MinusJs/Leveling Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Leveling Error: Guild ID was not povided.'))
        if (!level) return console.error(new Error('MinusJs/Leveling Error: Level was not povided.'))

        const dbKey = `${userID}-${guildID}-minusJsLeveling`

        let userData = await db.get(dbKey)
        userData.currentLevel = level
        await db.set(dbKey, userData)
        return true
    }
}



/*  LEADERBOARD GENERATION CODE!
let leaderboardDB = await leveling.getLeaderboard(5)
            let [message, count] = [[], 1]
            leaderboardDB.forEach(element => {
                message.push(`#${count} ${interaction.guild.members.cache.get(element.userID)} | Level: ${element.level} | XP ${element.xp}`)
                count++
            })
            message = message.join('\n')
*/




// async function createLeveling() {
//     let leveling = new Leveling(0, 100, 1, 1, 1, 1.2)
//     await leveling.checkData(1, 1)
// await leveling.setXpRate(1, 1, 2)
// await leveling.clearDatabase()
// await leveling.deleteUserData(1, 1)
// }
// createLeveling()

module.exports = Leveling