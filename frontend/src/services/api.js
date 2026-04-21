const API_BASE_URL = "http://localhost:5005"

const handleError = async (res) => {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText || "Erreur serveur");
};

async function post(path, body) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) await handleError(res);
    return res.json();
}

export const loginUser = (email, password) => post("/login", { email, password });

export const registerUser = (email, password) => post("/signup", { email, password });