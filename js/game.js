/**
 * Made by Eli Wood and Gurbaz Sogi
 * 2026-02-27
 * This file contains all the logic for how the game functions, and does not display the information
 */

/**
 * Attempts to puchase the specified building by checking if the player has enough currency.
 * @param {string} key the key for the building as stored in gameData
 * @returns true if the building was successfully purchased
 */
function purchaseBuilding(key){
    if(!(key in gameData.buildings) || gameData.currency < gameData.buildings[key].price){
        return false
    }

    gameData.currency -= gameData.buildings[key].price
    gameData.buildings[key].amount++;
    gameData.buildings[key].price = Math.ceil(gameData.buildings[key].basePrice * (1.15**gameData.buildings[key].amount))
    // updateGameRPS()
    return true
}

/**
 * Attempts to puchase the specified upgrade by checking if the player has enough currency.
 * @param {string} key the name of the upgrade to be bought as stored in gameData
 * @returns true if the upgrade was successfully purchased
 */
function purchaseUpgrade(key){
    if(!(key in gameData.upgrades) || gameData.currency < gameData.upgrades[key].price){
        return false
    }

    gameData.currency -= gameData.upgrades[key].price
    gameData.upgrades[key].purchased = true
    // updateGameRPS()
    return true
}

/**
 * Calculates the amount of currency gained by clicking and updates the gameData. 
 * The return value should not be manually added to the currency, it is only for displaying purposes.
 * @returns the amount of currency gained by clicking
 */
function click(){
    let gain = 2**getUpgradeCount("click")
    gameData.currency += gain;
    gameData.score += gain;
    return gain;
}

/**
 * Finds the number of upgrades owned that have a specified prefix
 * @param {string} name the name of the upgrade prefix. for example: click, pickaxe
 * @returns the number of upgrades owned
 */
function getUpgradeCount(name){
    let upgradeKeys = Object.keys(gameData.upgrades).filter(key => new RegExp(`^${name}-[0-9]+$`).test(key));
    let purchasedUpgrades = upgradeKeys.map(key => gameData.upgrades[key]).filter(elem => elem.purchased == true)
    return purchasedUpgrades.length
}

/**
 * Calculates the game RPS by looking at all owned buildings and upgrades
 */
function updateGameRPS(){
    let newRPS = 0;
    for ([key,element] of Object.entries(gameData.buildings)) {
        let mult = 2**getUpgradeCount(element.upgrade);
        newRPS += (element.amount * element.rps) * mult
    }
    gameData.rps = newRPS
    // updateRPS()
}

/**
 * Logic to run every game tick, such as updating the currency values and updating the visuals.
 */
function gameTick(){
    //tick logic
    currentTick++;
    gameData.ticksPlayed++;

    //game logic
    addRocksPerSecond()
    checkAchievements()

    //save
    if(currentTick % saveInterval == 0){
        localStorage.setItem("gameData", JSON.stringify(gameData))
    }

    //visual
    updateRPS();
    updateCurrency()
    
}

/**
 * Adds rocks to the currency based on the rps. Should be called once per game tick
 */
function addRocksPerSecond(){
    let toAdd = gameData.rps / (1000/tickInterval)
    gameData.score += toAdd;
    gameData.currency += toAdd;
}

/**
 * Checks all unearned achievements to see if they have been earned.
 * Updates the achievement visual for the user.
 */
function checkAchievements(){
    //score based achievements
    gameData.achievements.score.filter(a=>!a.obtained).forEach(a=>{
        if(gameData.score >= a.condition){
            a.obtained = true;
            achievementDisplay.querySelector("#score-" + a.condition).classList.add("achieved")
            displayRecentAchievement(a)
        }
    })

    //rps based achievements
    gameData.achievements.rps.filter(a=>!a.obtained).forEach(a=>{
        if(gameData.rps >= a.condition){
            a.obtained = true;
            achievementDisplay.querySelector("#rps-" + a.condition).classList.add("achieved")
            displayRecentAchievement(a)
        }
    })

    //upgrade count based achievements
    gameData.achievements.upgradeCount.filter(a=>!a.obtained).forEach(a=>{
        let upgrades = 0;
        for (const v of Object.values(gameData.upgrades)){
            if(v.purchased == true){
                upgrades++;
            }
        }
        if(upgrades >= a.condition){
            a.obtained = true;
            achievementDisplay.querySelector("#upgradeCount-" + a.condition).classList.add("achieved")
            displayRecentAchievement(a)
        }
    })

    //building count based achievements
    for (const [key, value] of Object.entries(gameData.achievements.building)){
        value.filter(a=>!a.obtained).forEach(a=>{
            if(gameData.buildings[key].amount >= a.condition){
                a.obtained = true
                achievementDisplay.querySelector("#building-" + key + "-" + a.condition).classList.add("achieved")
                displayRecentAchievement(a)
            }
        })
    }

    //special achievements

    if(!gameData.achievements.special["playtime-10m"].obtained && gameData.ticksPlayed*tickInterval >= 600000){
        gameData.achievements.special["playtime-10m"].obtained = true
        achievementDisplay.querySelector("#special-playtime-10m").classList.add("achieved")
        displayRecentAchievement(gameData.achievements.special["playtime-10m"])
    }
}