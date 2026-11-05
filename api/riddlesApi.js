export async function getAllRiddles() {
    const res = await fetch("http://localhost:3000/riddles")
    if (!res.ok){
        throw new Error("Failed to load riddles")
    }
    const data = await res.json()
    return data
}

export async function createRiddle(riddle) {
    try{
        const res = await fetch("http://localhost:3000/riddles", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(riddle)
        })

        if(!res.ok)
            throw new Error("Failed to create riddle")

        const data = await res.json()
        return data

    }
    catch{
        console.log("Error creating riddle:", error.message);
        throw error;
    }
    
}

export async function updateRiddle(id, riddle) {
    const res = await fetch(`http://[::1]:3000/riddles/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(riddle)
    })

    if (!res.ok) {
        throw new Error("Failed to update riddle")
    }

    const data = await res.json()
    return data
}

export async function deleteRiddle(id) {
    const res = await fetch(`http://[::1]:3000/riddles/${id}`, {
        method: "DELETE"
    })

    if (!res.ok) {
        throw new Error("Failed to delete riddle")
    }

    return true
}