
    let currentInput = '0';
    let expression = '';
    let isDeg = true;
    let mode = 'basic'; // 'basic' | 'scientific'
    let soundEnabled = true;
    let history = JSON.parse(localStorage.getItem('sci_calc_history') || '[]');

    // --- AUDIO SYNTHESIZER ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playBeep(freq = 520, duration = 0.06) {
      if (!soundEnabled) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    }

    // --- KEYPAD LAYOUT DEFINITIONS ---
    const basicKeys = [
      { label: 'C', action: 'clear', class: 'btn-action' },
      { label: '⌫', action: 'del', class: 'btn-action' },
      { label: '%', action: 'op', val: '%', class: 'btn-op' },
      { label: '÷', action: 'op', val: '/', class: 'btn-op' },
      { label: '7', action: 'num', val: '7' },
      { label: '8', action: 'num', val: '8' },
      { label: '9', action: 'num', val: '9' },
      { label: '×', action: 'op', val: '*', class: 'btn-op' },
      { label: '4', action: 'num', val: '4' },
      { label: '5', action: 'num', val: '5' },
      { label: '6', action: 'num', val: '6' },
      { label: '−', action: 'op', val: '-', class: 'btn-op' },
      { label: '1', action: 'num', val: '1' },
      { label: '2', action: 'num', val: '2' },
      { label: '3', action: 'num', val: '3' },
      { label: '+', action: 'op', val: '+', class: 'btn-op' },
      { label: '±', action: 'sign' },
      { label: '0', action: 'num', val: '0' },
      { label: '.', action: 'dot' },
      { label: '=', action: 'eq', class: 'btn-eq' }
    ];

    const sciKeys = [
      { label: 'sin', action: 'fn', val: 'sin', class: 'btn-sci' },
      { label: 'cos', action: 'fn', val: 'cos', class: 'btn-sci' },
      { label: 'tan', action: 'fn', val: 'tan', class: 'btn-sci' },
      { label: 'π', action: 'const', val: Math.PI.toString(), class: 'btn-sci' },
      { label: 'C', action: 'clear', class: 'btn-action' },
      
      { label: 'log', action: 'fn', val: 'log', class: 'btn-sci' },
      { label: 'ln', action: 'fn', val: 'ln', class: 'btn-sci' },
      { label: '√', action: 'fn', val: 'sqrt', class: 'btn-sci' },
      { label: 'e', action: 'const', val: Math.E.toString(), class: 'btn-sci' },
      { label: '⌫', action: 'del', class: 'btn-action' },

      { label: 'x²', action: 'fn', val: 'sqr', class: 'btn-sci' },
      { label: 'xʸ', action: 'op', val: '^', class: 'btn-sci' },
      { label: 'x!', action: 'fn', val: 'fact', class: 'btn-sci' },
      { label: '(', action: 'num', val: '(', class: 'btn-sci' },
      { label: ')', action: 'num', val: ')', class: 'btn-sci' },

      { label: '7', action: 'num', val: '7' },
      { label: '8', action: 'num', val: '8' },
      { label: '9', action: 'num', val: '9' },
      { label: '÷', action: 'op', val: '/', class: 'btn-op' },
      { label: '%', action: 'op', val: '%', class: 'btn-op' },

      { label: '4', action: 'num', val: '4' },
      { label: '5', action: 'num', val: '5' },
      { label: '6', action: 'num', val: '6' },
      { label: '×', action: 'op', val: '*', class: 'btn-op' },
      { label: '−', action: 'op', val: '-', class: 'btn-op' },

      { label: '1', action: 'num', val: '1' },
      { label: '2', action: 'num', val: '2' },
      { label: '3', action: 'num', val: '3' },
      { label: '+', action: 'op', val: '+', class: 'btn-op' },
      { label: '=', action: 'eq', class: 'btn-eq' },

      { label: '0', action: 'num', val: '0' },
      { label: '.', action: 'dot' },
      { label: '±', action: 'sign' }
    ];

    // --- RENDER KEYPAD ---
    function renderKeypad() {
      const keypad = document.getElementById('keypad');
      keypad.innerHTML = '';
      keypad.className = `keypad ${mode}`;
      
      const keys = mode === 'basic' ? basicKeys : sciKeys;
      keys.forEach(k => {
        const btn = document.createElement('button');
        btn.className = `btn ${k.class || ''}`;
        btn.textContent = k.label;
        btn.onclick = () => handleKey(k);
        keypad.appendChild(btn);
      });
    }

    // --- INPUT HANDLING ---
    function handleKey(key) {
      playBeep(key.action === 'eq' ? 750 : 500);

      switch(key.action) {
        case 'num':
          if (currentInput === '0' || currentInput === 'Error') currentInput = key.val;
          else currentInput += key.val;
          break;

        case 'dot':
          if (!currentInput.includes('.')) currentInput += '.';
          break;

        case 'op':
          expression += currentInput + ' ' + key.val + ' ';
          currentInput = '0';
          break;

        case 'clear':
          currentInput = '0';
          expression = '';
          break;

        case 'del':
          if (currentInput.length > 1) currentInput = currentInput.slice(0, -1);
          else currentInput = '0';
          break;

        case 'sign':
          if (currentInput !== '0') currentInput = (parseFloat(currentInput) * -1).toString();
          break;

        case 'const':
          currentInput = Number(key.val).toFixed(6).replace(/\.?0+$/, '');
          break;

        case 'fn':
          applyScientificFn(key.val);
          break;

        case 'eq':
          calculateResult();
          break;
      }
      updateDisplay();
    }

    function applyScientificFn(fn) {
      const val = parseFloat(currentInput);
      if (isNaN(val)) return;

      let res = 0;
      let rad = isDeg ? (val * Math.PI) / 180 : val;

      switch(fn) {
        case 'sin': res = Math.sin(rad); break;
        case 'cos': res = Math.cos(rad); break;
        case 'tan': res = Math.tan(rad); break;
        case 'log': res = Math.log10(val); break;
        case 'ln': res = Math.log(val); break;
        case 'sqrt': res = Math.sqrt(val); break;
        case 'sqr': res = Math.pow(val, 2); break;
        case 'fact':
          res = factorial(val);
          break;
      }
      currentInput = Number(res.toFixed(8)).toString();
    }

    function factorial(n) {
      if (n < 0 || n > 170) return 'Error';
      if (n === 0 || n === 1) return 1;
      let f = 1;
      for (let i = 2; i <= n; i++) f *= i;
      return f;
    }

    // --- CALCULATION ENGINE ---
    function calculateResult() {
      if (!expression && currentInput === '0') return;
      
      let fullExpr = expression + currentInput;
      let sanitized = fullExpr
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/\^/g, '**')
        .replace(/%/g, '/100');

      try {
        let res = Function(`'use strict'; return (${sanitized})`)();
        res = Math.round(res * 1e10) / 1e10;

        addHistory(fullExpr, res.toString());
        expression = '';
        currentInput = res.toString();
      } catch (e) {
        currentInput = 'Error';
        expression = '';
      }
    }

    // --- DISPLAY & UI UPDATES ---
    function updateDisplay() {
      document.getElementById('resDisplay').textContent = currentInput;
      document.getElementById('exprDisplay').textContent = expression;
    }

    function setMode(m) {
      mode = m;
      document.getElementById('tabBasic').classList.toggle('active', m === 'basic');
      document.getElementById('tabSci').classList.toggle('active', m === 'scientific');
      document.getElementById('modeBadge').textContent = m === 'basic' ? 'Digital Model' : 'Scientific Model';
      renderKeypad();
    }

    function toggleDegRad() {
      isDeg = !isDeg;
      document.getElementById('degRadBtn').textContent = isDeg ? 'DEG' : 'RAD';
    }

    function toggleTheme() {
      const theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', theme);
    }

    function toggleSound() {
      soundEnabled = !soundEnabled;
      document.getElementById('soundBtn').textContent = soundEnabled ? '🔊' : '🔇';
    }

    // --- HISTORY LOGIC ---
    function addHistory(expr, res) {
      history.unshift({ expr, res });
      if (history.length > 15) history.pop();
      localStorage.setItem('sci_calc_history', JSON.stringify(history));
      renderHistory();
    }

    function renderHistory() {
      const list = document.getElementById('historyList');
      list.innerHTML = '';
      if (history.length === 0) {
        list.innerHTML = '<div style="color:var(--text-sub); text-align:center; font-size:0.8rem;">No calculations stored</div>';
        return;
      }
      history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<div class="h-expr">${item.expr} =</div><div class="h-res">${item.res}</div>`;
        div.onclick = () => { currentInput = item.res; updateDisplay(); };
        list.appendChild(div);
      });
    }

    function clearHistory() {
      history = [];
      localStorage.removeItem('sci_calc_history');
      renderHistory();
    }

    // --- KEYBOARD SUPPORT ---
    window.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9') handleKey({ action: 'num', val: e.key });
      else if (e.key === '.') handleKey({ action: 'dot' });
      else if (['+', '-', '*', '/'].includes(e.key)) handleKey({ action: 'op', val: e.key });
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); handleKey({ action: 'eq' }); }
      else if (e.key === 'Backspace') handleKey({ action: 'del' });
      else if (e.key === 'Escape') handleKey({ action: 'clear' });
    });

    // INIT
    renderKeypad();
    renderHistory();

