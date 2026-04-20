const API_BASE_URL = "" 

async function parseError(response) {
    let message = "Une erreur est survenue"
    try {
        const payload = await response.json()
        if (payload?.error) {
            message = payload.error
        }
    } catch {
        message = response.statusText || message
    }
    return message
}

async function post(path, body) {
    const response = await fetch(`${API_BASE_URL}${path}`, { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        const message = await parseError(response)
        throw new Error(message)
    }

    return response.json()
}

export async function loginUser(email, password) {
    return post("/login", { email, password })
}

export async function registerUser(email, password) {
    return post("/signup", { email, password })
}