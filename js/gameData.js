const defaultGameData = 
{
    "ticksPlayed": 0,
    "rps": 0,
    "score": 0,
    "currency": 0,
    "upgrades": {
        "click-1":{
            "name": "Strong Fingers",
            "description": "Doubles the strength of clicks and pointers",
            "price": 50,
            "purchased": false
        },
        "click-2":{
            "name": "Iron Fingers",
            "description": "Doubles the strength of clicks and pointers",
            "price": 150,
            "purchased": false
        },
        "click-3":{
            "name": "Titanium Fingers",
            "description": "Doubles the strength of clicks and pointers",
            "price": 500,
            "purchased": false
        },
        "pickaxe-1":{
            "name": "Stone Pickaxe",
            "description": "Doubles the strength of pickaxes",
            "price": 200,
            "purchased": false
        },
        "pickaxe-2":{
            "name": "Iron Pickaxe",
            "description": "Doubles the strength of pickaxes",
            "price": 500,
            "purchased": false
        },
        "pickaxe-3":{
            "name": "Diamond Pickaxe",
            "description": "Doubles the strength of pickaxes",
            "price": 1000,
            "purchased": false
        },
        "pickaxe-4":{
            "name": "Netherite Pickaxe",
            "description": "Doubles the strength of pickaxes",
            "price": 10000,
            "purchased": false
        }
    },
    "buildings":{
        "pointer":{
            "name": "pointer",
            "amount": 0,
            "price": 10,
            "basePrice": 10,
            "rps": 0.1,
            "upgrade": "click"
        },
        "pickaxe":{
            "name": "pickaxe",
            "amount": 0,
            "price": 50,
            "basePrice": 50,
            "rps": 1,
            "upgrade": "pickaxe"
        }
    },
    "achievements":{
        "score":[
            {
                "name": "Novice Miner",
                "description": "Mine 100 Rocks",
                "condition": 100,
                "obtained": false
            },
            {
                "name": "Expert Miner",
                "description": "Mine 1000 Rocks",
                "condition": 1000,
                "obtained": false
            },
            {
                "name": "Major Miner",
                "description": "Mine 5000 Rocks",
                "condition": 5000,
                "obtained": false
            }
        ],
        "rps":[
            {
                "name": "Novice Autominer",
                "description": "Obtain 5 Rocks per Second",
                "condition": 5,
                "obtained": false
            },
            {
                "name": "Expert Autominer",
                "description": "Obtain 50 Rocks per Second",
                "condition": 50,
                "obtained": false
            },
            {
                "name": "Major Autominer",
                "description": "Obtain 100 Rocks per Second",
                "condition": 100,
                "obtained": false
            }
        ],
        "upgradeCount":[
            {
                "name": "My First Upgrade",
                "description": "Purchase 1 Upgrade",
                "condition": 1,
                "obtained": false
            },
            {
                "name": "Let's Kick It up a Notch",
                "description": "Purchase 5 Upgrades",
                "condition": 5,
                "obtained": false
            },
            {
                "name": "Full Steam Ahead",
                "description": "Purchase All Upgrades",
                "condition": 7,
                "obtained": false
            }
        ],
        "building":{
            "pointer": [
                {
                    "name": "My First Pointer",
                    "description": "Purchase 1 Pointer",
                    "condition": 1,
                    "obtained": false
                },
                {
                    "name": "A Couple Pointers For You",
                    "description": "Purchase 10 Pointers",
                    "condition": 10,
                    "obtained": false
                }
            ], 
            "pickaxe": [
                {
                    "name": "This Pickaxe is Kickaxe",
                    "description": "Purchase 1 Pickaxe",
                    "condition": 1,
                    "obtained": false
                },
                {
                    "name": "A Miner Nitpick",
                    "description": "Purchase 10 Pickaxes",
                    "condition": 10,
                    "obtained": false
                }
            ]
        },
        "special":{
            "playtime-10m": {
                "name": "Rock Addiction",
                "description": "Play for 10 minutes",
                "obtained": false
            }
        }
    }
}

let gameData = defaultGameData