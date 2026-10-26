// The Player class. Export it as the default export.
//
// Properties:
// - name
// - times (an array that holds the time it took to solve each riddle)
//
// Methods:
// - recordTime(start, end)
//   - calculate the duration (end - start) and add it to the times array
// - showStats()
//   - show the total time and the average time per riddle
export default class Player {
    constructor(name){
        this.name=name
        this.times=[]
    }

    recordTime(start, end) {
        const duration = (end - start) / 1000
        this.times.push(duration)
    }

    showStats() {
        let total = 0

        for(const time of this.times){
            total += time
        }

        const average = total/this.times.length
        console.log("Total time:", total, "seconds")
        console.log("Average time:", average, "seconds");
    }
}