async function simulateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', data.user.username);
        window.location.href = 'dashboard.html';
    } else {
        const error = await response.json();
        alert(error.error);
    }
}
