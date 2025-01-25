const API_URL = 'http://localhost:4004/api/v1';

// Show specific forms based on navigation
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('user-dashboard').style.display = 'none';
    document.getElementById('sessions-dashboard').style.display = 'none';
    document.getElementById('health-check').style.display = 'block';
}

function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('user-dashboard').style.display = 'none';
    document.getElementById('sessions-dashboard').style.display = 'none';
    document.getElementById('health-check').style.display = 'block';
}

// Authentication functions
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });

    if (response.ok) {
        showUserDashboard();
    } else {
        data = await response.json()
        console.error(data)
        alert(`Login failed: ${data.message}`);
    }
}

async function register(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
        credentials: 'include',
    });

    if (response.ok) {
        showLoginForm();
    } else {
        data = await response.json()
        console.error(data)
        alert(`Registration failed: ${data.message}`);
    }
}

function showUserDashboard() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('user-dashboard').style.display = 'block';
    document.getElementById('sessions-dashboard').style.display = 'none';
    document.getElementById('health-check').style.display = 'none';
    
    fetchUserInfo();
}


function showSessionsDashboard() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('user-dashboard').style.display = 'none';
    document.getElementById('sessions-dashboard').style.display = 'block';
    document.getElementById('health-check').style.display = 'none';
    
    fetchSessionsInfo();
}

// Fetch user info
async function fetchUserInfo() {
    const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        credentials: 'include', 
    });

    if (response.ok) {
        const data = await response.json();
        document.getElementById('user-info').innerHTML = `
            <p>Email: ${data.email}</p>
        `;
    } else {
        data = await response.json()
        console.error(data)
        if (data?.errorCode === "InvalidAccessToken") {
            showLoginForm()
        } else {
            alert(`Failed to fetch user info: ${data.message}`);
        }
    }
}

async function fetchSessionsInfo() {
    const response = await fetch(`${API_URL}/sessions`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        credentials: 'include', 
    });

    if (response.ok) {
        const sessions = await response.json();
        displaySessions(sessions);
    } else {
        const data = await response.json();
        console.error(data);
        alert(`Failed to fetch sessions: ${data.message}`);
    }
}

function displaySessions(sessions) {
    const sessionsContainer = document.getElementById('sessions-container');
    sessionsContainer.innerHTML = '';
    
    sessions.forEach(session => {
        const sessionElement = document.createElement('div');
        sessionElement.classList.add('session');

        const userAgentElement = document.createElement('p');
        userAgentElement.innerText = `User Agent: ${session.userAgent}`;

        const createdAtElement = document.createElement('p');
        createdAtElement.innerText = `Created At: ${new Date(session.createdAt).toLocaleString()}`;

        const isCurrentElement = document.createElement('p');
        isCurrentElement.innerText = session.isCurrent ? 'Current session' : 'Past session';

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete Session';
        deleteButton.addEventListener('click', () => deleteSession(session._id));

        sessionElement.appendChild(userAgentElement);
        sessionElement.appendChild(createdAtElement);
        sessionElement.appendChild(isCurrentElement);
        sessionElement.appendChild(deleteButton);

        sessionsContainer.appendChild(sessionElement);
    });
}

async function deleteSession(sessionId) {
    const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        credentials: 'include',
    });

    if (response.ok) {
        fetchSessionsInfo();
    } else {
        const data = await response.json();
        console.error(data);
        alert(`Failed to delete session: ${data.message}`);
    }
}

async function logout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        credentials: 'include',
    });

    if (response.ok) {
        showLoginForm();
    } else {
        data = await response.json()
        console.error(data)
        alert(`Logout failed: ${data.message}`);
    }
}


function getAuthToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        if (cookie.includes('auth_token')) {
            return cookie.split('=')[1];
        }
    }
    return '';
}

async function checkHealth() {
    const response = await fetch(`${API_URL}/health`, { method: 'GET' });
    const status = await response.json();
    document.getElementById('health-status').innerText = `Status: ${status.status}`;
}

async function checkAuthorization() {
    let response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        credentials: 'include', 
    });

    if (response.ok) {
        showUserDashboard();
    } else {
        const data = await response.json();
        console.error(data);

        if (data.message === 'Not authorized') {
            console.log('Authorization failed. Attempting to refresh token...');
            await refreshAuthToken();
        } else {
            alert(`Authorization failed: ${data.message}`);
            showLoginForm();
        }
    }
}

async function refreshAuthToken() {
    const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'GET',
        credentials: 'include',
    });

    if (response.ok) {
        console.log('Token refreshed successfully');
        checkAuthorization();
    } else {
        const data = await response.json();
        console.error(data);
        showLoginForm();
    }
}


checkAuthorization();