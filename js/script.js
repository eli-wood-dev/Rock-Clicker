let currencyDisplay;
let rpsDisplay;

// Buttons
let buyPointerBtn;
let buyPickaxeBtn;
let upgradeShop;
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

    // Wire the rock click
    const clicker = document.querySelector("#clickTarget");
    clicker.addEventListener("click", () => {
        click();
        updateCurrency();
        updateRPS();
    });

    // Grab buttons
    buyPointerBtn = document.querySelector("#buyPointerBtn");
    buyPickaxeBtn = document.querySelector("#buyPickaxeBtn");
    //   buyClickUpgradeBtn = document.querySelector("#buyClickUpgradeBtn");
    //   buyPickaxeUpgradeBtn = document.querySelector("#buyPickaxeUpgradeBtn");
    upgradeShop = document.querySelector("#upgrade-shop")
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

    /*
      <button class="shop-item" type="button" id="buyClickUpgradeBtn">
          <span class="shop-name">Click Upgrade</span>
          <span class="shop-meta">Doubles click power</span>
      </button>
    */
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
        buttonPrice.innerText = value.price
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

        })

        //if already bought on this save
        if (value.purchased) {
            b.classList.add("hidden")
        }

        upgradeShop.appendChild(b)
    }

    buyPointerBtn.querySelector(".amount").textContent = gameData.buildings.pointer.amount
    buyPointerBtn.querySelector(".price").textContent = gameData.buildings.pointer.price + " Rocks"

    buyPickaxeBtn.querySelector(".amount").textContent = gameData.buildings.pickaxe.amount
    buyPickaxeBtn.querySelector(".price").textContent = gameData.buildings.pickaxe.price + " Rocks"

    //   // Wire upgrade buttons (buys the next upgrade in the chain)
    //   buyClickUpgradeBtn.addEventListener("click", () => {
    //     const key = getNextUpgradeKey("click");
    //     if (!key) {
    //       alert("No more click upgrades available!");
    //       return;
    //     }

    //     const ok = purchaseUpgrade(key);
    //     if (!ok) {
    //       alert("Not enough rocks for that click upgrade!");
    //     }
    //     updateGameRPS();
    //     updateCurrency();
    //     updateRPS();
    //   });

    //   buyPickaxeUpgradeBtn.addEventListener("click", () => {
    //     const key = getNextUpgradeKey("pickaxe");
    //     if (!key) {
    //       alert("No more pickaxe upgrades available!");
    //       return;
    //     }

    //     const ok = purchaseUpgrade(key);
    //     if (!ok) {
    //       alert("Not enough rocks for that pickaxe upgrade!");
    //     }
    //     updateGameRPS();
    //     updateCurrency();
    //     updateRPS();
    //   });

    // Wire reset
    resetBtn.addEventListener("click", () => {
        const sure = confirm("Reset your save? This cannot be undone.");
        if (!sure) return;

        resetGameData();
        updateGameRPS();
        updateCurrency();
        updateRPS();
    });

    // Start the game tick loop
    setInterval(gameTick, tickInterval);

    // Initial screen update
    updateGameRPS();
    updateCurrency();
    updateRPS();
});

/*
Purpose: Reset the game data back to default and save it.
*/
function resetGameData() {
    // IMPORTANT: make a fresh copy, not a reference
    gameData = JSON.parse(JSON.stringify(defaultGameData));
    localStorage.setItem("gameData", JSON.stringify(gameData));
}

/*
Purpose: Update the rocks display.
*/
function updateCurrency() {
    currencyDisplay.textContent = Math.floor(gameData.currency);
}

/*
Purpose: Update the rocks-per-second display.
*/
function updateRPS() {
    rpsDisplay.textContent = Math.round(gameData.rps * 10) / 10;
}

/*
Purpose: Find the next unpurchased upgrade key for a given type (ex: "click" or "pickaxe")
Returns: a string key like "click-1", or null if none left
*/
function getNextUpgradeKey(prefix) {
    const keys = Object.keys(gameData.upgrades)
        .filter((k) => k.startsWith(prefix + "-"))
        .sort((a, b) => {
            // Sort by number after the dash (click-1, click-2, ...)
            const aNum = parseInt(a.split("-")[1], 10);
            const bNum = parseInt(b.split("-")[1], 10);
            return aNum - bNum;
        });

    for (const k of keys) {
        if (gameData.upgrades[k].purchased === false) {
            return k;
        }
    }

    return null;
}