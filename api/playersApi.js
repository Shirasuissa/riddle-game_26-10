export async function findPlayerByName(name) {
    const res = await fetch(`http://[::1]:3000/players?name=${encodeURIComponent(name)}`)

    if (!res.ok) {
        throw new Error("Failed to find player")
    }

    const players = await res.json()

    return players[0]
}

export async function createPlayer(name) {
    const res = await fetch("http://[::1]:3000/players", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: name,
            lowestTime: null
        })
    })

    if (!res.ok) {
        throw new Error("Failed to create player");
    }

    const data = await res.json();
    return data;
}

export async function updatePlayer(player) {
    const res = await fetch(`http://[::1]:3000/players/${player.id}`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(player)
        }
    )

    if (!res.ok) {
        throw new Error("Failed to update player")
    }

    const data = await res.json()
    return data;
}

export async function getAllPlayers() {
    const res = await fetch("http://[::1]:3000/players")

    if (!res.ok) {
        throw new Error("Failed to load players")
    }

    const data = await res.json()
    return data;
}