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

function purchaseUpgrade(key){
    if(!(key in gameData.upgrades) || gameData.currency < gameData.upgrades[key].price){
        return false
    }

    gameData.currency -= gameData.upgrades[key].price
    gameData.upgrades[key].purchased = true
    // updateGameRPS()
    return true
}

function click(){
    let gain = 2**getUpgradeCount("click")
    gameData.currency += gain;
    gameData.score += gain;
    return gain;
}

function getUpgradeCount(name){
    let upgradeKeys = Object.keys(gameData.upgrades).filter(key => new RegExp(`^${name}-[0-9]+$`).test(key));
    let purchasedUpgrades = upgradeKeys.map(key => gameData.upgrades[key]).filter(elem => elem.purchased == true)
    return purchasedUpgrades.length
}

function updateGameRPS(){
    let newRPS = 0;
    for ([key,element] of Object.entries(gameData.buildings)) {
        let mult = 2**getUpgradeCount(element.upgrade);
        newRPS += (element.amount * element.rps) * mult
    }
    gameData.rps = newRPS
    // updateRPS()
}

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

function addRocksPerSecond(){
    let toAdd = gameData.rps / (1000/tickInterval)
    gameData.score += toAdd;
    gameData.currency += toAdd;
}

function checkAchievements(){
    gameData.achievements.score.filter(a=>!a.obtained).forEach(a=>{
        if(gameData.score >= a.condition){
            a.obtained = true;
            //do something special
        }
    })

    gameData.achievements.rps.filter(a=>!a.obtained).forEach(a=>{
        if(gameData.rps >= a.condition){
            a.obtained = true;
            //do something special
        }
    })

    gameData.achievements.upgradeCount.filter(a=>!a.obtained).forEach(a=>{
        let upgrades = 0;
        for (const v of Object.values(gameData.upgrades)){
            if(v.purchased == true){
                upgrades++;
            }
        }
        if(upgrades >= a.condition){
            a.obtained = true;
            //do something special
        }
    })

    for (const [key, value] of Object.entries(gameData.achievements.building)){
        value.filter(a=>!a.obtained).forEach(a=>{
            if(gameData.buildings[key].amount >= a.condition){
                a.obtained = true
            }
        })
    }

    if(gameData.ticksPlayed*tickInterval >= 600000){
        gameData.achievements.special["playtime-10m"].obtained = true
    }
}