const API_URL = 'http://localhost:3002/api';

// Regular Email/Password Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('error');
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.user.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'user.html';
      }
    } else {
      errorDiv.textContent = data.message || 'Login failed';
      errorDiv.style.color = '#e74c3c';
    }
  } catch (error) {
    errorDiv.textContent = 'Connection error. Please try again.';
    errorDiv.style.color = '#e74c3c';
  }
});
