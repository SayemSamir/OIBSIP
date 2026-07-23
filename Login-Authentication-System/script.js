
    const STORAGE_KEY = 'aura_users_db';
    const SESSION_KEY = 'aura_active_session';

    const quotes = [
      { text: "Consistency is what transforms average into excellence.", author: "Tech Wisdom" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
      { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
      { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
      { text: "Make it work, make it right, make it fast.", author: "Kent Beck" }
    ];

    async function hashPassword(text) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function showToast(msg, type = 'info') {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
      toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 3500);
    }

    function getUsers() { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    function saveUsers(users) { localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); }

    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      document.getElementById('theme-btn').textContent = next === 'dark' ? '🌙' : '☀️';
    }

    function togglePassword(inputId, iconElem) {
      const input = document.getElementById(inputId);
      if (input.type === 'password') {
        input.type = 'text';
        iconElem.textContent = '👁️';
      } else {
        input.type = 'password';
        iconElem.textContent = '🙈';
      }
    }

    function switchTab(tab) {
      const mainCard = document.getElementById('main-card');
      const authNav = document.getElementById('auth-nav');
      
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));

      if (tab === 'login') {
        authNav.style.display = 'flex';
        mainCard.classList.remove('wide');
        document.getElementById('tab-login').classList.add('active');
        document.getElementById('view-login').classList.add('active');
      } else if (tab === 'register') {
        authNav.style.display = 'flex';
        mainCard.classList.remove('wide');
        document.getElementById('tab-register').classList.add('active');
        document.getElementById('view-register').classList.add('active');
      } else if (tab === 'dashboard') {
        authNav.style.display = 'none';
        mainCard.classList.add('wide');
        document.getElementById('view-dashboard').classList.add('active');
      }
    }

    document.getElementById('reg-password').addEventListener('input', (e) => {
      const val = e.target.value;
      const rules = {
        len: val.length >= 8,
        num: /\d/.test(val),
        upper: /[A-Z]/.test(val),
        lower: /[a-z]/.test(val)
      };

      document.getElementById('rule-len').classList.toggle('valid', rules.len);
      document.getElementById('rule-num').classList.toggle('valid', rules.num);
      document.getElementById('rule-upper').classList.toggle('valid', rules.upper);
      document.getElementById('rule-lower').classList.toggle('valid', rules.lower);

      const score = Object.values(rules).filter(Boolean).length;
      const bar = document.getElementById('strength-bar');
      const colors = ['#f43f5e', '#f43f5e', '#f59e0b', '#06b6d4', '#10b981'];
      bar.style.width = (score * 25) + '%';
      bar.style.backgroundColor = colors[score];
    });

    document.getElementById('reg-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('reg-username').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;

      const users = getUsers();
      if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return showToast('Username is already taken!', 'error');
      }
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return showToast('Email is already registered!', 'error');
      }

      const hashed = await hashPassword(password);
      const newUser = {
        username,
        email,
        password: hashed,
        joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        logins: 0
      };

      users.push(newUser);
      saveUsers(users);

      showToast('Registration Successful! Switching to Login...', 'success');
      document.getElementById('login-user').value = username;

      setTimeout(() => {
        switchTab('login');
      }, 1000);
    });

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const userInput = document.getElementById('login-user').value.trim();
      const passInput = document.getElementById('login-pass').value;
      const btn = document.getElementById('login-btn');

      btn.innerHTML = `<div class="spinner"></div> Signing In...`;

      const hashed = await hashPassword(passInput);
      const users = getUsers();

      const user = users.find(u => 
        (u.username.toLowerCase() === userInput.toLowerCase() || u.email.toLowerCase() === userInput.toLowerCase()) && 
        u.password === hashed
      );

      setTimeout(() => {
        btn.innerHTML = `<span>Sign In</span> 🔑`;

        if (!user) {
          return showToast('Invalid credentials!', 'error');
        }

        user.logins += 1;
        saveUsers(users);

        localStorage.setItem(SESSION_KEY, user.username);
        showToast('Login Successful!', 'success');
        loadDashboard(user);
        switchTab('dashboard');
      }, 800);
    });

    function loadDashboard(user) {
      document.getElementById('dash-name').textContent = user.username;
      document.getElementById('dash-email-text').textContent = user.email;
      document.getElementById('dash-avatar').textContent = user.username.charAt(0).toUpperCase();
      document.getElementById('dash-logins').textContent = user.logins;
      document.getElementById('dash-joined').textContent = user.joined;
      generateQuote();
    }

    function generateQuote() {
      const q = quotes[Math.floor(Math.random() * quotes.length)];
      document.getElementById('ai-quote').textContent = `"${q.text}"`;
      document.getElementById('ai-author').textContent = `— ${q.author}`;
    }

    function copyUserData() {
      const sessionUser = localStorage.getItem(SESSION_KEY);
      const users = getUsers();
      const user = users.find(u => u.username === sessionUser);
      if (user) {
        navigator.clipboard.writeText(`Username: ${user.username}, Email: ${user.email}`);
        showToast('User info copied to clipboard!', 'success');
      }
    }

    function logout() {
      localStorage.removeItem(SESSION_KEY);
      showToast('Logged out successfully.', 'info');
      document.getElementById('login-form').reset();
      switchTab('login');
    }

    document.addEventListener('DOMContentLoaded', () => {
      const activeUser = localStorage.getItem(SESSION_KEY);
      if (activeUser) {
        const users = getUsers();
        const user = users.find(u => u.username === activeUser);
        if (user) {
          loadDashboard(user);
          switchTab('dashboard');
        }
      }
    });
  
