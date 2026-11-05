// Entry point of the game. Run it with: node app.js
//
// This file should:
// 1. Import PromptSync (from 'prompt-sync') and create the `prompt` function.
// 2. Import the Riddle class, the Player class, and the array of all riddles (from riddles/index.js).
// 3. Show a welcome message and ask the player for their name, then create a Player object.
// 4. Loop over all riddles. For each riddle:
//    - save the start time (Date.now())
//    - create a Riddle object and call its ask() method
//    - save the end time (Date.now())
//    - save the time using player.recordTime()
// 5. After the loop, call player.showStats() to show total time and average time per riddle.


import PromptSync from 'prompt-sync';
import Player from './classes/Player.js';
import Riddle from './classes/Riddle.js';
import { getAllRiddles, createRiddle, updateRiddle, deleteRiddle} from './api/riddlesApi.js';
import { findPlayerByName, createPlayer,  updatePlayer, getAllPlayers } from './api/playersApi.js';

const prompt = PromptSync()

function shuffle(array){
    for(let i = array.length-1; i>0; i--){
        const randomIndex = Math.floor(Math.random()*(i+1))

        [array[i],array[randomIndex]] = [array[randomIndex],array[i]]
    }
    return array
}

async function playGame() {
const riddles = await getAllRiddles()

console.log("Welcome to the Riddle Game!")
const playerName = prompt("What is your name? ")

let savedPlayer = await findPlayerByName(playerName)
if (!savedPlayer) {
        savedPlayer = await createPlayer(playerName)
        console.log("Welcome, new player!")
    }
    else if (savedPlayer.lowestTime !== null) {
        console.log(`Hi ${playerName}! Your previous lowest time was ${savedPlayer.lowestTime} seconds.`)
    }
const player= new Player(playerName)

let level = prompt("Choose difficulty: easy / medium / hard: ").toLowerCase()

while(level !== "easy" && level !== "medium" && level !=="hard") {
    console.log("Invalid difficulty, try again.")
    level = prompt("Choose difficulty: easy / medium / hard: ").toLowerCase()
}

const filteredRiddles = riddles.filter((riddle)=> {return riddle.difficulty===level}) 

if (filteredRiddles.length === 0) {
        console.log("No riddles found for this difficulty.")
        return;
    }

const shuffledRiddles = shuffle(filteredRiddles)


for(const riddleData of shuffledRiddles) {
    const startTime = Date.now()

    const riddle = new Riddle(
    riddleData.id,
    riddleData.name,
    riddleData.taskDescription,
    riddleData.correctAnswer,
    riddleData.timeLimit,
    riddleData.hint
)

    const penalty = riddle.ask(prompt);

    const endTime = Date.now()

    player.recordTime(startTime, endTime, penalty)
}


const totalTime = player.showStats()

console.log(`Great job, ${playerName}!`)
console.log(`Your time: ${totalTime.toFixed(2)} seconds`)

if (savedPlayer.lowestTime === null || totalTime < savedPlayer.lowestTime) {
    savedPlayer.lowestTime = totalTime
    await updatePlayer(savedPlayer)
    console.log("New record! Time updated.")
}
else {
    console.log("You did not beat your previous record.");
}


}



async function createNewRiddle() {
    const name = prompt("Enter riddle name: ")
    const taskDescription = prompt("Enter description: ")
    const correctAnswer = prompt("Enter correct answer: ")

    const difficulty = prompt("Difficulty (easy / medium / hard): ")
    const timeLimit = Number(prompt("Time limit in seconds: "))
    const hint = prompt("Enter hint: ")

    const newRiddle = {
        name,
        taskDescription,
        correctAnswer,
        difficulty,
        timeLimit,
        hint
    }
    const savedRiddle = await createRiddle(newRiddle)

    console.log("Riddle saved!");
    console.log("New riddle ID:", savedRiddle.id);
}

async function readAllRiddles() {
    const riddles = await getAllRiddles()

    for (const riddle of riddles) {
        console.log("ID:", riddle.id)
        console.log("Name:", riddle.name)
        console.log("Question:", riddle.taskDescription)
        console.log("Answer:", riddle.correctAnswer)
        console.log("--------------------")
    }
}

async function updateExistingRiddle() {
    const id = Number(prompt("Enter riddle ID to update: "))

    const riddles = await getAllRiddles()

    const existingRiddle = riddles.find((riddle) => {return riddle.id === id})

    if (!existingRiddle) {
        console.log("Riddle not found!")
        return
    }

    console.log("Current riddle:", existingRiddle)

    const name = prompt("Enter new name: ")
    const taskDescription = prompt("Enter new description: ")
    const correctAnswer = prompt("Enter new correct answer: ")
    const difficulty = prompt("Enter new difficulty: ").toLowerCase()
    const timeLimit = Number(prompt("Enter new time limit: "))
    const hint = prompt("Enter new hint: ")

    const updatedRiddle = {
        name,
        taskDescription,
        correctAnswer,
        difficulty,
        timeLimit,
        hint
    };

    await updateRiddle(id, updatedRiddle)

    console.log("Riddle updated successfully!")
}

async function deleteExistingRiddle() {
    const id = Number(prompt("Enter riddle ID to delete: "))

    const riddles = await getAllRiddles()

    const existingRiddle = riddles.find((riddle) => {return riddle.id === id })

    if (!existingRiddle) {
        console.log("Riddle not found!")
        return
    }

    console.log("Riddle to delete:", existingRiddle.name)

    const confirm = prompt("Are you sure? (yes/no): ")

    if (confirm.toLowerCase() !== "yes") {
        console.log("Deletion cancelled.")
        return
    }

    await deleteRiddle(id)

    console.log("Riddle deleted successfully!")
}

async function showLeaderboard() {
    const players = await getAllPlayers()

    const rankedPlayers = players
        .filter((player) => player.lowestTime !== null).sort((a, b) => a.lowestTime - b.lowestTime)
        console.log("\n🏆 Leaderboard:")

    if (rankedPlayers.length === 0) {
        console.log("No scores yet!")
        return
    }

    rankedPlayers.forEach((player, index) => {
        console.log(`${index + 1}. ${player.name} - ${player.lowestTime.toFixed(2)} seconds`)
    })
}


while (true) {

    console.log("\nWhat do you want to do?")
    console.log("1. Play the game")
    console.log("2. Create a new riddle")
    console.log("3. Read all riddles")
    console.log("4. Update an existing riddle")
    console.log("5. Delete a riddle")
    console.log("6. View leaderboard")
    console.log("0. Exit")

    const choice = prompt("Choose an option: ")

    try {
        if (choice === "1") {
            await playGame()
        }
        else if (choice === "2") {
            await createNewRiddle()
        }
        else if (choice === "3") {
            await readAllRiddles()
        }
        else if (choice === "4") {
            await updateExistingRiddle()
        } 
        else if (choice === "5") {
            await deleteExistingRiddle()
        }
        else if (choice === "6") {
            await showLeaderboard()
        }
        else if (choice === "0") {
            console.log("Goodbye!")
            break;
        }
        else {
            console.log("Invalid choice!")
        }
    }
    catch (error) {
        console.log("Something went wrong:", error.message)
        console.log("Cause:", error.cause)
    }
    }