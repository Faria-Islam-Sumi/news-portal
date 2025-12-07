const API_URL = "http://localhost:3000";

// --- Authentication Helpers ---

function saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
    // Dispatch event to notify app about user change
    window.dispatchEvent(new Event('user-updated'));
}

async function login(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
    }

    const data = await response.json();
    saveUser(data.user);
    return data.user;
}

function logout() {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('user-updated'));
}

function getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

async function signup(name, email, password) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Signup failed");
    }

    const data = await response.json();
    return data.user;
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
        const error = await response.json();
        throw new Error(error.error || "Request failed");
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