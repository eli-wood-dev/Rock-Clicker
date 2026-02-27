/**
 * Made by Eli Wood and Gurbaz Sogi
 * 2026-02-27
 * This file contains the logic for displaying the game to the user and handles all DOM manipulation
 */

let currencyDisplay;
let rpsDisplay;
let clickValueDisplay;

// Buttons
let buyPointerBtn;
let buyPickaxeBtn;
let upgradeShop;
let achievementDisplay;
let recentAchievementDisplay;
let resetBtn;

// In ms
const tickInterval = 20;
let currentTick = 0;

// In ticks
const saveInterval = 20;

window.addEventListener("load", () => {
    // Load / init save
    if (!localStorage.getItem("gameData")) {
        localStorage.setItem("gameData", JSON.stringify(defaultGameData));
    } else {
        gameData = JSON.parse(localStorage.getItem("gameData"));
    }

    // Grab displays
    currencyDisplay = document.querySelector("#currencyDisplay");
    rpsDisplay = document.querySelector("#rpsDisplay span");
    clickValueDisplay = document.querySelector("#click-value-display");
    upgradeShop = document.querySelector("#upgrade-shop")
    achievementDisplay = document.querySelector("#achievement-display")
    recentAchievementDisplay = document.querySelector("#recent-achievement-display")

    //update the click value on startup
    clickValueDisplay.innerText = 2**getUpgradeCount("click");

    // Wire the rock click
    const clicker = document.querySelector("#clickTarget");
    clicker.addEventListener("click", () => {
        click();
        updateCurrency();
        updateRPS();
    });

    // Grab buttons
    buyPointerBtn = document.querySelector("#click");
    buyPickaxeBtn = document.querySelector("#pickaxe");
    resetBtn = document.querySelector("#resetBtn");

    // Wire building buttons
    buyPointerBtn.addEventListener("click", () => {
        const ok = purchaseBuilding("pointer");
        if (!ok) {
            buyPointerBtn.classList.add("invalid")
            setTimeout(() => { buyPointerBtn.classList.remove("invalid") }, 300);
            return
            //   alert("Not enough rocks to buy a Pointer!");
        }
        buyPointerBtn.querySelector(".amount").textContent = gameData.buildings.pointer.amount
        buyPointerBtn.querySelector(".price").textContent = gameData.buildings.pointer.price + " Rocks"

        updateGameRPS();
        updateCurrency();
        updateRPS();
    });

    buyPickaxeBtn.addEventListener("click", () => {
        const ok = purchaseBuilding("pickaxe");
        if (!ok) {
            buyPickaxeBtn.classList.add("invalid")
            setTimeout(() => { buyPickaxeBtn.classList.remove("invalid") }, 300);
            return
            //   alert("Not enough rocks to buy a Pickaxe!");
        }
        buyPickaxeBtn.querySelector(".amount").textContent = gameData.buildings.pickaxe.amount
        buyPickaxeBtn.querySelector(".price").textContent = gameData.buildings.pickaxe.price + " Rocks"

        updateGameRPS();
        updateCurrency();
        updateRPS();
    });

    // Create buttons for all upgrades
    for ([key, value] of Object.entries(gameData.upgrades)) {
        let b = document.createElement("button");
        b.classList.add("shop-item")
        b.type = "button"
        b.id = key

        let buttonName = document.createElement("span")
        buttonName.classList.add("shop-name")
        buttonName.innerText = value.name
        b.appendChild(buttonName)

        let buttonDesc = document.createElement("span")
        buttonDesc.classList.add("shop-meta")
        buttonDesc.innerText = value.description
        b.appendChild(buttonDesc)

        let buttonPrice = document.createElement("span")
        buttonPrice.classList.add("shop-meta")
        buttonPrice.classList.add("price")
        buttonPrice.innerText = value.price + " Rocks"
        b.appendChild(buttonPrice)

        //buy upgrade
        b.addEventListener("click", () => {
            const ok = purchaseUpgrade(b.id);
            if (!ok) {
                b.classList.add("invalid")
                b.addEventListener('animationend', () => {
                    b.classList.remove('invalid');
                }, { once: true });
                return
            }
            b.classList.add("hidden")

            updateBuildingRpsGain(document.querySelector("#" + b.id.split("-")[0]))

            updateGameRPS();
            updateCurrency();
            updateRPS();

            //hardcoded for now, could add logic to make this for just the `click` upgrades
            clickValueDisplay.innerText = 2**getUpgradeCount("click");
        })

        //if already bought on this save
        if (value.purchased) {
            b.classList.add("hidden")
        }

        //hardcoded solution to add upgrade images - might change
        let img = document.createElement("img");
        img.classList.add("shop-img");

        if (key === "pickaxe-1") img.src = "images/stone.png";
        if (key === "pickaxe-2") img.src = "images/iron.png";
        if (key === "pickaxe-3") img.src = "images/diamond.png";
        if (key === "pickaxe-4") img.src = "images/netherite.png";
        if (key.startsWith("click")) img.src = "images/pointer.png";

        img.alt = value.name;

        b.appendChild(img);

        upgradeShop.appendChild(b)
    }

    // Add all achievements to the DOM

    // Score based achievements
    for (a of gameData.achievements.score) {
        let e = document.createElement("div")
        e.classList.add("achievement-item")
        e.id = "score-" + a.condition

        let achievementName = document.createElement("span")
        achievementName.classList.add("shop-name")
        achievementName.innerText = a.name
        e.appendChild(achievementName)

        let achievementDesc = document.createElement("span")
        achievementDesc.classList.add("shop-meta")
        achievementDesc.innerText = a.description
        e.appendChild(achievementDesc)

        achievementDisplay.appendChild(e)
    }

    // RPS based achievements
    for (a of gameData.achievements.rps) {
        let e = document.createElement("div")
        e.classList.add("achievement-item")
        e.id = "rps-" + a.condition

        let achievementName = document.createElement("span")
        achievementName.classList.add("shop-name")
        achievementName.innerText = a.name
        e.appendChild(achievementName)

        let achievementDesc = document.createElement("span")
        achievementDesc.classList.add("shop-meta")
        achievementDesc.innerText = a.description
        e.appendChild(achievementDesc)

        achievementDisplay.appendChild(e)
    }

    // Upgrade count based achievements
    for (a of gameData.achievements.upgradeCount) {
        let e = document.createElement("div")
        e.classList.add("achievement-item")
        e.id = "upgradeCount-" + a.condition

        let achievementName = document.createElement("span")
        achievementName.classList.add("shop-name")
        achievementName.innerText = a.name
        e.appendChild(achievementName)

        let achievementDesc = document.createElement("span")
        achievementDesc.classList.add("shop-meta")
        achievementDesc.innerText = a.description
        e.appendChild(achievementDesc)

        achievementDisplay.appendChild(e)
    }

    // Building count based achievements
    for (const [key, value] of Object.entries(gameData.achievements.building)){
        for (a of value){
            let e = document.createElement("div")
            e.classList.add("achievement-item")
            e.id = "building-" + key + "-" + a.condition

            let achievementName = document.createElement("span")
            achievementName.classList.add("shop-name")
            achievementName.innerText = a.name
            e.appendChild(achievementName)

            let achievementDesc = document.createElement("span")
            achievementDesc.classList.add("shop-meta")
            achievementDesc.innerText = a.description
            e.appendChild(achievementDesc)

            achievementDisplay.appendChild(e)
        }
    }

    // Special achievements
    for (const [key, value] of Object.entries(gameData.achievements.special)){
        let e = document.createElement("div")
        e.classList.add("achievement-item")
        e.id = "special-" + key

        let achievementName = document.createElement("span")
        achievementName.classList.add("shop-name")
        achievementName.innerText = value.name
        e.appendChild(achievementName)

        let achievementDesc = document.createElement("span")
        achievementDesc.classList.add("shop-meta")
        achievementDesc.innerText = value.description
        e.appendChild(achievementDesc)

        achievementDisplay.appendChild(e)
    }

    //sets initial rps gain on building tooltips to be the correct value from the save file
    buyPointerBtn.querySelector(".amount").textContent = gameData.buildings.pointer.amount
    buyPointerBtn.querySelector(".price").textContent = gameData.buildings.pointer.price + " Rocks"
    updateBuildingRpsGain(buyPointerBtn)

    buyPickaxeBtn.querySelector(".amount").textContent = gameData.buildings.pickaxe.amount
    buyPickaxeBtn.querySelector(".price").textContent = gameData.buildings.pickaxe.price + " Rocks"
    updateBuildingRpsGain(buyPickaxeBtn)

    // Wire reset
    resetBtn.addEventListener("click", () => {
        const sure = confirm("Reset your save? This cannot be undone.");
        if (!sure) return;

        resetGameData();
        updateGameRPS();
        updateCurrency();
        updateRPS();
    });

    // check if any achievements have already been obtained and updat the display

    //score based achievements
    gameData.achievements.score.filter(a=>a.obtained).forEach(a=>{
        achievementDisplay.querySelector("#score-" + a.condition).classList.add("achieved")
    })

    //rps based achievements
    gameData.achievements.rps.filter(a=>a.obtained).forEach(a=>{
        achievementDisplay.querySelector("#rps-" + a.condition).classList.add("achieved")
    })

    //upgrade count based achievements
    gameData.achievements.upgradeCount.filter(a=>a.obtained).forEach(a=>{
        achievementDisplay.querySelector("#upgradeCount-" + a.condition).classList.add("achieved")
    })

    //building count based achievements
    for (const [key, value] of Object.entries(gameData.achievements.building)){
        value.filter(a=>a.obtained).forEach(a=>{
            achievementDisplay.querySelector("#building-" + key + "-" + a.condition).classList.add("achieved")
        })
    }

    //special achievements
    for (const [key, value] of Object.entries(gameData.achievements.special).filter(a=>a[1].obtained)){
        achievementDisplay.querySelector("#special-" + key).classList.add("achieved")
    }

    // Start the game tick loop
    setInterval(gameTick, tickInterval);

    // Initial screen update
    updateGameRPS();
    updateCurrency();
    updateRPS();

    // Logic for help button
    let helpBtn = document.querySelector("#helpBtn");
    let helpPanel = document.querySelector("#helpPanel");
    let helpUpgrades = document.querySelector("#helpUpgrades");
    let helpAchievements = document.querySelector("#helpAchievements");

    // Add possible upgrades to help button
    for (let key in gameData.upgrades) {
        let li = document.createElement("li");
        li.textContent = gameData.upgrades[key].name + 
                        " - " + gameData.upgrades[key].description;
        helpUpgrades.appendChild(li);
    }

    // Add achievements to help button
    for (let group in gameData.achievements) {
        if (Array.isArray(gameData.achievements[group])) {
            for (let i = 0; i < gameData.achievements[group].length; i++) {
                let a = gameData.achievements[group][i];
                let li = document.createElement("li");
                li.textContent = a.name + " - " + a.description;
                helpAchievements.appendChild(li);
            }
        }
    }

    // Help button functionality
    helpBtn.addEventListener("click", function() {
        if (helpPanel.classList.contains("hidden")) {
            helpPanel.classList.remove("hidden");
        } else {
            helpPanel.classList.add("hidden");
        }
    });
});

/**
 * Resets the game to the default state.
 * Forces refresh to update visuals.
 */
function resetGameData() {
    // IMPORTANT: make a fresh copy, not a reference
    gameData = JSON.parse(JSON.stringify(defaultGameData));
    localStorage.setItem("gameData", JSON.stringify(gameData));
    //force reload to update visuals (usually the updates are only triggered on user interaction)
    window.location.reload()
}

/**
 * Updates the currency display with the current amount rounded down
 */
function updateCurrency() {
    currencyDisplay.textContent = Math.floor(gameData.currency);
}

/**
 Updates the rocks-per-second display.
 Displays with 1 decimal of precision
 */
function updateRPS() {
    rpsDisplay.textContent = Math.round(gameData.rps * 10) / 10;
}

/**
 * Updates the tooltip for the specified building to show the rps gain modified by upgrades.
 * @param {object} element the DOM element for the building being updates
 */
function updateBuildingRpsGain(element){
    element.querySelector(".rps").innerText = "+" + (gameData.buildings[element.value].rps * (2**getUpgradeCount(element.id))) + " rps"
}

/**
 * Displays the specified achievement in the recent achievement section which removes itself after 10 seconds.
 * @param {object} ach the game object for the achievement as stored in gameData
 */
function displayRecentAchievement(ach){
    let el = document.createElement("div")

    el.classList.add("achievement-item", "recent")

    let achievementName = document.createElement("span")
    achievementName.classList.add("shop-name")
    achievementName.innerText = ach.name
    el.appendChild(achievementName)

    recentAchievementDisplay.appendChild(el);
    //remove after 10 seconds
    setTimeout(()=>{
        el.remove();
    }, 10000)
}