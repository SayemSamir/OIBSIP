    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playClickSound() {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    }

    /* --- DOM ELEMENTS --- */
    const tempInput = document.getElementById('tempInput');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const swapBtn = document.getElementById('swapBtn');
    const themeToggle = document.getElementById('themeToggle');
    const glassCard = document.getElementById('glassCard');
    const resC = document.getElementById('resC');
    const resF = document.getElementById('resF');
    const resK = document.getElementById('resK');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const cursor = document.getElementById('cursor');

    /* --- CUSTOM CURSOR FOLLOW --- */
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    /* --- 3D GLASS CARD TILT EFFECT --- */
    glassCard.addEventListener('mousemove', (e) => {
      const rect = glassCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      glassCard.style.transform = `rotateX(${-y / 20}deg) rotateY(${x / 20}deg)`;
    });

    glassCard.addEventListener('mouseleave', () => {
      glassCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });

    /* --- RIPPLE EFFECT --- */
    document.querySelectorAll('.btn, .swap-btn').forEach(button => {
      button.addEventListener('click', function(e) {
        playClickSound();
        const circle = document.createElement('span');
        const diameter = Math.max(this.clientWidth, this.clientHeight);
        const radius = diameter / 2;
        const rect = this.getBoundingClientRect();

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');

        const ripple = this.getElementsByClassName('ripple')[0];
        if (ripple) ripple.remove();

        this.appendChild(circle);
      });
    });

    /* --- TOAST NOTIFICATIONS --- */
    function showToast(message, isError = false) {
      const toast = document.createElement('div');
      toast.className = `toast ${isError ? 'error' : ''}`;
      toast.innerHTML = `${isError ? '⚠️' : '✨'} <span>${message}</span>`;
      document.getElementById('toastContainer').appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }

    /* --- CONVERSION LOGIC --- */
    function convert() {
      const val = parseFloat(tempInput.value);

      if (isNaN(val)) {
        showToast('Please enter a valid temperature', true);
        return;
      }

      const inputUnit = fromUnit.value;

      // Absolute Zero Validation
      if ((inputUnit === 'C' && val < -273.15) ||
          (inputUnit === 'F' && val < -459.67) ||
          (inputUnit === 'K' && val < 0)) {
        showToast('Temperature below Absolute Zero!', true);
        return;
      }

      // Show Loading State
      btnText.style.display = 'none';
      btnLoader.style.display = 'block';

      setTimeout(() => {
        let celsius, fahrenheit, kelvin;

        if (inputUnit === 'C') {
          celsius = val;
          fahrenheit = (val * 9/5) + 32;
          kelvin = val + 273.15;
        } else if (inputUnit === 'F') {
          celsius = (val - 32) * 5/9;
          fahrenheit = val;
          kelvin = celsius + 273.15;
        } else if (inputUnit === 'K') {
          celsius = val - 273.15;
          fahrenheit = (celsius * 9/5) + 32;
          kelvin = val;
        }

        resC.textContent = `${celsius.toFixed(2)} °C`;
        resF.textContent = `${fahrenheit.toFixed(2)} °F`;
        resK.textContent = `${kelvin.toFixed(2)} K`;

        addHistory(val, inputUnit, toUnit.value, 
                   toUnit.value === 'C' ? celsius : toUnit.value === 'F' ? fahrenheit : kelvin);

        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        showToast('Converted successfully!');
      }, 300);
    }

    /* --- INSTANT CONVERSION ON INPUT --- */
    tempInput.addEventListener('input', () => {
      if (tempInput.value !== '') convert();
      else clearResults();
    });

    /* --- ENTER KEY SUPPORT --- */
    tempInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') convert();
    });

    convertBtn.addEventListener('click', convert);

    /* --- SWAP UNITS --- */
    swapBtn.addEventListener('click', () => {
      const temp = fromUnit.value;
      fromUnit.value = toUnit.value;
      toUnit.value = temp;
      if (tempInput.value !== '') convert();
    });

    /* --- CLEAR FUNCTIONALITY --- */
    function clearResults() {
      resC.textContent = '--';
      resF.textContent = '--';
      resK.textContent = '--';
    }

    clearBtn.addEventListener('click', () => {
      tempInput.value = '';
      clearResults();
      showToast('Cleared input & results');
    });

    /* --- HISTORY MANAGEMENT --- */
    function addHistory(val, from, to, result) {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.innerHTML = `
        <span>${val} °${from} ➔ ${result.toFixed(2)} °${to}</span>
        <span style="opacity: 0.6;">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      `;
      historyList.prepend(li);

      if (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
      }
    }

    clearHistoryBtn.addEventListener('click', () => {
      historyList.innerHTML = '';
      showToast('History cleared');
    });

    /* --- COPY TO CLIPBOARD --- */
    function copyToClipboard(id) {
      const text = document.getElementById(id).textContent;
      if (text === '--') return;
      navigator.clipboard.writeText(text);
      showToast(`Copied ${text} to clipboard!`);
    }

    /* --- DARK/LIGHT MODE TOGGLE --- */
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      if (currentTheme === 'light') {
        document.body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
      } else {
        document.body.setAttribute('data-theme', 'light');
        themeToggle.textContent = '☀️';
      }
    });
