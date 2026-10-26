// The Riddle class. Export it as the default export.
//
// Properties (received in the constructor):
// - id
// - name
// - taskDescription
// - correctAnswer
//
// Method:
// - ask(prompt)
//   - show the riddle (name and taskDescription) to the player
//   - ask the player for an answer using the `prompt` function that is passed in
//   - keep asking until the answer is correct

export default class Riddle {
    constructor(id, name, taskDescription, correctAnswer, timeLimit, hint) {
        this.id = id;
        this.name = name;
        this.taskDescription = taskDescription;
        this.correctAnswer = correctAnswer;
        this.timeLimit=timeLimit;
        this.hint=hint
    }

    ask(prompt) {
        const startTime = Date.now()

        console.log(this.name)
        console.log(this.taskDescription)
        console.log("Type 'hint' for a clue (+10 seconds penalty)")

        let penalty =0

        let answer = prompt("Your answer: ")

        while (answer !== this.correctAnswer) {

            if(answer.toLowerCase()==="hint") {
                console.log("Hint:", this.hint)
                penalty+=10
                answer = prompt("Your answer: ")
            } else {
                console.log("Wrong answer, try again!")
            }
            
            answer = prompt("Your answer: ")
        }

        console.log("Correct!")

        const endTime= Date.now()
        const duration = (endTime - startTime) / 1000


        if(duration> this.timeLimit){
            console.log("Too slow! 5 seconds penalty applied.")
            penalty += 5
        }
        return penalty
    }
}