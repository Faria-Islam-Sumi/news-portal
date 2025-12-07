const API_URL = "http://localhost:3000";

// --- Authentication Helpers ---

function login(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

function logout() {
    localStorage.removeItem("user");
}

function getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

async function signup(name, email, password) {
    const response = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });
    login(response);
}

// --- API Fetch Wrapper (Auto-adds Headers) ---
async function apiFetch(endpoint, options = {}) {
    const user = getCurrentUser();
    
    // Set headers
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    // Add Simulated Auth Header if user is logged in
    if (user) {
        headers["x-user-id"] = user.id;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    return response.json();
}

export {
    login,
    logout,
    getCurrentUser,
    apiFetch,
    signup
}